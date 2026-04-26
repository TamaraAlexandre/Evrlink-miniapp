"use client";

import { useState } from "react";
import { useAccount } from "wagmi";
import { useIsInMiniApp } from "@coinbase/onchainkit/minikit";
import WalletPickerModal from "./WalletPickerModal";

export default function WebConnectButton() {
  const isInMiniApp = useIsInMiniApp();
  const { isConnected } = useAccount();
  const [showPicker, setShowPicker] = useState(false);

  if (isInMiniApp) {
    return null;
  }

  if (isConnected) {
    return null;
  }

  return (
    <>
      <button
        className="rounded-lg bg-[#00B2C7] px-3 py-2 text-xs font-semibold text-white"
        onClick={() => setShowPicker(true)}
      >
        Connect Wallet
      </button>
      <WalletPickerModal isOpen={showPicker} onClose={() => setShowPicker(false)} />
    </>
  );
}
