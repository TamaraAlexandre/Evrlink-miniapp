"use client";

import Header from "../components/Header";
import BottomNav from "../components/BottomNav";

export default function SentPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col max-w-lg mx-auto">
      <Header />
      <div className="flex-1 flex flex-col items-center justify-center px-4 pb-24">
        <div className="text-4xl mb-4">📨</div>
        <h2 className="text-lg font-semibold text-foreground mb-1">Sent Cards</h2>
        <p className="text-sm text-text-secondary text-center">
          Cards you&apos;ve sent will appear here.
        </p>
      </div>
      <BottomNav />
    </div>
  );
}
