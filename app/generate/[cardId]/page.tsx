"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAccount, useWriteContract, useWaitForTransactionReceipt, useSendCalls, useCallsStatus } from "wagmi";
import { base } from "wagmi/chains";
import { parseEther, getAddress, encodeFunctionData } from "viem";
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

// Base chain contract addresses for USDC swap flow
const USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913" as const;
const WETH_ADDRESS = "0x4200000000000000000000000000000000000006" as const;
const SWAP_ROUTER = "0x2626664c2603336E57B271c5C0b26F421741e481" as const; // Uniswap V3 SwapRouter02 on Base
const MINT_PRICE_WEI = parseEther("0.0002");

// Minimal ABIs for batch calls
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

const swapRouterAbi = [
  {
    type: "function" as const,
    name: "exactOutputSingle",
    inputs: [
      {
        name: "params",
        type: "tuple",
        components: [
          { name: "tokenIn", type: "address" },
          { name: "tokenOut", type: "address" },
          { name: "fee", type: "uint24" },
          { name: "recipient", type: "address" },
          { name: "amountOut", type: "uint256" },
          { name: "amountInMaximum", type: "uint256" },
          { name: "sqrtPriceLimitX96", type: "uint160" },
        ],
      },
    ],
    outputs: [{ name: "amountIn", type: "uint256" }],
    stateMutability: "payable" as const,
  },
] as const;

const wethAbi = [
  {
    type: "function" as const,
    name: "withdraw",
    inputs: [{ name: "wad", type: "uint256" }],
    outputs: [],
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
  const [batchId, setBatchId] = useState<string | undefined>();
  const { address: walletAddress, isConnected } = useAccount();
  const {
    writeContractAsync,
    data: txHash,
    error: writeError,
  } = useWriteContract();
  const { isSuccess: isTxSuccess } = useWaitForTransactionReceipt({
    hash: txHash,
  });

  // EIP-5792 batched calls for USDC swap+mint
  const { sendCallsAsync, error: sendCallsError } = useSendCalls();
  const { data: batchResult } = useCallsStatus({
    id: batchId as string,
    query: { enabled: !!batchId, refetchInterval: 2000 },
  });

  // Unified success flag: either ETH tx confirmed or USDC batch succeeded
  const isSuccess = isTxSuccess || batchResult?.status === "success";

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

  const handleMintConfirm = (recipient: string, paymentMethod: "ETH" | "USDC", recipientInput?: string, ethUsdPrice?: number) => {
    if (!card) return;

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

        // Normalize recipient to checksummed address for the contract
        const recipientAddressNormalized = getAddress(recipient);

        lastRecipientRef.current = recipient;
        setRecipientAddress(recipient);
        setRecipientName(recipientInput || "");

        if (paymentMethod === "USDC") {
          // === USDC path: atomic batch via wallet_sendCalls (EIP-5792) ===
          // Batch: approve USDC → swap USDC→WETH → unwrap WETH→ETH → mint NFT
          if (!ethUsdPrice || ethUsdPrice <= 0) {
            throw new Error("ETH price unavailable. Please try again.");
          }

          // Calculate max USDC with 10% slippage buffer (amount is tiny, ~$0.50)
          const maxUsdcRaw = BigInt(Math.ceil(0.0002 * ethUsdPrice * 1.1 * 1e6));

          const approveData = encodeFunctionData({
            abi: erc20ApproveAbi,
            functionName: "approve",
            args: [SWAP_ROUTER, maxUsdcRaw],
          });

          const swapData = encodeFunctionData({
            abi: swapRouterAbi,
            functionName: "exactOutputSingle",
            args: [
              {
                tokenIn: USDC_ADDRESS,
                tokenOut: WETH_ADDRESS,
                fee: 500,
                recipient: walletAddress,
                amountOut: MINT_PRICE_WEI,
                amountInMaximum: maxUsdcRaw,
                sqrtPriceLimitX96: 0n,
              },
            ],
          });

          const unwrapData = encodeFunctionData({
            abi: wethAbi,
            functionName: "withdraw",
            args: [MINT_PRICE_WEI],
          });

          const mintData = encodeFunctionData({
            abi: (nftAbi as { abi: readonly unknown[] }).abi as readonly { type: string; name: string; inputs: readonly { name: string; type: string }[]; outputs: readonly { name: string; type: string }[]; stateMutability: string }[],
            functionName: "mintGreetingCard",
            args: [ipfsUrl, recipientAddressNormalized],
          });

          console.log("Sending batched USDC swap+mint via wallet_sendCalls...");
          console.log("Max USDC:", maxUsdcRaw.toString(), "units (6 decimals)");

          const result = await sendCallsAsync({
            calls: [
              { to: USDC_ADDRESS, data: approveData, value: 0n },
              { to: SWAP_ROUTER, data: swapData, value: 0n },
              { to: WETH_ADDRESS, data: unwrapData, value: 0n },
              { to: contractAddress, data: mintData, value: MINT_PRICE_WEI },
            ],
            chainId: base.id,
          } as Parameters<typeof sendCallsAsync>[0]);

          // Store batch ID — useCallsStatus will poll for completion
          setBatchId(result.id);
          console.log("Batch submitted, ID:", result.id);
        } else {
          // === ETH path: single writeContract call ===
          await writeContractAsync({
            address: contractAddress,
            abi: (nftAbi as { abi: readonly unknown[] }).abi,
            functionName: "mintGreetingCard",
            args: [ipfsUrl, recipientAddressNormalized],
            value: MINT_PRICE_WEI,
            chainId: base.id,
          } as unknown as Parameters<typeof writeContractAsync>[0]);
        }
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

  // Surface contract write errors into the UI (ETH path)
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

  // Surface sendCalls errors (USDC batch path)
  useEffect(() => {
    if (!sendCallsError) return;
    console.error("Batch calls error:", sendCallsError);

    let message = "Transaction failed.";
    const msg = sendCallsError.message || String(sendCallsError);
    if (msg.includes("User rejected") || msg.includes("rejected_by_user")) {
      message = "Transaction rejected by user.";
    } else if (msg.toLowerCase().includes("insufficient")) {
      message = "Insufficient USDC balance for swap.";
    } else if (msg.includes("not supported") || msg.includes("5700")) {
      message = "Your wallet does not support batched transactions. Please use ETH to mint.";
    } else {
      message = msg;
    }

    setErrorMessage(message);
    setModalState("error");
    setIsMinting(false);
    setBatchId(undefined);
  }, [sendCallsError]);

  // Handle batch failure status (USDC path)
  useEffect(() => {
    if (!batchResult || batchResult.status !== "failure") return;
    console.error("Batch calls failed:", batchResult);
    setErrorMessage("USDC swap and mint failed. Please try again or use ETH.");
    setModalState("error");
    setIsMinting(false);
    setBatchId(undefined);
  }, [batchResult]);

  // When transaction confirms (ETH or USDC batch), show success modal and notify recipient
  useEffect(() => {
    if (!isSuccess) return;
    // For ETH path, txHash must exist; for USDC path, batchId must exist
    if (!txHash && !batchId) return;

    console.log("Mint confirmed:", txHash ? `tx=${txHash}` : `batch=${batchId}`);
    setIsMinting(false);
    setModalState("success");
    setBatchId(undefined);

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
  }, [isSuccess, txHash, batchId, walletAddress]);

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
