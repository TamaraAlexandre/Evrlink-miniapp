"use client";

import FlipCard from "./FlipCard";
import CardBackPreview from "./CardBackPreview";
import { greetingCardsData } from "@/lib/greeting-cards-data";

interface TransactionCardItemProps {
  headerContent: React.ReactNode;
  tags: string[];
  cardImage: string;
  /**
   * Card template ID stored in the NFT metadata.
   * Used to look up the local card (e.g. Miggles backImage).
   */
  cardId?: string;
  /**
   * Personalized message written by the sender.
   * Empty for pre-designed cards (Miggles, etc.).
   */
  message?: string;
  onShare?: () => void;
}

/** Look up a card template by its ID across all categories. */
function findLocalCard(cardId: string) {
  for (const category of Object.values(greetingCardsData)) {
    const found = category.cards.find((c) => c.id === cardId);
    if (found) return found;
  }
  return null;
}

/**
 * Shared card component used on both Sent and Received pages.
 * Shows a header line, tags, a flippable card, and a Share button.
 *
 * Flip-back priority:
 *   1. Pre-designed card  → shows local backImage from greetingCardsData
 *   2. User-message card  → shows CardBackPreview with the real message
 *   3. Old card (no meta) → shows CardBackPreview with empty placeholder
 */
export default function TransactionCardItem({
  headerContent,
  tags,
  cardImage,
  cardId,
  message = "",
  onShare,
}: TransactionCardItemProps) {
  // Resolve the local card template so we can get backImage
  const localCard = cardId ? findLocalCard(cardId) : null;
  const backImage = localCard?.backImage ?? null;

  const backContent = backImage ? (
    // Pre-designed card: show the pre-made back image
    <div className="h-full w-full overflow-hidden rounded-2xl">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={backImage}
        alt="Card back"
        className="block h-full w-full object-cover"
      />
    </div>
  ) : (
    // User-message card or old card: show message preview
    <CardBackPreview message={message} maxLength={280} embedded />
  );

  return (
    <div className="px-4 py-3">
      {/* Header + Tags */}
      <div className="mb-2 px-0">
        <p className="text-base text-foreground leading-snug">{headerContent}</p>
        <div className="flex gap-1.5 mt-0.5">
          {tags.map((tag) => (
            <span key={tag} className="text-xs text-text-secondary">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Flippable Card */}
      <FlipCard
        cardImage={cardImage}
        cardTitle="Greeting card"
        backContent={backContent}
      />

      {/* Share Button */}
      <div className="flex justify-end -mt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onShare?.();
          }}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg btn-primary text-white text-sm font-medium transition-colors active:scale-95"
        >
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
            <polyline points="16 6 12 2 8 6" />
            <line x1="12" y1="2" x2="12" y2="15" />
          </svg>
          Share
        </button>
      </div>
    </div>
  );
}
