"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
} from "@coinbase/onchainkit/wallet";
import { useMiniKit } from "@coinbase/onchainkit/minikit";

export default function Header() {
  const { context } = useMiniKit();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 100);
    return () => clearTimeout(timeout);
  }, []);

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
      {ready && !context && (
        <div className="absolute right-4">
          <Wallet>
            <ConnectWallet />
            <WalletDropdown>
              <WalletDropdownDisconnect />
            </WalletDropdown>
          </Wallet>
        </div>
      )}
    </header>
  );
}
