"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useAccount } from "wagmi";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import WalletPickerModal from "./WalletPickerModal";

export default function Header() {
  const [isWeb, setIsWeb] = useState(false);
  const { context } = useMiniKit();
  const { isConnected } = useAccount();
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    if (context !== undefined) {
      setIsWeb(context === null);
    }
  }, [context]);

  return (
    <>
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
        {isWeb && !isConnected && (
          <button
            className="absolute right-4 rounded-lg bg-[#00B2C7] px-3 py-2 text-xs font-semibold text-white"
            onClick={() => setShowPicker(true)}
          >
            Connect Wallet
          </button>
        )}
      </header>
      <WalletPickerModal isOpen={showPicker} onClose={() => setShowPicker(false)} />
    </>
  );
}
