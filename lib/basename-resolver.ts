/**
 * Basename & ENS Resolution Service
 * (ported from v1 – client-side helper; Base names use the L2 resolver on-chain)
 */

import { createPublicClient, http, namehash } from "viem";
import { normalize } from "viem/ens";
import { base } from "viem/chains";

const L2_RESOLVER_ADDRESS = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";
const L2_RESOLVER_ABI = [
  {
    inputs: [{ name: "node", type: "bytes32" }],
    name: "addr",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export function isValidBaseName(name: string): boolean {
  if (!name || typeof name !== "string") return false;
  return /^[a-zA-Z0-9]+\.base\.eth$/.test(name);
}

export function isBasenameInput(input: string): boolean {
  if (!input || typeof input !== "string") return false;
  const normalized = input.toLowerCase().trim();

  if (normalized.endsWith(".base.eth")) {
    return isValidBaseName(normalized);
  }

  if (!normalized.includes(".")) {
    return /^[a-zA-Z0-9]+$/.test(normalized);
  }

  return false;
}

export async function resolveBasename(name: string): Promise<string | null> {
  try {
    const normalizedName = name.toLowerCase().trim();

    if (normalizedName.match(/^0x[a-fA-F0-9]{40}$/)) {
      return normalizedName;
    }

    if (normalizedName.endsWith(".base.eth")) {
      if (!isValidBaseName(normalizedName)) {
        console.warn(`Invalid BaseName format: ${name}`);
        return null;
      }
      return await resolveBasenameOnBase(normalizedName);
    }

    if (
      normalizedName.endsWith(".eth") &&
      !normalizedName.endsWith(".base.eth")
    ) {
      return await resolveENSName(normalizedName);
    }

    if (!normalizedName.includes(".")) {
      const withExtension = `${normalizedName}.base.eth`;
      if (isValidBaseName(withExtension)) {
        return await resolveBasenameOnBase(withExtension);
      }
    }

    return null;
  } catch (error) {
    console.error("Error resolving basename:", error);
    return null;
  }
}

async function resolveBasenameOnBase(name: string): Promise<string | null> {
  const client = createPublicClient({ chain: base, transport: http() });
  const node = namehash(normalize(name));
  const address = await client.readContract({
    address: L2_RESOLVER_ADDRESS,
    abi: L2_RESOLVER_ABI,
    functionName: "addr",
    args: [node],
  });
  if (address && address !== "0x0000000000000000000000000000000000000000")
    return address;
  return null;
}

async function resolveENSName(name: string): Promise<string | null> {
  try {
    console.log("🔍 Resolving ENS via server API:", name);

    const response = await fetch("/api/resolve-basename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.address) {
        console.log(`✅ Resolved ${name} via server:`, data.address);
        return data.address;
      }
    }
  } catch (error) {
    console.error("Server-side ENS resolution error:", error);
  }

  return null;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function formatAddress(address: string): string {
  if (!isValidAddress(address)) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

const cache = new Map<string, { address: string | null; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function resolveBasenameWithCache(
  name: string
): Promise<string | null> {
  const cached = cache.get(name);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.address;
  }

  const address = await resolveBasename(name);
  cache.set(name, { address, timestamp: now });
  return address;
}


// Reverse resolution: wallet address → basename
const REVERSE_RESOLVER_ABI = [
  {
    inputs: [{ name: "node", type: "bytes32" }],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

export async function reverseResolveAddress(address: string): Promise<string | null> {
  try {
    if (!isValidAddress(address)) return null;
    const client = createPublicClient({ chain: base, transport: http() });
    // Build the reverse node: lowercase address + ".addr.reverse"
    const reverseName = `${address.toLowerCase().slice(2)}.addr.reverse`;
    const node = namehash(reverseName);
    const basename = await client.readContract({
      address: L2_RESOLVER_ADDRESS,
      abi: REVERSE_RESOLVER_ABI,
      functionName: "name",
      args: [node],
    });
    if (basename && basename.length > 0) return basename;
    return null;
  } catch {
    return null;
  }
}
