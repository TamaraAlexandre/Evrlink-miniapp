"use client";

import Header from "./Header";
import HeaderNav from "./HeaderNav";

/**
 * Keeps the logo + tab navigation visible while the page scrolls.
 */
interface StickyAppHeaderProps {
  onOpenWalletPicker?: () => void;
}

export default function StickyAppHeader({ onOpenWalletPicker }: StickyAppHeaderProps) {
  return (
    <div
      className="sticky top-0 z-50 w-full border-b border-border-light bg-background/95 shadow-[0_1px_0_0_rgba(0,0,0,0.04)] backdrop-blur-md supports-[backdrop-filter]:bg-background/90"
    >
      <Header onOpenWalletPicker={onOpenWalletPicker} />
      <HeaderNav />
    </div>
  );
}
