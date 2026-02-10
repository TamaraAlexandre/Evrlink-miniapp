"use client";

import { useRouter } from "next/navigation";
import Modal from "./Modal";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientAddress: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  recipientAddress,
}: SuccessModalProps) {
  const router = useRouter();

  // Truncate address for display
  const displayAddress =
    recipientAddress.length > 12
      ? `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`
      : recipientAddress;

  const handleBackToHome = () => {
    onClose();
    router.push("/");
  };

  const handleShare = () => {
    // TODO: Wire up share functionality
    if (navigator.share) {
      navigator.share({
        title: "Evrlink Greeting Card",
        text: `I just sent a greeting card on Evrlink!`,
      });
    }
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
          <span className="text-white text-lg font-bold">
            Card Sent Successfully! 🎉
          </span>
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
        <div className="px-5 pt-6 pb-6 text-center">
          {/* Celebration Emojis */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="text-4xl">🎉</span>
            <span className="text-4xl">✨</span>
            <span className="text-4xl">🎊</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2">
            Your Card is On Its Way!
          </h3>

          {/* Description */}
          <p className="text-sm text-text-secondary mb-4">
            Your greeting card has been
            <br />
            successfully sent to
          </p>

          {/* Recipient Address Pill */}
          <div className="inline-flex items-center px-6 py-3 rounded-full bg-surface border border-border-light mb-4">
            <span className="text-sm font-medium text-foreground">
              {displayAddress}
            </span>
          </div>

          {/* Helper text */}
          <p className="text-xs text-text-secondary mb-6">
            They&apos;ll receive it shortly and can enjoy
            <br />
            your heartfelt message! 💌
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleBackToHome}
              className="flex-1 py-3 rounded-xl bg-primary text-white text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
            >
              Back To Home
            </button>
            <button
              type="button"
              onClick={handleShare}
              className="flex-1 py-3 rounded-xl border-2 border-primary text-primary text-sm font-semibold hover:bg-primary/5 transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <polyline points="16 6 12 2 8 6" />
                <line x1="12" y1="2" x2="12" y2="15" />
              </svg>
              Share
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}
