"use client";

import { useState, useEffect } from "react";
import { getName } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";
import type { Address } from "viem";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";
const cache = new Map<string, string | null>();

export function useBasename(address: Address | string | undefined | null): {
  name: string | null;
  isLoading: boolean;
} {
  const [name, setName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!address || address === ZERO_ADDRESS) return;
    if (cache.has(address)) {
      setName(cache.get(address) ?? null);
      return;
    }
    setIsLoading(true);
    getName({ address: address as Address, chain: base })
      .then((n) => {
        cache.set(address, n ?? null);
        setName(n ?? null);
      })
      .catch(() => setName(null))
      .finally(() => setIsLoading(false));
  }, [address]);

  return { name, isLoading };
}

export function shortAddress(addr: string | undefined | null): string {
  if (addr == null || typeof addr !== "string" || addr.length < 10)
    return addr ?? "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
