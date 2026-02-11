"use client";

import { useState, useEffect } from "react";
import Modal from "./Modal";
import type { GreetingCardData } from "@/lib/greeting-cards-data";
import {
  validateAndResolveRecipient,
  type RecipientResolutionResult,
} from "@/lib/recipient-resolver";
import { formatAddress } from "@/lib/basename-resolver";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: GreetingCardData;
  onMint: (recipient: string, paymentMethod: "ETH" | "USDT") => void;
  isMinting?: boolean;
}

export default function MintModal({
  isOpen,
  onClose,
  card,
  onMint,
  isMinting = false,
}: MintModalProps) {
  const [recipient, setRecipient] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<"ETH" | "USDT">("ETH");
  const [resolution, setResolution] = useState<RecipientResolutionResult | null>(
    null
  );
  const [isResolving, setIsResolving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);

  const handleMint = () => {
    const input = recipient.trim();
    if (!input) return;

    if (!resolution?.success || !resolution.address) {
      setErrorText(
        errorText || "Please enter a recipient we can resolve first."
      );
      return;
    }

    onMint(resolution.address, paymentMethod);
  };

  useEffect(() => {
    // Reset state when modal opens/closes
    if (!isOpen) {
      setResolution(null);
      setErrorText(null);
      setRecipient("");
      setIsResolving(false);
    }
  }, [isOpen]);

  // Auto-resolve recipient as user types (with .base.eth default)
  useEffect(() => {
    let input = recipient.trim();

    if (!input) {
      setResolution(null);
      setErrorText(null);
      setIsResolving(false);
      return;
    }

    // If user only typed a label (no dot / @ / 0x), treat as "<label>.base.eth"
    if (
      !input.includes(".") &&
      !input.startsWith("0x") &&
      !input.startsWith("@")
    ) {
      input = `${input}.base.eth`;
    }

    setIsResolving(true);
    setErrorText(null);

    const timeoutId = setTimeout(() => {
      const run = async () => {
        try {
          const result = await validateAndResolveRecipient(input);
          setResolution(result);

          if (!result.success || !result.address) {
            setErrorText(result.error || "Could not resolve recipient.");
          } else {
            setErrorText(null);
          }
        } catch (err) {
          console.error("Recipient resolution error:", err);
          setResolution(null);
          setErrorText(
            err instanceof Error ? err.message : "Failed to resolve recipient."
          );
        } finally {
          setIsResolving(false);
        }
      };

      void run();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [recipient]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: "linear-gradient(135deg, #00C4D9 0%, #00B2C7 50%, #009AB0 100%)",
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B2C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="2" y1="12" x2="22" y2="12" />
                <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
              </svg>
              <span className="text-sm font-semibold text-foreground">
                Send this greeting card to
              </span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={recipient}
                onChange={(e) => setRecipient(e.target.value)}
                placeholder="Enter name e.g. defidevrel"
                className="w-full pr-24 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-foreground placeholder:text-text-tertiary outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
              />
              {!recipient.includes(".") && (
                <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-text-tertiary">
                  .base.eth
                </span>
              )}
            </div>
            <p className="text-xs text-text-tertiary mt-1.5">
              By default we treat this as a Basename label (e.g.{" "}
              <span className="font-semibold">defidevrel.base.eth</span>). ENS
              (.eth), Farcaster handles, or direct wallet addresses also work.
            </p>
            {isResolving && (
              <p className="text-xs text-primary mt-1.5">
                Resolving recipient&hellip;
              </p>
            )}
            {!isResolving && resolution?.success && resolution.address && (
              <p className="text-xs text-foreground mt-1.5">
                Resolved to{" "}
                <span className="font-semibold">
                  {formatAddress(resolution.address)}
                </span>{" "}
                {!!resolution.resolvedFrom && (
                  <span className="text-text-tertiary">
                    ({resolution.resolvedFrom})
                  </span>
                )}
              </p>
            )}
            {!isResolving && errorText && (
              <p className="text-xs text-red-500 mt-1.5">{errorText}</p>
            )}
          </div>

          {/* Mint Button */}
          <button
            type="button"
            onClick={handleMint}
            disabled={!recipient.trim() || isMinting}
            className="w-full rounded-md btn-gradient text-white text-base font-bold leading-[140%] transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ fontFamily: "'Satoshi', sans-serif", height: 46, paddingTop: 12, paddingBottom: 12, paddingLeft: 16, paddingRight: 16 }}
          >
            {isMinting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-white shrink-0"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Minting…</span>
              </>
            ) : (
              <>Mint for {card.price}</>
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
}
