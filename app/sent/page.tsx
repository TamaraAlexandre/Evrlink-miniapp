"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Header from "../components/Header";
import TransactionCardItem from "../components/TransactionCardItem";
import BottomNav from "../components/BottomNav";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import type { Address } from "viem";
import { useSentCards } from "@/lib/use-nft-activity";

function shortAddress(addr: string | undefined | null): string {
  if (addr == null || typeof addr !== "string" || addr.length < 10)
    return addr ?? "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function SentContent() {
  const searchParams = useSearchParams();
  const addressParam = searchParams.get("address")?.trim() ?? "";

  const overrideAddress: Address | null =
    addressParam && isAddress(addressParam) ? (addressParam as Address) : null;

  const {
    data: sentCards,
    isLoading,
    error,
    isConfigured,
  } = useSentCards(overrideAddress);
  const { address: connectedAddress } = useAccount();

  const handleShare = (cardId: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Evrlink Greeting Card",
        text: "Check out this greeting card I sent on Evrlink!",
      });
    }
    console.log("Share sent card:", cardId);
  };

  return (
    <div className="bg-white max-w-lg mx-auto pb-20">
      <Header />

      <div className="px-4 pb-2">
        <h1 className="text-lg font-semibold text-foreground leading-snug">
          Cards you have sent to share
          <br />
          special moments. <span className="inline-block">💌</span>
        </h1>
      </div>

      <div className="mx-4 border-t border-border-light" />

      {!isConfigured && (
        <div className="px-4 py-6 text-center text-sm text-text-secondary">
          Set{" "}
          <code className="bg-muted px-1 rounded">
            NEXT_PUBLIC_CONTRACT_ADDRESS
          </code>{" "}
          to your deployed GreetingCardNFT contract to see sent cards.
        </div>
      )}

      {isConfigured && error && (
        <div className="px-4 py-6 text-center text-sm text-red-600">
          Could not load sent cards. Check that the contract address is correct
          and the contract is deployed.
        </div>
      )}

      {isConfigured && !error && isLoading && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-4xl mb-4">📨</div>
          <p className="text-sm text-text-secondary">Loading sent cards…</p>
        </div>
      )}

      {isConfigured && !error && !isLoading && sentCards.length > 0 && (
        <div className="divide-y divide-border-light">
          {sentCards.map((card) => (
            <TransactionCardItem
              key={card.id}
              headerContent={
                <>
                  Sent to:{" "}
                  <span className="font-semibold text-primary">
                    {shortAddress(card.recipientAddress)}
                  </span>
                </>
              }
              tags={card.tags}
              cardImage={card.cardImage}
              onShare={() => handleShare(card.id)}
            />
          ))}
        </div>
      )}

      {isConfigured && !error && !isLoading && sentCards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-4xl mb-4">📨</div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            {overrideAddress || connectedAddress
              ? "No sent cards found"
              : "Connect your wallet"}
          </h2>
          <p className="text-sm text-text-secondary text-center mb-4">
            {overrideAddress || connectedAddress
              ? "No cards sent from this wallet yet. Mint a card to get started!"
              : "Connect your wallet to see cards you've sent."}
          </p>
          {overrideAddress && (
            <a
              href={`https://basescan.org/address/${overrideAddress}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-primary underline"
            >
              View this wallet on Basescan →
            </a>
          )}
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function SentPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white max-w-lg mx-auto pb-20">
          <Header />
          <div className="px-4 py-20 text-center text-sm text-text-secondary">
            Loading…
          </div>
          <BottomNav />
        </div>
      }
    >
      <SentContent />
    </Suspense>
  );
}
