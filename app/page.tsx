"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import CategoryPills from "./components/CategoryPills";
import CardFeed from "./components/CardFeed";
import BottomNav from "./components/BottomNav";
import {
  greetingCardsData,
  getAllCards,
  type GreetingCardData,
} from "@/lib/greeting-cards-data";

export default function Home() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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
    // TODO: Navigate to card detail / editor
    console.log("Card clicked:", card.id);
  };

  const handleMint = (card: GreetingCardData) => {
    router.push(`/generate/${card.id}`);
  };

  return (
    <div className="bg-white max-w-lg mx-auto pb-20">
      {/* Header */}
      <Header />

      {/* Tagline */}
      <div className="px-4 pb-2">
        <h1 className="text-lg font-semibold text-foreground leading-snug">
          Send and relive moments with
          <br />
          digital cards.{" "}
          <span className="inline-block">💌</span>
        </h1>
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

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
