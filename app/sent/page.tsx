"use client";

import { useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import TransactionCardItem from "../components/TransactionCardItem";
import BottomNav from "../components/BottomNav";
import { useAccount } from "wagmi";
import { isAddress } from "viem";
import type { Address } from "viem";
import { useSentCards } from "@/lib/use-nft-activity";

function shortAddress(addr: string | undefined | null): string {
  if (addr == null || typeof addr !== "string" || addr.length < 10) return addr ?? "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function SentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const addressParam = searchParams.get("address")?.trim() ?? "";
  const [searchQuery, setSearchQuery] = useState("");
  const [addressInput, setAddressInput] = useState("");

  const overrideAddress: Address | null =
    addressParam && isAddress(addressParam) ? (addressParam as Address) : null;

  const { data: sentCards, isLoading, error, isConfigured } =
    useSentCards(overrideAddress);
  const { address: connectedAddress } = useAccount();

  const inputPlaceholder =
    overrideAddress ?? connectedAddress
      ? `${overrideAddress ?? connectedAddress}`.slice(0, 10) + "..."
      : "0x...";

  const filteredCards = useMemo(() => {
    if (!sentCards.length) return sentCards;
    if (!searchQuery.trim()) return sentCards;
    const q = searchQuery.toLowerCase();
    return sentCards.filter(
      (card) =>
        shortAddress(card.recipientAddress).toLowerCase().includes(q) ||
        (card.cardTitle ?? "").toLowerCase().includes(q) ||
        (card.tags ?? []).some((tag) => String(tag).toLowerCase().includes(q))
    );
  }, [sentCards, searchQuery]);

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
          special moments.{" "}
          <span className="inline-block">💌</span>
        </h1>
      </div>

      {/* <SearchBar onSearch={setSearchQuery} /> */}

      {/* View sent cards for a specific wallet (e.g. when miniapp shows different address) */}
      {/* {isConfigured && (
        <div className="px-4 py-3 border-b border-border-light">
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            View sent cards for wallet
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              placeholder={inputPlaceholder}
              className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-gray-200 bg-white text-sm text-foreground placeholder:text-text-tertiary outline-none focus:border-primary focus:ring-1 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => {
                const v = addressInput.trim();
                if (isAddress(v)) {
                  router.replace(`/sent?address=${encodeURIComponent(v)}`, { scroll: false });
                }
              }}
              className="shrink-0 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:opacity-90 active:scale-95"
            >
              Update
            </button>
          </div>
          {overrideAddress && (
            <p className="text-xs text-primary mt-1.5">
              Showing cards for {shortAddress(overrideAddress)}
            </p>
          )}
        </div>
      )} */}

      <div className="mx-4 border-t border-border-light" />

      {!isConfigured && (
        <div className="px-4 py-6 text-center text-sm text-text-secondary">
          Set <code className="bg-muted px-1 rounded">NEXT_PUBLIC_CONTRACT_ADDRESS</code> to your deployed GreetingCardNFT contract to see sent cards.
        </div>
      )}

      {isConfigured && error && (
        <div className="px-4 py-6 text-center text-sm text-red-600">
          Could not load sent cards. Check that the contract address is correct and the contract is deployed.
        </div>
      )}

      {isConfigured && !error && isLoading && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-4xl mb-4">📨</div>
          <p className="text-sm text-text-secondary">Loading sent cards…</p>
        </div>
      )}

      {isConfigured && !error && !isLoading && filteredCards.length > 0 && (
        <div className="divide-y divide-border-light">
          {filteredCards.map((card) => (
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

      {isConfigured && !error && !isLoading && filteredCards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-4xl mb-4">📨</div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            {overrideAddress || connectedAddress
              ? "No sent cards found"
              : "Enter a wallet address"}
          </h2>
          <p className="text-sm text-text-secondary text-center mb-4">
            {overrideAddress || connectedAddress
              ? "No cards from this wallet on this contract. Check that the contract is on Base and that this address minted the cards."
              : "Paste the wallet address that sent the cards above and click Update (e.g. 0x12859d66...)."}
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
