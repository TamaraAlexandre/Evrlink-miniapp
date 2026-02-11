"use client";

import type { GreetingCardData } from "@/lib/greeting-cards-data";
import CardItem from "./CardItem";

interface CardFeedProps {
  cards: GreetingCardData[];
  onCardClick?: (card: GreetingCardData) => void;
  onMint?: (card: GreetingCardData) => void;
}

export default function CardFeed({ cards, onCardClick, onMint }: CardFeedProps) {
  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4">
        <p className="text-text-secondary text-sm">No cards found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-border-light">
      {cards.map((card) => (
        <CardItem
          key={card.id}
          card={card}
          onClick={() => onCardClick?.(card)}
          onMint={() => onMint?.(card)}
        />
      ))}
    </div>
  );
}
