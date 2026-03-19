"use client";

import { useQuery } from "@tanstack/react-query";
import type { Address } from "viem";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function useBasename(address: Address | string | undefined | null): {
  name: string | null;
  isLoading: boolean;
} {
  const query = useQuery({
    queryKey: ["basename", address],
    queryFn: async (): Promise<string | null> => {
      if (!address || address === ZERO_ADDRESS) return null;
      try {
        const res = await fetch(`/api/basename/${address}`);
        if (!res.ok) return null;
        const data = await res.json();
        return data.name ?? null;
      } catch {
        return null;
      }
    },
    enabled: Boolean(address && address !== ZERO_ADDRESS),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  return {
    name: query.data ?? null,
    isLoading: query.isLoading,
  };
}

export function shortAddress(addr: string | undefined | null): string {
  if (addr == null || typeof addr !== "string" || addr.length < 10)
    return addr ?? "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}
