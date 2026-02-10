"use client";

import Modal from "./Modal";

interface ErrorModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorMessage?: string;
  onRetry: () => void;
}

export default function ErrorModal({
  isOpen,
  onClose,
  errorMessage = "Insufficient funds in wallet. Please add more ETH or USDT to continue.",
  onRetry,
}: ErrorModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{
            background: "linear-gradient(135deg, #EF4444 0%, #DC2626 50%, #B91C1C 100%)",
          }}
        >
          <span className="text-white text-lg font-bold">
            Oops! Something
            <br />
            Went Wrong
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
          {/* Error Emojis */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <span className="text-4xl">😢</span>
            <span className="text-4xl">❌</span>
            <span className="text-4xl">🤕</span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-foreground mb-2">
            Transaction Failed
          </h3>

          {/* Description */}
          <p className="text-sm text-text-secondary mb-4">
            We couldn&apos;t process your card. Don&apos;t
            <br />
            worry, no funds were deducted.
          </p>

          {/* Error Message Pill */}
          <div className="inline-flex items-center px-5 py-3 rounded-2xl bg-red-50 border border-red-100 mb-4">
            <span className="text-sm text-red-500 font-medium text-center">
              {errorMessage}
            </span>
          </div>

          {/* Helper text */}
          <p className="text-xs text-text-secondary mb-6">
            Please check your connection and try again. If
            <br />
            the problem persists, contact support.
          </p>

          {/* Buttons */}
          <button
            type="button"
            onClick={onRetry}
            className="w-full py-3.5 rounded-xl bg-primary text-white text-base font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98] mb-3"
          >
            Try Again
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 rounded-xl border border-border-light text-foreground text-base font-medium hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </Modal>
  );
}
