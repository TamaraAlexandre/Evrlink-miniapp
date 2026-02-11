"use client";

import { useState } from "react";

interface FlipCardProps {
  /** The card's front image URL */
  cardImage: string;
  /** The card title for alt text */
  cardTitle: string;
  /** The back-side content (CardBackPreview) */
  backContent: React.ReactNode;
  /** Callback when the card flips */
  onFlip?: (flipped: boolean) => void;
  /** Start flipped to the back side */
  defaultFlipped?: boolean;
}

export default function FlipCard({
  cardImage,
  cardTitle,
  backContent,
  onFlip,
  defaultFlipped = false,
}: FlipCardProps) {
  const [isFlipped, setIsFlipped] = useState(defaultFlipped);

  const toggle = () => {
    setIsFlipped((prev) => {
      const next = !prev;
      onFlip?.(next);
      return next;
    });
  };

  return (
    <div className="px-4 py-6">
      <div
        role="button"
        tabIndex={0}
        aria-label={isFlipped ? "Tap to see front of card" : "Tap to flip card and write your message"}
        className="relative mx-auto max-w-sm cursor-pointer outline-none"
        style={{ perspective: "1200px" }}
        onClick={toggle}
        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggle(); } }}
      >
        {/* Inner wrapper that rotates */}
        <div
          className="relative w-full transition-transform duration-700 ease-in-out"
          style={{
            transformStyle: "preserve-3d",
            transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
          }}
        >
          {/* ===== FRONT SIDE ===== */}
          <div
            className="relative w-full rounded-2xl overflow-hidden border-[3px] border-accent-gold shadow-lg"
            style={{ backfaceVisibility: "hidden" }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={cardImage}
              alt={cardTitle}
              className="block w-full h-auto object-cover"
            />

            {/* Tap to flip hint overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black/10">
              <div className="animate-flip-hint flex items-center gap-2.5 px-6 py-3 rounded-full bg-white/95 shadow-xl backdrop-blur-sm border border-white/60">
                {/* Tap hand icon */}
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-primary"
                >
                  <path
                    d="M8 13V4.5a1.5 1.5 0 0 1 3 0V12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 11.5V10a1.5 1.5 0 0 1 3 0v1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M14 12v-1a1.5 1.5 0 0 1 3 0v1.5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 12.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2 .208a6 6 0 0 1-4.243-1.757l-3.672-3.672a1.5 1.5 0 0 1 2.122-2.121L8 16"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span className="text-sm font-semibold text-foreground tracking-wide">
                  Tap to flip
                </span>
                {/* Flip arrows icon */}
                {/* <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  className="text-primary animate-bounce-x"
                >
                  <path d="M17 1l4 4-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M3 11V9a4 4 0 0 1 4-4h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 23l-4-4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M21 13v2a4 4 0 0 1-4 4H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg> */}
              </div>
            </div>
          </div>

          {/* ===== BACK SIDE ===== */}
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backfaceVisibility: "hidden",
              transform: "rotateY(180deg)",
            }}
          >
            {backContent}
          </div>
        </div>
      </div>
    </div>
  );
}
