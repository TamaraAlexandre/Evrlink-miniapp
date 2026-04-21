"use client";

import type { Address } from "viem";
import { useEnsName } from "wagmi";
import { mainnet } from "wagmi/chains";

interface AddressDisplayProps {
  address: Address | string | undefined | null;
  className?: string;
}

function shortAddress(addr: string | undefined | null): string {
  if (!addr || addr.length < 10) return addr ?? "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function AddressDisplay({ address, className }: AddressDisplayProps) {
  const { data: name } = useEnsName({
    address: address as Address,
    chainId: mainnet.id,
  });
  return <span className={className}>{name ?? shortAddress(address as string)}</span>;
}
