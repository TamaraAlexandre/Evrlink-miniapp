"use client";

import { useEffect } from "react";
import { useAccount, useConnect } from "wagmi";

interface WalletPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WalletPickerModal({ isOpen, onClose }: WalletPickerModalProps) {
  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  useEffect(() => {
    if (isConnected) onClose();
  }, [isConnected, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={onClose}
    >
      <div
        className="bg-white overflow-hidden"
        style={{
          width: "360px",
          backgroundColor: "white",
          borderRadius: "24px",
          overflow: "hidden",
          boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: "linear-gradient(135deg, #00C4D9 0%, #00B2C7 50%, #009AB0 100%)" }}
        >
          <span className="text-white text-lg font-bold">Connect Wallet</span>
          <button
            type="button"
            onClick={onClose}
            className="flex items-center justify-center w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M12 4L4 12M4 4l8 8" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="px-5 pt-5 pb-6">
          <p className="text-sm text-text-secondary mb-4">Sign in with your wallet to pay with USDC on Base.</p>
          <div className="space-y-3">
            {connectors.filter((connector) => connector.name !== "Injected").map((connector) => (
              <button
                key={connector.uid}
                type="button"
                onClick={() => connect({ connector })}
                className="w-full flex items-center gap-4 px-4 py-3 rounded-xl border-2 border-gray-100 hover:border-primary hover:bg-primary/5 transition-all text-left group"
              >
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl shrink-0">
                  {connector.name.toLowerCase().includes("metamask") ? "🦊" :
                   connector.name.toLowerCase().includes("coinbase") ? "🔵" : "👛"}
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">{connector.name}</p>
                  <p className="text-xs text-text-tertiary">
                    {connector.name.toLowerCase().includes("metamask")
                      ? "Browser extension wallet"
                      : connector.name.toLowerCase().includes("coinbase")
                      ? "Coinbase smart wallet"
                      : "Connect wallet"}
                  </p>
                </div>
                <svg className="ml-auto text-gray-300 group-hover:text-primary transition-colors" width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 12l4-4-4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            ))}
          </div>
          <p className="text-xs text-text-tertiary text-center mt-4">
            Installed wallets connect directly. We never store your private keys.
          </p>
        </div>
      </div>
    </div>
  );
}
