"use client";

import { useState, useMemo } from "react";
import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import TransactionCardItem from "../components/TransactionCardItem";
import BottomNav from "../components/BottomNav";
import { mockReceivedCards } from "@/lib/sent-received-data";

export default function ReceivedPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCards = useMemo(() => {
    if (!searchQuery.trim()) return mockReceivedCards;
    const q = searchQuery.toLowerCase();
    return mockReceivedCards.filter(
      (card) =>
        card.cardTitle.toLowerCase().includes(q) ||
        card.senderName.toLowerCase().includes(q) ||
        card.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  }, [searchQuery]);

  const handleShare = (cardId: string) => {
    // TODO: Wire up share functionality
    if (navigator.share) {
      navigator.share({
        title: "Evrlink Greeting Card",
        text: "Check out this greeting card I received on Evrlink!",
      });
    }
    console.log("Share received card:", cardId);
  };

  return (
    <div className="bg-white max-w-lg mx-auto pb-20">
      {/* Header */}
      <Header />

      {/* Tagline */}
      <div className="px-4 pb-2">
        <h1 className="text-lg font-semibold text-foreground leading-snug">
          Cards sent to you to relive special
          <br />
          moments.{" "}
          <span className="inline-block">💖</span>
        </h1>
      </div>

      {/* Search */}
      <SearchBar onSearch={setSearchQuery} />

      {/* Divider */}
      <div className="mx-4 border-t border-border-light" />

      {/* Card Feed */}
      {filteredCards.length > 0 ? (
        <div className="divide-y divide-border-light">
          {filteredCards.map((card) => (
            <TransactionCardItem
              key={card.id}
              headerContent={
                <>
                  {card.cardTitle} From{" "}
                  <span className="font-semibold text-primary">
                    {card.senderName}
                  </span>
                </>
              }
              tags={card.tags}
              cardImage={card.cardImage}
              onShare={() => handleShare(card.id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            No received cards yet
          </h2>
          <p className="text-sm text-text-secondary text-center">
            Cards you&apos;ve received will appear here.
          </p>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
