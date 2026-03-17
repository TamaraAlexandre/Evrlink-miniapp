"use client";

import { useQuery } from "@tanstack/react-query";
import { usePublicClient } from "wagmi";
import { base } from "wagmi/chains";
import {
  type Address,
  keccak256,
  toBytes,
  encodePacked,
  namehash,
} from "viem";

// Base Mainnet L2 Resolver — used for Basename reverse resolution
const BASE_L2_RESOLVER = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD" as Address;

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const L2_RESOLVER_ABI = [
  {
    inputs: [{ name: "node", type: "bytes32" }],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

/**
 * Computes the ENSIP-11 chain-specific reverse node for an address on Base.
 * This matches the approach used by OnchainKit for Basename reverse resolution.
 */
function getBaseReverseNode(address: Address): `0x${string}` {
  // Chain coin type for Base (chainId 8453): 0x80000000 + 8453 = 0x800020E5
  const chainCoinType = (0x80000000 + base.id) >>> 0;
  const coinTypeHex = chainCoinType.toString(16).toUpperCase();
  const baseReverseNode = namehash(`${coinTypeHex}.reverse`);
  const addressNode = keccak256(toBytes(address.toLowerCase().slice(2)));
  return keccak256(
    encodePacked(["bytes32", "bytes32"], [baseReverseNode, addressNode])
  );
}

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
        const reverseNode = getBaseReverseNode(address as Address);
        const name = await client.readContract({
          address: BASE_L2_RESOLVER,
          abi: L2_RESOLVER_ABI,
          functionName: "name",
          args: [reverseNode],
        });
        return name && name.length > 0 ? name : null;
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
