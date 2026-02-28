"use client";

import FlipCard from "./FlipCard";
import CardBackPreview from "./CardBackPreview";

interface TransactionCardItemProps {
  /** The header line — rendered as JSX so parent can bold names, etc. */
  headerContent: React.ReactNode;
  tags: string[];
  cardImage: string;
  /** Optional message to display on the back of the card */
  message?: string;
  onShare?: () => void;
}

/**
 * Shared card component used on both Sent and Received pages.
 * Shows a header line, tags, a flippable card, and a Share button.
 */
export default function TransactionCardItem({
  headerContent,
  tags,
  cardImage,
  message = "",
  onShare,
}: TransactionCardItemProps) {
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
        backContent={
          <CardBackPreview
            message={message}
            maxLength={280}
            embedded
          />
        }
      />

      {/* Share Button */}
      <div className="flex justify-end -mt-2">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onShare?.();
          }}
          className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg btn-gradient text-white text-sm font-medium transition-colors active:scale-95"
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
