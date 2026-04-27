"use client";

import { useState, useEffect } from "react";
import { useAccount, useConnect } from "wagmi";
import Modal from "./Modal";
import type { GreetingCardData } from "@/lib/greeting-cards-data";
import {
  validateAndResolveRecipient,
  type RecipientResolutionResult,
} from "@/lib/recipient-resolver";
import { formatAddress } from "@/lib/basename-resolver";

interface MintModalProps {
  isOpen: boolean;
  onClose: () => void;
  card: GreetingCardData;
  onMint: (recipient: string, recipientInput: string) => void;
  isMinting?: boolean;
}

export default function MintModal({
  isOpen,
  onClose,
  card,
  onMint,
  isMinting = false,
}: MintModalProps) {
  const [recipient, setRecipient] = useState("");
  const [resolution, setResolution] = useState<RecipientResolutionResult | null>(null);
  const [isResolving, setIsResolving] = useState(false);
  const [errorText, setErrorText] = useState<string | null>(null);
  const [showWalletPicker, setShowWalletPicker] = useState(false);

  const { isConnected } = useAccount();
  const { connect, connectors } = useConnect();

  const handleMint = () => {
    const input = recipient.trim();
    if (!input) return;
    if (!resolution?.success || !resolution.address) {
      setErrorText(errorText || "Please enter a recipient we can resolve first.");
      return;
    }
    onMint(resolution.address, recipient.trim());
  };

  useEffect(() => {
    if (!isOpen) {
      setResolution(null);
      setErrorText(null);
      setRecipient("");
      setIsResolving(false);
      setShowWalletPicker(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isConnected) setShowWalletPicker(false);
  }, [isConnected]);

  const displayPrice = "1 USDC";

  useEffect(() => {
    let input = recipient.trim();
    if (!input) {
      setResolution(null);
      setErrorText(null);
      setIsResolving(false);
      return;
    }
    if (!input.includes(".") && !input.startsWith("0x") && !input.startsWith("@")) {
      input = `${input}.base.eth`;
    }
    setIsResolving(true);
    setErrorText(null);
    const timeoutId = setTimeout(() => {
      const run = async () => {
        try {
          const result = await validateAndResolveRecipient(input);
          setResolution(result);
          if (!result.success || !result.address) {
            setErrorText(result.error || "Could not resolve recipient.");
          } else {
            setErrorText(null);
          }
        } catch (err) {
          setResolution(null);
          setErrorText(err instanceof Error ? err.message : "Failed to resolve recipient.");
        } finally {
          setIsResolving(false);
        }
      };
      void run();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [recipient]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-white rounded-3xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4"
          style={{ background: "linear-gradient(135deg, #00C4D9 0%, #00B2C7 50%, #009AB0 100%)" }}
        >
          {showWalletPicker ? (
            <button
              type="button"
              onClick={() => setShowWalletPicker(false)}
              className="flex items-center gap-2 text-white font-bold text-lg"
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M11 14L6 9l5-5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Connect Wallet
            </button>
          ) : (
            <span className="text-white text-lg font-bold">Mint Card</span>
          )}
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

        {/* Content */}
        <div className="px-5 pt-5 pb-6">
          {showWalletPicker ? (
            <div>
              <p className="text-sm text-text-secondary mb-4">
                Sign in with your wallet to pay with USDC on Base.
              </p>
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
          ) : (
            <>
              <div className="flex justify-center mb-5">
                <div className="w-40 h-28 rounded-lg border-2 border-accent-gold overflow-hidden shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={card.paperImage} alt={card.title} className="w-full h-full object-cover" />
                </div>
              </div>

              <div className="flex items-center justify-between px-1 mb-4">
                <span className="text-sm text-text-secondary">Price:</span>
                <span className="text-lg font-bold text-foreground">{displayPrice}</span>
              </div>

              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#00B2C7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <line x1="2" y1="12" x2="22" y2="12" />
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                  </svg>
                  <span className="text-sm font-semibold text-foreground">Send this greeting card to</span>
                </div>
                <div className="relative">
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="Enter name e.g. defidevrel"
                    className="w-full pr-24 px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-foreground placeholder:text-text-tertiary outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                  />
                  {!recipient.includes(".") && (
                    <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs text-text-tertiary">.base.eth</span>
                  )}
                </div>
                <p className="text-xs text-text-tertiary mt-1.5">
                  By default we treat this as a Basename label (e.g.{" "}
                  <span className="font-semibold">defidevrel.base.eth</span>). ENS (.eth) names and direct wallet addresses also work.
                </p>
                {isResolving && <p className="text-xs text-primary mt-1.5">Resolving recipient&hellip;</p>}
                {!isResolving && resolution?.success && resolution.address && (
                  <p className="text-xs text-foreground mt-1.5">
                    Resolved to{" "}
                    <span className="font-semibold">{formatAddress(resolution.address)}</span>{" "}
                    {!!resolution.resolvedFrom && <span className="text-text-tertiary">({resolution.resolvedFrom})</span>}
                  </p>
                )}
                {!isResolving && errorText && <p className="text-xs text-red-500 mt-1.5">{errorText}</p>}
              </div>

              {!isConnected ? (
                <button
                  type="button"
                  onClick={() => setShowWalletPicker(true)}
                  className="w-full rounded-md btn-primary text-white text-base font-bold leading-[140%] transition-colors active:scale-[0.98] flex items-center justify-center gap-2"
                  style={{ fontFamily: "'Satoshi', sans-serif", height: 46 }}
                >
                  Connect Wallet to Pay
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowWalletPicker(true)}
                    className="w-full text-center text-xs text-gray-500 underline mb-2 bg-transparent border-0 p-0 cursor-pointer font-inherit"
                  >
                    Switch Wallet
                  </button>
                  <button
                    type="button"
                    onClick={handleMint}
                    disabled={!recipient.trim() || isMinting}
                    className="w-full rounded-md btn-primary text-white text-base font-bold leading-[140%] transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    style={{ fontFamily: "'Satoshi', sans-serif", height: 46 }}
                  >
                    {isMinting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" aria-hidden>
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>Minting…</span>
                      </>
                    ) : (
                      <>Mint for {displayPrice}</>
                    )}
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </Modal>
  );
}
