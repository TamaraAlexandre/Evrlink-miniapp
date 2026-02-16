"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { base } from "wagmi/chains";
import { parseEther, getAddress } from "viem";
import PageHeader from "../../components/PageHeader";
import FlipCard from "../../components/FlipCard";
import CardBackPreview from "../../components/CardBackPreview";
import SimilarCardItem from "../../components/SimilarCardItem";
import BottomNav from "../../components/BottomNav";
import MintModal from "../../components/MintModal";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import {
  greetingCardsData,
  type GreetingCardData,
} from "@/lib/greeting-cards-data";
import nftAbi from "@/lib/Abi.json";
import { prepareGreetingCardForUpload } from "@/lib/image-composer";

const MAX_MESSAGE_LENGTH = 280;

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
  const {
    writeContractAsync,
    data: txHash,
    error: writeError,
  } = useWriteContract();
  const { isSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  const lastRecipientRef = useRef<string | null>(null);

  const { card, categoryKey } = useMemo(() => findCardById(cardId), [cardId]);

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

  const handleMintConfirm = (recipient: string, paymentMethod: "ETH" | "USDT", recipientInput?: string) => {
    if (!card) return;

    if (paymentMethod !== "ETH") {
      setErrorMessage("Only ETH payments are supported right now. Please choose ETH.");
      setModalState("error");
      return;
    }

    if (!isConnected || !walletAddress) {
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

        // 3) Use contract MINT_PRICE (0.0002 ether) so tx succeeds
        const mintPriceWei = parseEther("0.0002");

        // Normalize recipient to checksummed address for the contract
        const recipientAddressNormalized = getAddress(recipient);

        lastRecipientRef.current = recipient;
        setRecipientAddress(recipient);
        setRecipientName(recipientInput || "");

        // 4) Call contract via wagmi with value and chainId so ETH is sent and tx targets Base
        // (ABI type inference can omit value for payable; we pass it explicitly so 0.0002 ETH is sent)
        await writeContractAsync({
          address: contractAddress,
          abi: (nftAbi as { abi: readonly unknown[] }).abi,
          functionName: "mintGreetingCard",
          args: [ipfsUrl, recipientAddressNormalized],
          value: mintPriceWei,
          chainId: base.id,
        } as unknown as Parameters<typeof writeContractAsync>[0]);
      } catch (error) {
        console.error("Mint flow error:", error);
        setErrorMessage(
          error instanceof Error ? error.message : "Minting failed. Please try again."
        );
        setModalState("error");
        setIsMinting(false);
      } finally {
        // Loading stays true until writeError or isSuccess (see useEffects)
      }
    };

    void doMint();
  };

  const handleRetry = () => {
    // Go back to mint modal to try again
    setModalState("mint");
  };

  // Surface contract write errors into the UI
  useEffect(() => {
    if (!writeError) return;
    console.error("Contract write error:", writeError);

    let message = "Transaction failed.";
    const msg = writeError.message || String(writeError);
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
  }, [writeError]);

  // When transaction confirms, show success modal and notify recipient
  useEffect(() => {
    if (!isSuccess || !txHash) return;
    console.log("Mint transaction confirmed:", txHash);
    setIsMinting(false);
    setModalState("success");

    // Fire-and-forget: notify the recipient via Farcaster notification
    const recipient = lastRecipientRef.current;
    if (recipient) {
      fetch("/api/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recipientAddress: recipient,
          senderAddress: walletAddress,
        }),
      }).catch((err) => console.warn("Notification failed (non-critical):", err));
    }
  }, [isSuccess, txHash, walletAddress]);

  const handleCloseModal = () => {
    setModalState("none");
  };

  const handleSimilarMint = (similarCard: GreetingCardData) => {
    router.push(`/generate/${similarCard.id}`);
  };

  if (!card) {
    return (
      <div className="bg-white max-w-lg mx-auto min-h-screen">
        <PageHeader title="Generate a Meep" />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <p className="text-text-secondary text-sm">Card not found</p>
        </div>
      </div>
    );
  }

  const remainingChars = MAX_MESSAGE_LENGTH - message.length;

  return (
    <div className="bg-white max-w-lg mx-auto pb-20">
      {/* Header */}
      <PageHeader title="Generate a Meep" />

      {/* Flip Card: front = card image, back = message preview */}
      <FlipCard
        cardImage={card.paperImage}
        cardTitle={card.title}
        defaultFlipped
        onFlip={setIsFlipped}
        backContent={
          <CardBackPreview
            message={message}
            maxLength={MAX_MESSAGE_LENGTH}
            embedded
          />
        }
      />

      {/* Custom Message Section — only visible after flipping */}
      <div
        className={`px-4 py-4 transition-all duration-500 ${
          isFlipped
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-4 pointer-events-none h-0 overflow-hidden py-0"
        }`}
      >
        <h2 className="text-base font-semibold text-foreground mb-1">
          Custom Message
        </h2>
        <p className="text-sm text-text-secondary mb-3 leading-relaxed">
          Write a heartfelt message for the back of the card. Keep it on one
          line for the best visual effect.
        </p>

        {/* Textarea */}
        <textarea
          value={message}
          onChange={handleMessageChange}
          placeholder="Write your message here"
          maxLength={MAX_MESSAGE_LENGTH}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-foreground placeholder:text-text-tertiary outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none transition-colors"
        />

        {/* Character Counter */}
        <p className="text-xs text-text-tertiary mt-1.5">
          {remainingChars}/{MAX_MESSAGE_LENGTH} characters
        </p>

        {/* Mint Button */}
        <button
          type="button"
          onClick={handleMint}
          className="w-full mt-7 rounded-md btn-gradient text-white text-base font-bold leading-[140%] transition-colors active:scale-[0.98]"
          style={{ fontFamily: "'Satoshi', sans-serif", height: 46, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16 }}
        >
          Mint for {card.price}
        </button>
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

      {/* Bottom Navigation */}
      <BottomNav />

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
