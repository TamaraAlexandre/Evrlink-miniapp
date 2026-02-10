"use client";

import type { GreetingCardData } from "@/lib/greeting-cards-data";

interface CardItemProps {
  card: GreetingCardData;
  onClick?: () => void;
  onMint?: () => void;
}

export default function CardItem({ card, onClick, onMint }: CardItemProps) {
  return (
    <div className="px-4 py-3">
      {/* Title + Tags */}
      <div className="mb-2">
        <h3 className="text-base font-semibold text-foreground">
          {card.title}{" "}
          <span className="font-normal text-text-secondary">{card.byline}</span>
        </h3>
        <div className="flex gap-1.5 mt-0.5">
          {card.tags.map((tag) => (
            <span key={tag} className="text-xs text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Card Image */}
      <div
        onClick={onClick}
        role="button"
        tabIndex={0}
        className="relative w-full rounded-2xl overflow-hidden border-[3px] border-accent-gold shadow-md cursor-pointer transition-transform active:scale-[0.98]"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={card.paperImage}
          alt={card.title}
          className="block w-full h-auto object-cover"
          loading="lazy"
        />
        {/* Tap to flip overlay */}
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-4 pt-10 bg-linear-to-t from-black/40 to-transparent">
          <span className="text-white/90 text-sm font-medium tracking-wide">
            tap to flip
          </span>
        </div>
      </div>

      {/* Mint Button */}
      <div className="flex justify-end mt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMint?.();
          }}
          className="inline-flex items-center gap-1 px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors active:scale-95"
        >
          Mint for {card.price}
        </button>
      </div>
    </div>
  );
}
