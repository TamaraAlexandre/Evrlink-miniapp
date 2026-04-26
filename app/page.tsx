"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import StickyAppHeader from "./components/StickyAppHeader";
import SearchBar from "./components/SearchBar";
import CategoryPills from "./components/CategoryPills";
import CardFeed from "./components/CardFeed";
import SuccessModal from "./components/SuccessModal";
import {
  greetingCardsData,
  getAllCards,
  type GreetingCardData,
} from "@/lib/greeting-cards-data";

/** TEMP: set to `false` or remove the SuccessModal block when done previewing. */
const SHOW_SUCCESS_MODAL_PREVIEW = false;

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [successPreviewOpen, setSuccessPreviewOpen] = useState(SHOW_SUCCESS_MODAL_PREVIEW);
  const [showWalletPicker, setShowWalletPicker] = useState(false);

  const previewCard = useMemo(() => getAllCards()[0], []);

  const filteredCards = useMemo(() => {
    let cards: GreetingCardData[];

    if (selectedCategory) {
      cards = greetingCardsData[selectedCategory]?.cards || [];
    } else {
      cards = getAllCards();
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      cards = cards.filter(
        (card) =>
          card.title.toLowerCase().includes(q) ||
          card.description?.toLowerCase().includes(q) ||
          card.tags.some((tag) => tag.toLowerCase().includes(q))
      );
    }

    return cards;
  }, [selectedCategory, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleCardClick = (card: GreetingCardData) => {
    router.push(`/generate/${card.id}`);
  };

  const handleMint = (card: GreetingCardData) => {
    router.push(`/generate/${card.id}`);
  };

  return (
    <div className="mx-auto max-w-lg bg-white pb-8 pt-0">
      {/* Sticky: logo + tab nav */}
      <StickyAppHeader onOpenWalletPicker={() => setShowWalletPicker(true)} />

      {/* Tagline + steps */}
      <div className="flex flex-col items-center px-4 pb-4 pt-3 text-center">
        <h1 className="text-2xl font-bold text-foreground leading-tight tracking-tight">
          Say it with a card
        </h1>
        <p className="mt-2 text-sm font-normal leading-snug text-text-secondary">
          Greeting cards that live forever on Base
        </p>

        <div className="mt-5 flex w-full max-w-md items-center justify-center gap-4">
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#00B2C7] text-sm font-semibold text-white">
              1
            </div>
            <span className="text-center text-xs leading-tight text-foreground">
              Pick a card
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#00B2C7] text-sm font-semibold text-white">
              2
            </div>
            <span className="text-center text-xs leading-tight text-foreground">
              Write your message
            </span>
          </div>
          <div className="flex min-w-0 flex-1 flex-col items-center gap-2">
            <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#00B2C7] text-sm font-semibold text-white">
              3
            </div>
            <span className="text-center text-xs leading-tight text-foreground">
              Send
            </span>
          </div>
        </div>
      </div>
      {/* Search */}
      <SearchBar onSearch={handleSearch} />

      {/* Categories */}
      <CategoryPills
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      {/* Divider */}
      <div className="mx-4 border-t border-border-light" />

      {/* Card Feed */}
      <CardFeed
        cards={filteredCards}
        onCardClick={handleCardClick}
        onMint={handleMint}
      />

      {SHOW_SUCCESS_MODAL_PREVIEW ? (
        <SuccessModal
          isOpen={successPreviewOpen}
          onClose={() => setSuccessPreviewOpen(false)}
          recipientAddress="0x1234567890123456789012345678901234567890"
          recipientName="defidevrel.base.eth"
          cardTitle={previewCard?.title ?? "Greeting Card"}
          cardImageUrl={previewCard?.paperImage}
        />
      ) : null}
    </div>
  );
}
