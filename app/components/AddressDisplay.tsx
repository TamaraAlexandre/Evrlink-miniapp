"use client";

import type { Address } from "viem";
import { useQuery } from "@tanstack/react-query";

interface AddressDisplayProps {
  address: Address | string | undefined | null;
  className?: string;
}

function shortAddress(addr: string | undefined | null): string {
  if (!addr || addr.length < 10) return addr ?? "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function AddressDisplay({ address, className }: AddressDisplayProps) {
  const { data: name } = useQuery({
    queryKey: ["basename", address],
    queryFn: async () => {
      if (!address) return null;
      const res = await fetch(`/api/basename/${address}`);
      if (!res.ok) return null;
      const data = await res.json();
      return data.name ?? null;
    },
    enabled: Boolean(address),
    staleTime: 5 * 60 * 1000,
    retry: false,
  });
  return <span className={className}>{name ?? shortAddress(address as string)}</span>;
}
