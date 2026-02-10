"use client";

import type { GreetingCardData } from "@/lib/greeting-cards-data";

interface SimilarCardItemProps {
  card: GreetingCardData;
  onClick?: () => void;
  onMint?: () => void;
}

export default function SimilarCardItem({
  card,
  onClick,
  onMint,
}: SimilarCardItemProps) {
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

      {/* Footer: Likes + Mint Button */}
      <div className="flex items-center justify-between mt-2">
        {/* Likes */}
        <div className="flex items-center gap-1.5">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-tertiary"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <span className="text-sm text-text-secondary font-medium">
            {card.likes}
          </span>
        </div>

        {/* Mint Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onMint?.();
          }}
          className="inline-flex items-center justify-center gap-2.5 rounded-md btn-gradient text-white text-base font-bold leading-[140%] whitespace-nowrap transition-colors active:scale-95"
          style={{ fontFamily: "'Satoshi', sans-serif", minWidth: 161, height: 46, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16 }}
        >
          Mint for {card.price}
        </button>
      </div>
    </div>
  );
}
