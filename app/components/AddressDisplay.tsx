"use client";

import type { Address } from "viem";

interface AddressDisplayProps {
  address: Address | string | undefined | null;
  name?: string | null;
  className?: string;
}

function shortAddress(addr: string | undefined | null): string {
  if (!addr || addr.length < 10) return addr ?? "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function AddressDisplay({ address, name, className }: AddressDisplayProps) {
  const display = name || shortAddress(address as string);
  return <span className={className}>{display}</span>;
}
