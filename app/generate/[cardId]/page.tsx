"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount, useSendCalls } from "wagmi";
import { base } from "wagmi/chains";
import { encodeFunctionData, getAddress } from "viem";
import PageHeader from "../../components/PageHeader";
import FlipCard from "../../components/FlipCard";
import CardBackPreview from "../../components/CardBackPreview";
import SimilarCardItem from "../../components/SimilarCardItem";
// import BottomNav from "../../components/BottomNav";
import HeaderNav from "../../components/HeaderNav";
import MintModal from "../../components/MintModal";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import {
  greetingCardsData,
  type GreetingCardData,
} from "@/lib/greeting-cards-data";
import nftAbi from "@/lib/Abi.json";
import { prepareGreetingCardForUpload } from "@/lib/image-composer";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

const MAX_MESSAGE_LENGTH = 280;

const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;

const erc20ApproveAbi = [
  {
    type: "function" as const,
    name: "approve",
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    outputs: [{ name: "", type: "bool" }],
    stateMutability: "nonpayable" as const,
  },
] as const;

type ModalState = "none" | "mint" | "success" | "error";

// Find a card across all categories by its ID
function findCardById(cardId: string): {
  card: GreetingCardData | null;
  categoryKey: string | null;
} {
  for (const [key, category] of Object.entries(greetingCardsData)) {
    const card = category.cards.find((c) => c.id === cardId);
    if (card) return { card, categoryKey: key };
  }
  return { card: null, categoryKey: null };
}

