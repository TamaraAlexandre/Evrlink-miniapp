"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { base } from "wagmi/chains";
import type { Address } from "viem";

// Base Mainnet Universal Resolver for Basenames
const BASE_UNIVERSAL_RESOLVER = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD" as Address;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export function useBasename(address: Address | string | undefined | null): {
  name: string | null;
  isLoading: boolean;
} {
  const client = usePublicClient({ chainId: base.id });

  const query = useQuery({
    queryKey: ["basename", address],
    queryFn: async (): Promise<string | null> => {
      if (!client || !address || address === ZERO_ADDRESS) return null;
      try {
        const name = await client.getEnsName({
          address: address as Address,
          universalResolverAddress: BASE_UNIVERSAL_RESOLVER,
        });
        return name ?? null;
      } catch {
        return null;
      }
    },
    enabled: Boolean(client && address && address !== ZERO_ADDRESS),
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
