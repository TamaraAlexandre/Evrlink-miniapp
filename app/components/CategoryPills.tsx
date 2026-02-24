"use client";

import { categoryMeta } from "@/lib/greeting-cards-data";

interface CategoryPillsProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}

export default function CategoryPills({
  selectedCategory,
  onSelectCategory,
}: CategoryPillsProps) {
  return (
    <div className="px-4 py-2">
      <p className="text-sm font-medium text-foreground mb-2">Categories</p>
      <div className="flex gap-2 overflow-x-auto overflow-y-hidden hide-scrollbar pb-1 -mx-4 px-4">
        {categoryMeta.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button
              key={cat.key}
              type="button"
              onClick={() =>
                onSelectCategory(isSelected ? null : cat.key)
              }
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-md px-4 py-2 text-sm font-medium transition-all active:scale-95 shrink-0 ${
                isSelected
                  ? "btn-gradient text-white shadow-sm"
                  : "bg-white text-foreground border border-gray-200 hover:border-gray-300"
              }`}
            >
              <span className="text-base leading-none">{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
