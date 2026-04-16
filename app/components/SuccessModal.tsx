"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Modal from "./Modal";
import { useOpenUrl } from "@coinbase/onchainkit/minikit";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientAddress: string;
  recipientName?: string;
  cardTitle?: string;
  cardImageUrl?: string;
  cardBackImageUrl?: string;
  cardMessage?: string;
}

export default function SuccessModal({
  isOpen,
  onClose,
  recipientAddress,
  recipientName,
  cardTitle,
  cardImageUrl,
  cardBackImageUrl,
  cardMessage,
}: SuccessModalProps) {
  const openUrl = useOpenUrl();
  const router = useRouter();
  const [isFlipped, setIsFlipped] = useState(false);

  const displayAddress =
    recipientAddress.length > 12
      ? `${recipientAddress.slice(0, 6)}...${recipientAddress.slice(-4)}`
      : recipientAddress;

  const displayName =
    recipientName && !recipientName.startsWith("0x")
      ? recipientName
      : displayAddress;

  useEffect(() => {
    if (!isOpen) {
      setIsFlipped(false);
      return;
    }
    const t1 = setTimeout(() => setIsFlipped(true), 1800);
    const t2 = setTimeout(() => setIsFlipped(false), 4200);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [isOpen]);

  const handleBackToHome = () => {
    onClose();
    router.push("/");
  };

  const handleShare = () => {
    let mention = displayAddress;
    if (recipientName) {
      const name = recipientName.trim();
      if (name && !name.startsWith("0x") && (name.includes(".") || name.startsWith("@"))) {
        mention = name;
      }
    }
    const label = cardTitle || "a greeting card";
    const text = `I just sent ${mention} a greeting card on Evrlink! Send yours at https://evrlinkapp.com 💌`;
    openUrl(`https://x.com/intent/post?text=${encodeURIComponent(text)}`);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl w-full max-w-sm mx-auto">
        <div style={{ height: 6, background: "linear-gradient(90deg, #00B2C7, #00D4A8)" }} />
        <div className="relative px-6 pt-5 pb-0">
          <button type="button" onClick={onClose} className="absolute top-4 right-4 flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
            <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="#666" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <p style={{ fontSize: 11, fontWeight: 600, color: "#00B2C7", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>Card Sent</p>
          <h3 style={{ fontSize: 20, fontWeight: 600, color: "#111", margin: "0 0 18px", lineHeight: 1.2 }}>Your card is on its way! 🎉</h3>
        </div>
        <div className="px-6">
          <div onClick={() => setIsFlipped(f => !f)} style={{ perspective: 1000, cursor: "pointer" }}>
            <div style={{ position: "relative", width: "100%", transformStyle: "preserve-3d", transition: "transform 0.7s ease", transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)" }}>
              <div style={{ backfaceVisibility: "hidden", borderRadius: 14, overflow: "hidden", border: "0.5px solid #e5e7eb" }}>
                {cardImageUrl ? (
                  <img src={cardImageUrl} alt={cardTitle || "Card preview"} style={{ width: "100%", height: "auto", display: "block" }} />
                ) : (
                  <div style={{ background: "linear-gradient(135deg, #E6F8FB, #fff)", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 40 }}>💌</span>
                  </div>
                )}
              </div>
              <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", backfaceVisibility: "hidden", transform: "rotateY(180deg)", background: "linear-gradient(145deg, #E6F8FB, #ffffff)", border: "0.5px solid #B3EBF2", borderRadius: 14, overflow: "hidden" }}>
                {cardBackImageUrl ? (
                  <img src={cardBackImageUrl} alt={cardTitle ? `${cardTitle} back` : "Card back preview"} style={{ width: "100%", height: "100%", display: "block", objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 24, boxSizing: "border-box", gap: 10 }}>
                    <div style={{ width: 36, height: 3, background: "linear-gradient(90deg, #00B2C7, #00D4A8)", borderRadius: 2 }} />
                    <p style={{ fontSize: 11, color: "#0F6E56", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, margin: 0 }}>To</p>
                    <p style={{ fontSize: 16, fontWeight: 600, color: "#085041", margin: 0 }}>{displayName}</p>
                    {cardMessage && (
                      <p style={{ fontSize: 13, color: "#444", textAlign: "center", lineHeight: 1.6, fontStyle: "italic", margin: 0 }}>"{cardMessage}"</p>
                    )}
                    <div style={{ width: 36, height: 3, background: "linear-gradient(90deg, #00B2C7, #00D4A8)", borderRadius: 2 }} />
                    <p style={{ fontSize: 10, color: "#0F6E56", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0 }}>Sent via Evrlink</p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", margin: "8px 0 0" }}>tap to flip</p>
        </div>
        <div className="px-6 pt-4">
          <p style={{ fontSize: 12, color: "#888", margin: "0 0 8px" }}>Sent to</p>
          <div style={{ background: "#E6F8FB", borderRadius: 10, padding: "10px 14px", display: "flex", alignItems: "center", gap: 10, border: "0.5px solid #B3EBF2" }}>
            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #00B2C7, #00D4A8)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>👤</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: "#085041", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{displayName}</p>
              <p style={{ margin: 0, fontSize: 11, color: "#0F6E56" }}>Base name verified</p>
            </div>
            <div style={{ width: 18, height: 18, background: "#00B2C7", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ color: "white", fontSize: 10, fontWeight: 700 }}>✓</span>
            </div>
          </div>
        </div>
        <div className="px-6 pt-4 pb-6 flex gap-3">
          <button type="button" onClick={handleBackToHome} style={{ flex: 1, padding: "12px", background: "#f3f4f6", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "#333", cursor: "pointer" }}>
            Back to home
          </button>
          <button type="button" onClick={handleShare} style={{ flex: 1, padding: "12px", background: "linear-gradient(135deg, #00B2C7, #00D4A8)", border: "none", borderRadius: 12, fontSize: 14, fontWeight: 600, color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 002 2h12a2 2 0 002-2v-8"/>
              <polyline points="16 6 12 2 8 6"/>
              <line x1="12" y1="2" x2="12" y2="15"/>
            </svg>
            Share
          </button>
        </div>
      </div>
    </Modal>
  );
} 