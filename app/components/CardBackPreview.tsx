"use client";

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
    <div className={embedded ? "" : "px-4 py-6"}>
      {/* Outer card with gradient background */}
      <div
        className={`relative rounded-2xl p-5 shadow-lg ${embedded ? "w-full h-full" : "mx-auto max-w-sm"}`}
        style={{
          background:
            "linear-gradient(160deg, rgba(224,247,250,0.6) 0%, rgba(178,235,242,0.4) 30%, rgba(128,222,234,0.25) 60%, rgba(224,247,250,0.5) 100%)",
        }}
      >
        {/* Evrlink Logo - centered at top */}
        <div className="flex justify-center mb-4">
          <div className="flex items-center justify-center w-12 h-12">
            <svg
              width="36"
              height="22"
              viewBox="0 0 36 22"
              fill="none"
            >
              <path
                d="M4 11c3-5 7.5-5 10.5 0s7.5 5 10.5 0"
                stroke="#00B2C7"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <path
                d="M11 11c3-5 7.5-5 10.5 0s7.5 5 10.5 0"
                stroke="#00B2C7"
                strokeWidth="3"
                strokeLinecap="round"
                opacity="0.5"
              />
            </svg>
          </div>
        </div>

        {/* Card area with corner decorations */}
        <div className="relative">
          {/* Corner brackets */}
          <CornerBracket className="absolute -top-1 -left-1 text-primary/60" />
          <CornerBracket className="absolute -top-1 -right-1 text-primary/60 rotate-90" />
          <CornerBracket className="absolute -bottom-1 -left-1 text-primary/60 -rotate-90" />
          <CornerBracket className="absolute -bottom-1 -right-1 text-primary/60 rotate-180" />

          {/* Side arrows */}
          <SideArrow className="absolute top-1/2 -left-2 -translate-y-1/2 text-primary/40 rotate-180" />
          <SideArrow className="absolute top-1/2 -right-2 -translate-y-1/2 text-primary/40" />

          {/* Inner white card */}
          <div className="mx-3 my-2 rounded-xl bg-white shadow-sm border border-white/80 px-6 py-10">
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

        {/* Bottom: TAP TO FLIP with decorative dashes */}
        <div className="flex items-center justify-center gap-2 mt-4 mb-1">
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
