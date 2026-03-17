"use client";

import type { Address } from "viem";
import { useBasename, shortAddress } from "@/lib/use-basename";

interface AddressDisplayProps {
  address: Address | string | undefined | null;
  className?: string;
}

export default function AddressDisplay({ address, className }: AddressDisplayProps) {
  const { name } = useBasename(address);
  const display = name ?? shortAddress(address);
  return <span className={className}>{display}</span>;
}
