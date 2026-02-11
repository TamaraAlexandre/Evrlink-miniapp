"use client";

import Image from "next/image";
import { useMiniAppUser } from "../providers";

export default function Header() {
  const { user } = useMiniAppUser();

  return (
    <header className="flex items-center justify-between px-4 pt-4 pb-2">
      {/* Evrlink Logo */}
      <div className="flex items-center">
        <Image
          src="/images/logo.png"
          alt="Evrlink"
          width={40}
          height={40}
          className="h-10 w-10 object-contain"
          priority
        />
      </div>

      <div className="flex items-center gap-3">
        {/* User avatar from Farcaster / Base mini app context */}
        {user?.pfpUrl && (
          <div className="h-9 w-9 rounded-full overflow-hidden border border-border-light shadow-sm">
            <Image
              src={user.pfpUrl}
              alt={user.displayName || user.username || "User avatar"}
              width={36}
              height={36}
              className="h-9 w-9 object-cover"
            />
          </div>
        )}

        {/* Notification Bell */}
        <button
          type="button"
          className="relative flex h-10 w-10 items-center justify-center rounded-full hover:bg-gray-50 transition-colors"
          aria-label="Notifications"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M18 8A6 6 0 1 0 6 8c0 7-3 9-3 9h18s-3-2-3-9Z"
              stroke="#E11D48"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M13.73 21a2 2 0 0 1-3.46 0"
              stroke="#E11D48"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-notification border-2 border-white" />
        </button>
      </div>
    </header>
  );
}