export default function GenerateMeepPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = params.cardId as string;

  const [message, setMessage] = useState("");
  const [isFlipped, setIsFlipped] = useState(true);
  const [modalState, setModalState] = useState<ModalState>("none");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isMinting, setIsMinting] = useState(false);
  const { address: walletAddress, isConnected } = useAccount();
  const { context: miniKitContext } = useMiniKit();
  const miniKitAddress = (
    miniKitContext?.client as { wallet?: { accounts?: string[] } } | undefined
  )?.wallet?.accounts?.[0];
  const { sendCallsAsync, error: sendCallsError } = useSendCalls();

  const lastRecipientRef = useRef<string | null>(null);

  const { card, categoryKey } = useMemo(() => findCardById(cardId), [cardId]);

  // Manifesto (miggles) cards are pre-designed — no custom message
  const isPreDesignedCard = categoryKey === "miggles";

  // Get similar cards from same category (excluding current card)
  const similarCards = useMemo(() => {
    if (!categoryKey) return [];
    return (
      greetingCardsData[categoryKey]?.cards.filter((c) => c.id !== cardId) || []
    );
  }, [categoryKey, cardId]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setMessage(value);
    }
  };

  const handleMint = () => {
    // Open the mint modal
    setModalState("mint");
  };

  const handleMintConfirm = (recipient: string, recipientInput?: string) => {
    if (!card) return;

    const effectiveAddress = walletAddress || miniKitAddress;
    if (!effectiveAddress) {
      setErrorMessage("Please open Evrlink inside the Base app or connect a wallet to mint.");
      setModalState("error");
      return;
    }

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as
      | `0x${string}`
      | undefined;

    if (!contractAddress) {
      setErrorMessage("Contract address is not configured. Please set NEXT_PUBLIC_CONTRACT_ADDRESS.");
      setModalState("error");
      return;
    }

    setIsMinting(true);
    const doMint = async () => {
      try {
        setErrorMessage("");

        // 1) Compose greeting card image with message
        const file = await prepareGreetingCardForUpload(card, message);

        // 2) Upload to IPFS via server route
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/files", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          const data = await res.json().catch(() => null);
          throw new Error(data?.error || "Failed to upload card image to IPFS");
        }

        const ipfsUrl = (await res.json()) as string;

        // `recipient` is already a resolved 0x address from MintModal; checksum for the contract call only.
        const recipientAddressNormalized = getAddress(recipient);

        lastRecipientRef.current = recipient;
        setRecipientAddress(recipient);
        setRecipientName(recipientInput || "");

        const approveData = encodeFunctionData({
          abi: erc20ApproveAbi,
          functionName: "approve",
          args: [contractAddress, 1_000_000n],
        });
        const mintData = encodeFunctionData({
          abi: nftAbi.abi,
          functionName: "mintGreetingCard",
          args: [ipfsUrl, recipientAddressNormalized],
        });

        await sendCallsAsync({
          chainId: base.id,
          calls: [
            { to: USDC_ADDRESS, data: approveData },
            { to: contractAddress, data: mintData },
          ],
        });

        setIsMinting(false);
        setModalState("success");
      } catch (error) {
        console.error("Mint flow error:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "Minting failed. Please try again."
        );
        setModalState("error");
        setIsMinting(false);
      }
    };

    void doMint();
  };

  const handleRetry = () => {
    // Go back to mint modal to try again
    setModalState("mint");
  };

  // Surface batched sendCalls errors into the UI
  useEffect(() => {
    if (!sendCallsError) return;
    console.error("SendCalls error:", sendCallsError);

    let message = "Transaction failed.";
    const msg = sendCallsError.message || String(sendCallsError);
    if (msg.includes("User rejected")) {
      message = "Transaction rejected by user.";
    } else if (msg.toLowerCase().includes("insufficient funds")) {
      message = "Insufficient balance for mint price + gas.";
    } else {
      message = msg;
    }

    setErrorMessage(message);
    setModalState("error");
    setIsMinting(false);
  }, [sendCallsError]);

  const handleCloseModal = () => {
    setModalState("none");
  };

  const handleSimilarMint = (similarCard: GreetingCardData) => {
    router.push(`/generate/${similarCard.id}`);
  };

  if (!card) {
    return (
      <div className="bg-white max-w-lg mx-auto min-h-screen">
        <PageHeader
          title="Personalize Your Card"
          titleClassName="text-[#00B2C7]"
        />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <p className="text-text-secondary text-sm">Card not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white max-w-lg mx-auto pb-10">
      {/* Header */}
      <PageHeader
        title="Personalize Your Card"
        titleClassName="text-[#00B2C7]"
      />

      {/* Navigation */}
      <HeaderNav />

      {/* Flip card + below: max 8px gap (gap-2). No gap when message block is collapsed. */}
      <div
        className={`flex flex-col ${
          isPreDesignedCard || isFlipped ? "gap-2" : "gap-0"
        }`}
      >
        <FlipCard
          cardImage={card.paperImage}
          cardTitle={card.title}
          defaultFlipped={!isPreDesignedCard}
          onFlip={setIsFlipped}
          backContent={
            isPreDesignedCard && card.backImage ? (
              <div className="h-full w-full bg-gray-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={card.backImage}
                  alt={`${card.title} – back`}
                  className="block h-full w-full object-cover"
                />
              </div>
            ) : (
              <CardBackPreview
                message={message}
                maxLength={MAX_MESSAGE_LENGTH}
                embedded
              />
            )
          }
        />

      {/* Pre-designed card: no message, just mint CTA */}
      {isPreDesignedCard ? (
        <div className="px-4 pb-2">
          <p className="text-sm text-text-secondary mb-4">
            This card is pre-designed. Mint as-is to send to someone special.
          </p>
          <button
            type="button"
            onClick={handleMint}
            className="w-full rounded-md btn-primary text-white text-base font-bold leading-[140%] transition-colors active:scale-[0.98]"
            style={{ fontFamily: "'Satoshi', sans-serif", height: 46, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16 }}
          >
            Create for $1 USDC
          </button>
        </div>
      ) : (
        /* Your Message section — only visible after flipping */
        <div
          className={`px-4 pt-0 pb-2 transition-all duration-500 ${
            isFlipped
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden py-0"
          }`}
        >
          <h2 className="text-base font-semibold text-foreground mt-0 mb-2">
            Your Message
          </h2>

          <textarea
            value={message}
            onChange={handleMessageChange}
            placeholder="Write your message here"
            maxLength={MAX_MESSAGE_LENGTH}
            rows={3}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-foreground placeholder:text-text-tertiary outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none transition-colors"
          />

          <p className="text-xs text-text-tertiary mt-1.5">
            {message.length}/{MAX_MESSAGE_LENGTH} characters
          </p>

          <button
            type="button"
            onClick={handleMint}
            className="w-full mt-7 rounded-md btn-primary text-white text-base font-bold leading-[140%] transition-colors active:scale-[0.98]"
            style={{ fontFamily: "'Satoshi', sans-serif", height: 46, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16 }}
          >
            Create for $1 USDC
          </button>
        </div>
      )}
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-border-light" />

      {/* Similar Cards */}
      {similarCards.length > 0 && (
        <div className="pt-4">
          <h2 className="text-base font-semibold text-foreground px-4 mb-2">
            Similar Cards
          </h2>
          <div className="divide-y divide-border-light">
            {similarCards.map((similarCard) => (
              <SimilarCardItem
                key={similarCard.id}
                card={similarCard}
                onClick={() => router.push(`/generate/${similarCard.id}`)}
                onMint={() => handleSimilarMint(similarCard)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Modals */}
      <MintModal
        isOpen={modalState === "mint"}
        onClose={handleCloseModal}
        card={card}
        onMint={handleMintConfirm}
        isMinting={isMinting}
      />

      <SuccessModal
        isOpen={modalState === "success"}
        onClose={handleCloseModal}
        recipientAddress={recipientAddress}
        recipientName={recipientName}
        cardTitle={card?.title || "Greeting Card"}
      />

      <ErrorModal
        isOpen={modalState === "error"}
        onClose={handleCloseModal}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      />
    </div>
  );
}
