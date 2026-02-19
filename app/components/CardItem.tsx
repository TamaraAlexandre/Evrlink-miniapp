"use client";

import { useState } from "react";
import type { GreetingCardData } from "@/lib/greeting-cards-data";

interface CardItemProps {
  card: GreetingCardData;
  onClick?: () => void;
  onMint?: () => void;
}

export default function CardItem({ card, onClick, onMint }: CardItemProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const hasBack = Boolean(card.backImage);

  const handleTap = () => {
    if (hasBack) {
      setIsFlipped((prev) => !prev);
    }
    onClick?.();
  };

  return (
    <div className="px-4 py-3">
      {/* Title */}
      <div className="mb-2">
        <h3 className="text-base font-semibold text-foreground">
          {card.title}
        </h3>
      </div>

      {/* Card Image (with flip support) */}
      <div
        onClick={handleTap}
        role="button"
        tabIndex={0}
        className="relative w-full cursor-pointer"
        style={{ perspective: hasBack ? "1200px" : undefined }}
      >
        <div
          className="relative w-full transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: hasBack ? "preserve-3d" : undefined,
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* Front */}
          <div
            className="relative w-full rounded-2xl overflow-hidden shadow-md"
            style={{ backfaceVisibility: hasBack ? "hidden" : undefined }}
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

          {/* Back (only rendered when backImage exists) */}
          {hasBack && (
            <div
              className="absolute inset-0 w-full rounded-2xl overflow-hidden shadow-md"
              style={{
                backfaceVisibility: "hidden",
                transform: "rotateY(180deg)",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.backImage!}
                alt={`${card.title} – back`}
                className="block w-full h-auto object-cover"
                loading="lazy"
              />
              {/* Tap to flip back overlay */}
              <div className="absolute inset-x-0 bottom-0 flex items-center justify-center pb-4 pt-10 bg-linear-to-t from-black/40 to-transparent">
                <span className="text-white/90 text-sm font-medium tracking-wide">
                  tap to flip
                </span>
              </div>
            </div>
          )}
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
          className="inline-flex items-center justify-center gap-2.5 rounded-md btn-gradient text-white text-base font-bold leading-[140%] whitespace-nowrap transition-colors active:scale-95"
          style={{ fontFamily: "'Satoshi', sans-serif", minWidth: 161, height: 46, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16 }}
        >
          Mint for {card.price}
        </button>
      </div>
    </div>
  );
}
