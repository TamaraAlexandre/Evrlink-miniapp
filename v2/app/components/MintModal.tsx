"use client";

import { useState } from "react";
import Modal from "./Modal";
import type { GreetingCardData } from "@/lib/greeting-cards-data";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: GreetingCardData;
  onMint: (recipient: string, paymentMethod: "ETH" | "USDT") => void;
}

export default function MintModal({
  isOpen,
  onClose,
  card,
  onMint,
}: MintModalProps) {
  const [recipient, setRecipient] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"ETH" | "USDT">("ETH");

  const handleMint = () => {
    if (!recipient.trim()) return;
    onMint(recipient.trim(), paymentMethod);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: "linear-gradient(135deg, #06B6D4 0%, #14B8A6 50%, #0891B2 100%)",
          }}
        >
          <span className="text-white text-lg font-bold">Mint Card</span>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pt-5 pb-6">
          {/* Card Preview */}
          <div className="flex justify-center mb-5">
            <div className="w-40 h-28 rounded-lg border-2 border-accent-gold overflow-hidden shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={card.paperImage}
                alt={card.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between px-1 mb-4">
            <span className="text-sm text-text-secondary">Price:</span>
            <span className="text-lg font-bold text-foreground">{card.price}</span>
          </div>

          {/* Payment Method Toggle */}
          <div className="flex gap-3 mb-5">
            <button
              type="button"
              onClick={() => setPaymentMethod("ETH")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                paymentMethod === "ETH"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-primary border-2 border-primary/30 hover:border-primary/50"
              }`}
            >
              ETH
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod("USDT")}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                paymentMethod === "USDT"
                  ? "bg-primary text-white shadow-sm"
                  : "bg-white text-primary border-2 border-primary/30 hover:border-primary/50"
              }`}
            >
              USDT
            </button>
          </div>

          {/* Send to */}
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#14B8A6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="text-sm font-semibold text-foreground">
                Send this greeting card to
              </span>
            </div>
            <input
              type="text"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Enter username or wallet"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-foreground placeholder:text-text-tertiary outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
            />
            <p className="text-xs text-text-tertiary mt-1.5">
              Supports Basename, ENS, Farcaster handles, or direct wallet addresses
            </p>
          </div>

          {/* Mint Button */}
          <button
            type="button"
            onClick={handleMint}
            disabled={!recipient.trim()}
            className="w-full py-3.5 rounded-xl bg-primary text-white text-base font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Mint for {card.price}
          </button>
        </div>
      </div>
    </Modal>
  );
}
