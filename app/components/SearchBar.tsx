"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onSearch?.(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex items-center gap-2 px-4 py-2">
      <div className="flex flex-1 items-center rounded-xl border border-gray-200 bg-white overflow-hidden">
        <input
          type="text"
          placeholder="Search for a card"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 px-4 py-3 text-sm text-foreground placeholder:text-text-tertiary outline-none bg-transparent"
        />
        <button
          type="button"
          onClick={handleSearch}
          className="flex items-center justify-center px-5 py-3 bg-primary text-white text-sm font-medium rounded-r-xl hover:bg-primary-dark transition-colors active:scale-95"
        >
          Search
        </button>
      </div>
    </div>
  );
}
