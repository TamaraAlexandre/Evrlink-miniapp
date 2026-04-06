"use client";

import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-center px-4 pt-2.5 pb-0.5">
      {/* Evrlink Logo */}
      <div className="flex items-center">
        <Link href="/">
        <Image
          src="/images/logo.png"
          alt="Evrlink"
          width={60}
          height={60}
          className="h-[50px] w-[50px] object-contain"
          priority
        />
        </Link>
      </div>

      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        {/* <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
          aria-label="Notifications"
        >
          <svg
            width="24"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-primary border-2 border-white" />
        </button> */}
      </div>
    </header>
  );
}
