"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import StickyAppHeader from "../components/StickyAppHeader";
import TransactionCardItem from "../components/TransactionCardItem";
import AddressDisplay from "../components/AddressDisplay";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import type { Address } from "viem";
import { useSentCards } from "@/lib/use-nft-activity";
import { useOpenUrl } from "@coinbase/onchainkit/minikit";

function SentContent() {
  const openUrl = useOpenUrl();
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

  const handleShare = async (recipientAddress: string) => {
    const text = `I just sent a greeting card on Evrlink! Send yours 👉 https://base.app/invite/friends/GBCKC3T3 💌`;
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
    openUrl(`https://x.com/intent/post?text=${encodeURIComponent(text)}`);
  };

  return (
    <div className="bg-white max-w-lg mx-auto pb-8">
      <StickyAppHeader />

      <div className="px-4 pb-2 pt-3">
        <h1 className="text-lg font-semibold text-foreground leading-snug">
          Sent Cards
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
                  <AddressDisplay
                    address={card.recipientAddress}
                    className="font-semibold text-primary"
                  />
                </>
              }
              tags={card.tags}
              cardImage={card.cardImage}
              cardId={card.cardId}
              message={card.message}
              onShare={() => void handleShare(card.recipientAddress)}
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
    </div>
  );
}

export default function SentPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-white max-w-lg mx-auto pb-8">
          <StickyAppHeader />
          <div className="px-4 py-20 text-center text-sm text-text-secondary">
            Loading…
          </div>
        </div>
      }
    >
      <SentContent />
    </Suspense>
  );
}
