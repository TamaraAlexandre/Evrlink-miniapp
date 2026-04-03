"use client";

import Image from "next/image";

interface CardBackPreviewProps {
  message: string;
  maxLength: number;
  /** When true, removes outer padding so it can be embedded inside FlipCard */
  embedded?: boolean;
}

/* Small decorative corner bracket */
function CornerBracket({ className }: { className?: string }) {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M2 8V3a1 1 0 0 1 1-1h5"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* Small side arrow decoration */
function SideArrow({ className }: { className?: string }) {
  return (
    <svg
      width="12"
      height="20"
      viewBox="0 0 12 20"
      fill="none"
      className={className}
    >
      <path
        d="M2 2l8 8-8 8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function CardBackPreview({
  message,
  maxLength,
  embedded = false,
}: CardBackPreviewProps) {
  return (
    <div
      className={
        embedded
          ? "flex h-full min-h-0 w-full flex-col"
          : "px-4 py-6"
      }
    >
      {/* Outer card with gradient background */}
      <div
        className={
          embedded
            ? "relative flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl p-3 shadow-lg"
            : "relative mx-auto max-w-sm rounded-2xl p-5 shadow-lg"
        }
        style={{
          background:
            "linear-gradient(160deg, rgba(224,247,250,0.6) 0%, rgba(178,235,242,0.4) 30%, rgba(128,222,234,0.25) 60%, rgba(224,247,250,0.5) 100%)",
        }}
      >
        {/* Evrlink Logo - centered at top */}
        <div
          className={`flex shrink-0 justify-center ${embedded ? "mb-2" : "mb-4"}`}
        >
          <Image
            src="/images/logo.png"
            alt="Evrlink"
            width={48}
            height={48}
            className="h-12 w-12 object-contain"
          />
        </div>

        {/* Card area with corner decorations */}
        <div className={`relative min-h-0 ${embedded ? "flex min-h-0 flex-1 flex-col" : ""}`}>
          {/* Corner brackets */}
          <CornerBracket className="absolute -top-1 -left-1 text-primary/60" />
          <CornerBracket className="absolute -top-1 -right-1 text-primary/60 rotate-90" />
          <CornerBracket className="absolute -bottom-1 -left-1 text-primary/60 -rotate-90" />
          <CornerBracket className="absolute -bottom-1 -right-1 text-primary/60 rotate-180" />

          {/* Side arrows */}
          <SideArrow className="absolute top-1/2 -left-2 -translate-y-1/2 text-primary/40 rotate-180" />
          <SideArrow className="absolute top-1/2 -right-2 -translate-y-1/2 text-primary/40" />

          {/* Inner white card */}
          <div
            className={`mx-3 rounded-xl border border-white/80 bg-white shadow-sm ${
              embedded
                ? "my-1 min-h-0 flex-1 overflow-y-auto px-4 py-4"
                : "my-2 px-6 py-10"
            }`}
          >
            {/* Message or Placeholder */}
            {message ? (
              <p className="text-sm text-foreground text-center leading-relaxed whitespace-pre-wrap wrap-break-word">
                {message}
              </p>
            ) : (
              <div className="flex flex-col items-center">
                <p className="text-sm font-medium text-foreground text-center mb-1.5">
                  Your personalized message
                </p>
                <p className="text-xs text-primary font-medium">
                  Up to {maxLength} characters
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Bottom: TAP TO FLIP with decorative dashes (tighter when embedded in FlipCard) */}
        <div
          className={`flex shrink-0 items-center justify-center gap-2 ${
            embedded ? "mt-1 mb-0" : "mt-4 mb-1"
          }`}
        >
          {/* Left dashes */}
          <div className="flex gap-0.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`l-${i}`}
                className="w-1.5 h-px bg-primary/25"
              />
            ))}
          </div>

          <span className="text-[10px] text-primary/50 font-medium tracking-[0.2em] uppercase whitespace-nowrap">
            Tap to flip
          </span>

          {/* Right dashes */}
          <div className="flex gap-0.5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={`r-${i}`}
                className="w-1.5 h-px bg-primary/25"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
