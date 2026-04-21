"use client";

import type { Address } from "viem";
import { useName } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";

interface AddressDisplayProps {
  address: Address | string | undefined | null;
  className?: string;
}

function shortAddress(addr: string | undefined | null): string {
  if (!addr || addr.length < 10) return addr ?? "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function AddressDisplay({ address, className }: AddressDisplayProps) {
  const { data: name } = useName({ address: address as Address, chain: base });
  const display = name ?? shortAddress(address as string);
  return <span className={className}>{display}</span>;
}
