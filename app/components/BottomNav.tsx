"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    label: "Home",
    href: "/",
    icon: (active: boolean) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    label: "Sent",
    href: "/sent",
    icon: (active: boolean) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="22" y1="2" x2="11" y2="13" />
        <polygon points="22 2 15 22 11 13 2 9 22 2" />
      </svg>
    ),
  },
  {
    label: "Received",
    href: "/received",
    icon: (active: boolean) => (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={active ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="w-full">
      <div className="mx-auto w-full max-w-[390px] px-4 pt-1 pb-2">
        
      <div
        className="
          relative flex items-center justify-around 
          border border-primary/10
          p-3 bg-gradient-to-b from-white to-[#F7FCFF] py-2.5

          before:content-[''] before:absolute before:top-0 before:left-0 
          before:w-[80px] before:h-[2px] before:bg-primary

          after:content-[''] after:absolute after:top-0 after:left-0 
          after:h-[85px] after:w-[2px] after:bg-primary
        "
>
  {/* bottom-right lines */}
  <div
    className="
      pointer-events-none absolute inset-0
      before:content-[''] before:absolute before:bottom-0 before:right-0 
      before:w-[80px] before:h-[2px] before:bg-primary

      after:content-[''] after:absolute after:bottom-0 after:right-0 
      after:h-[85px] after:w-[2px] after:bg-primary
    "
  />

  {tabs.map((tab) => {
    const isActive = pathname === tab.href;
    return (
      <Link
        key={tab.href}
        href={tab.href}
        className={`flex min-w-0 flex-1 flex-col items-center justify-center gap-1 transition-all ${
          isActive
            ? "text-primary"
            : "text-text-tertiary hover:text-text-secondary"
        }`}
      >
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-xl transition-all ${
            isActive
              ? "btn-primary text-white shadow-[0_8px_16px_-8px_rgba(0,178,199,0.65)]"
              : "border border-primary/10 bg-white text-foreground"
          }`}
        >
          {tab.icon(isActive)}
        </div>
        <span
          className={`text-[13px] ${
            isActive ? "font-semibold" : "font-medium"
          }`}
        >
          {tab.label}
        </span>
      </Link>
    );
  })}
</div>
  
        {/* Safe area for devices with home indicator */}
        <div className="h-safe-area-inset-bottom" />
      </div>
    </nav>
  );
}
