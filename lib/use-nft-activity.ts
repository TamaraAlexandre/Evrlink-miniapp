"use client";

import { useQuery } from "@tanstack/react-query";
import { useAccount, usePublicClient } from "wagmi";
import { base } from "wagmi/chains";
import type { Address } from "viem";
import {
  fetchReceivedCards,
  fetchSentCards,
  type ReceivedCardItem,
  type SentCardItem,
} from "./nft-activity";

const CONTRACT_ADDRESS = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as
  | Address
  | undefined;

// Always read contract on Base so Sent/Received show data even if wallet chain is unclear
const baseChainId = base.id;

export function useReceivedCards(): {
  data: ReceivedCardItem[];
  isLoading: boolean;
  error: Error | null;
  isConfigured: boolean;
} {
  const { address } = useAccount();
  const client = usePublicClient({ chainId: baseChainId });

  const query = useQuery({
    queryKey: ["received-cards", address, CONTRACT_ADDRESS],
    queryFn: async (): Promise<ReceivedCardItem[]> => {
      if (!client || !address || !CONTRACT_ADDRESS) return [];
      return fetchReceivedCards(client, CONTRACT_ADDRESS, address);
    },
    enabled: Boolean(client && address && CONTRACT_ADDRESS),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    isConfigured: Boolean(CONTRACT_ADDRESS),
  };
}

export function useSentCards(overrideAddress?: Address | null): {
  data: SentCardItem[];
  isLoading: boolean;
  error: Error | null;
  isConfigured: boolean;
} {
  const { address: connectedAddress } = useAccount();
  const client = usePublicClient({ chainId: baseChainId });
  const address = overrideAddress ?? connectedAddress;

  const query = useQuery({
    queryKey: ["sent-cards", address, CONTRACT_ADDRESS],
    queryFn: async (): Promise<SentCardItem[]> => {
      if (!client || !address || !CONTRACT_ADDRESS) return [];
      return fetchSentCards(client, CONTRACT_ADDRESS, address);
    },
    enabled: Boolean(client && address && CONTRACT_ADDRESS),
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  return {
    data: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error as Error | null,
    isConfigured: Boolean(CONTRACT_ADDRESS),
  };
}
