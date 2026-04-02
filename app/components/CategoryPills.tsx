"use client";
import { categoryMeta } from "@/lib/greeting-cards-data";
interface CategoryPillsProps {
  selectedCategory: string | null;
  onSelectCategory: (category: string | null) => void;
}
export default function CategoryPills({ selectedCategory, onSelectCategory }: CategoryPillsProps) {
  return (
    <div style={{padding:"8px 0"}}>
      <p style={{fontSize:"14px",fontWeight:500,marginBottom:"8px",paddingLeft:"16px"}}>Categories</p>
      <div style={{display:"flex",overflowX:"auto",gap:"8px",paddingLeft:"16px",paddingRight:"16px",paddingBottom:"8px"}}>
        {categoryMeta.map((cat) => {
          const isSelected = selectedCategory === cat.key;
          return (
            <button key={cat.key} type="button" onClick={() => onSelectCategory(isSelected ? null : cat.key)} style={{flexShrink:0,whiteSpace:"nowrap",borderRadius:"6px",padding:"8px 16px",fontSize:"14px",fontWeight:500,border: isSelected ? "none" : "1px solid #e5e7eb",background: isSelected ? "linear-gradient(135deg,#00C4D9,#009AB0)" : "white",color: isSelected ? "white" : "#111"}}>
              {cat.emoji} {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
