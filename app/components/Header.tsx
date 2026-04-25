"use client";

import Image from "next/image";
import Link from "next/link";
import { useAccount, useDisconnect } from "wagmi";
import { useIsInMiniApp } from "@coinbase/onchainkit/minikit";

interface HeaderProps {
  onOpenWalletPicker?: () => void;
}

export default function Header({ onOpenWalletPicker }: HeaderProps) {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { isInMiniApp, isLoading } = useIsInMiniApp();
  const shortenedAddress = address ? `${address.slice(0, 6)}...${address.slice(-4)}` : "";

  return (
    <header className="relative flex items-center justify-center px-4 pt-2.5 pb-0.5">
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

      <div className="absolute right-4 flex items-center gap-3">
        {!isInMiniApp && !isLoading &&
          (isConnected ? (
            <div className="flex flex-col items-end">
              <span className="text-xs font-semibold text-black">{shortenedAddress}</span>
              <button type="button" onClick={() => disconnect()} className="text-[10px] text-gray-500">
                Disconnect
              </button>
            </div>
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={() => onOpenWalletPicker?.()}
                className="rounded-lg bg-[#00B2C7] px-3 py-2 text-xs font-semibold text-white"
              >
                Connect Wallet
              </button>
            </div>
          ))}
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
