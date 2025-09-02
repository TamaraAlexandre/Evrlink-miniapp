import React from "react";

/**
 * BirthdayCard (Figma → React/Tailwind)
 * ------------------------------------------------------------------
 * - 350×315 card, header with brand pill + title + tags
 * - media panel with layered "paper" (rotations + drop shadows)
 * - footer with likes + CTA button
 *
 * Replace placeholder image URLs with your assets.
 */

type Props = {
    title?: string;
    byline?: string; // e.g., "by Everlink"
    tags?: string[]; // e.g., ["#birthday", "#celebration"]
    likes?: number;
    cta?: string; // e.g., "Mint for 0.02 ETH"
    onClick?: () => void;
    paperImage?: string; // background photo inside the paper frame
    overlayImage?: string; // decorative overlay (optional)
};

export default function BirthdayCard({
    title = "Birthday Bling",
    byline = "by Everlink",
    tags = ["#birthday", "#celebration"],
    likes = 74,
    cta = "Mint for 0.02 ETH",
    onClick,
    paperImage = "happy_birthday.png",
    overlayImage = "birthday_background.png",
}: Props) {
    return (
        <div className="w-[350px] h-[315px] flex flex-col gap-4" aria-label="card">
            {/* Header */}
            <div className="flex items-center justify-between h-[43px] w-full">
                <div className="flex items-center gap-2.5 h-[43px]">
                    {/* Brand square */}
                    <div className="relative h-10 w-10 rounded-xl bg-[#E1E8E9] flex items-center justify-center">
                        {/* Infinity/brand glyph placeholder */}
                        <svg
                            viewBox="0 0 28 14"
                            className="h-[14px] w-[28px] text-teal-500"
                            aria-hidden
                        >
                            <path
                                d="M4 7c2.2-3.5 5.8-3.5 8 0 2.2 3.5 5.8 3.5 8 0"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                            />
                        </svg>
                    </div>

                    {/* Title + tags */}
                    <div className="flex flex-col gap-1 w-[200px]">
                        <div className="text-[16px] leading-6 font-medium text-[#111827] truncate">
                            {title} <span className="font-normal opacity-80">{byline}</span>
                        </div>
                        <div className="flex gap-1.5 text-[12px] leading-[15px] tracking-[-0.01em] text-[#6B7280]">
                            {tags.map((t) => (
                                <span key={t} className="truncate">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Media panel */}
            <div className="relative w-full h-[200px] rounded-[20px] border border-[#F3F4F6] bg-[#F7F7F7] overflow-hidden">
                {/* Back paper (tan) */}
                <div
                    className="absolute left-[45px] top-[18px] w-[250px] h-[203.45px] rounded-[13.1px]"
                    style={{
                        transform: "rotate(2.67deg)",
                        boxShadow: "1.64px 2.46px 3.28px rgba(0,0,0,0.15)",
                        backgroundColor: "#D2C6B4",
                        border: "13.1015px solid #F3F3F3",
                    }}
                />

                {/* Front square paper photo */}
                <div
                    className="absolute left-1/2 top-[62.22px] w-[150px] h-[250px] -translate-x-[calc(50%-8px)] rounded-[8.08px]"
                    style={{
                        transform: "rotate(-3.64deg)",
                        backgroundImage: `url(${paperImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        border: "9.69238px solid #FBFBFB",
                        filter: "drop-shadow(1px 6px 5.2px rgba(0,0,0,0.16))",
                    }}
                />

                {/* Tape label */}
                <div
                    className="absolute left-1/2 top-[118px] w-[120px] h-[46px] -translate-x-1/2 grid place-items-center rounded"
                    style={{
                        transform: "rotate(-0.19deg)",
                        background: "#F2F2F2",
                        border: "4.094px solid #F3F3F3",
                    }}
                >
                    <div className="text-[22.93px] leading-[25px] text-[#111827] text-center">
                        HAPPY
                        <br />
                        BIRTHDAY!!
                    </div>
                </div>

                {/* Optional soft overlay to mimic Figma blend layers */}
                <div
                    className="absolute left-[94px] top-[110px] w-[156px] h-[67px] opacity-60"
                    style={{
                        transform: "rotate(2.67deg)",
                        backgroundImage: `url(${overlayImage})`,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                        mixBlendMode: "soft-light" as any,
                    }}
                />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between h-10 w-full">
                {/* Likes */}
                <div className="flex items-center gap-2 h-6">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-6 w-6"
                        aria-hidden
                    >
                        <path
                            d="M12 21s-6.5-4.35-9-7.58C1.38 11.44 2.13 8.5 4.7 7.6A4.3 4.3 0 0 1 9.5 9c.36.46.5.7.5.7s.14-.24.5-.7a4.3 4.3 0 0 1 4.8-1.4c2.6.9 3.33 3.84 1.7 5.82C18.5 16.65 12 21 12 21z"
                            fill="currentColor"
                        />
                    </svg>
                    <span className="text-[16px] leading-6 font-medium text-[#111827]">
                        {likes}
                    </span>
                </div>

                {/* CTA */}
                <button
                    type="button"
                    onClick={onClick}
                    className="inline-flex items-center justify-center h-10 px-4 rounded-lg bg-[#00B2C7] text-[#111827] text-[16px] leading-6 font-medium shadow-sm hover:brightness-95 active:brightness-90 transition"
                >
                    {cta}
                </button>
            </div>
        </div>
    );
}
