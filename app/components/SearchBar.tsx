"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch?: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    onSearch?.(value);
  };

  const handleClear = () => {
    setQuery("");
    onSearch?.("");
  };

  return (
    <div className="px-4 py-2">
      <div className="flex w-full items-stretch rounded-xl border border-gray-200 bg-white">
        {/* Left: search icon + input */}
        <div className="flex items-center flex-1 gap-2 min-w-0 pl-3">
          <div className="flex items-center text-text-tertiary">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>

          <input
            type="text"
            placeholder="Category"
            value={query}
            onChange={handleChange}
            className="flex-1 px-1 py-3 text-foreground placeholder:text-text-tertiary outline-none bg-transparent min-w-0"
            style={{ fontSize: "16px" }}
          />

          {/* Clear button (shows when there's text) */}
          {query && (
            <button
              type="button"
              onClick={handleClear}
              className="flex items-center justify-center px-1 text-text-tertiary hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}
        </div>

        {/* Right: inline Search button */}
        <button
          type="button"
          onClick={() => onSearch?.(query)}
          className="flex items-center justify-center px-4 bg-primary text-white text-xs font-semibold rounded-r-xl hover:bg-primary-dark transition-colors active:scale-95 whitespace-nowrap"
        >
          Search
        </button>
      </div>
    </div>
  );
}
