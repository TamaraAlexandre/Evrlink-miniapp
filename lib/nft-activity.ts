/**
 * Fetch sent/received greeting card NFTs from the GreetingCardNFT contract.
 * Uses the contract's getCardsSent / getCardsReceived and getCardDetails (new contract).
 * Requires NEXT_PUBLIC_CONTRACT_ADDRESS to be the deployed contract address.
 */

import type { Address } from "viem";
import { getAddress, type PublicClient } from "viem";
import nftAbi from "./Abi.json";

const abi = (nftAbi as { abi: readonly unknown[] }).abi;

export interface ReceivedCardItem {
  id: string;
  tokenId: bigint;
  cardImage: string;
  senderAddress: Address;
  blockNumber: bigint;
  cardTitle: string;
  tags: string[];
  /** Card template ID — present when minted with the new metadata flow */
  cardId?: string;
  /** Personalized message written by sender — empty for pre-designed cards */
  message?: string;
}

export interface SentCardItem {
  id: string;
  tokenId: bigint;
  cardImage: string;
  recipientAddress: Address;
  blockNumber: bigint;
  cardTitle: string;
  tags: string[];
  /** Card template ID — present when minted with the new metadata flow */
  cardId?: string;
  /** Personalized message — empty for pre-designed cards */
  message?: string;
}

interface CardMetadata {
  image: string;
  cardId?: string;
  message?: string;
  name?: string;
}

/**
 * Try to load ERC-721 metadata JSON from an IPFS gateway URL.
 * Falls back gracefully so old cards (raw image URLs) still work.
 */
async function resolveMetadata(uri: string): Promise<CardMetadata> {
  if (!uri || !uri.startsWith("http")) return { image: uri || "/images/meep.png" };

  try {
    const res = await fetch(uri, {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/json, image/*" },
    });

    const contentType = res.headers.get("content-type") ?? "";

    // New flow: metadata JSON was stored on-chain
    if (contentType.includes("application/json") || contentType.includes("text/plain")) {
      const json = (await res.json()) as Record<string, unknown>;
      return {
        image: typeof json.image === "string" ? json.image : uri,
        cardId: typeof json.cardId === "string" ? json.cardId : undefined,
        message: typeof json.message === "string" ? json.message : undefined,
        name: typeof json.name === "string" ? json.name : undefined,
      };
    }
  } catch {
    // Network error / timeout — use URI as direct image URL
  }

  // Old flow or non-JSON response: treat URI as the card image directly
  return { image: uri };
}

/**
 * Fetch received cards using getCardsReceived(recipient) and getCardDetails(tokenId).
 * Returns tokens the contract has recorded as received by the user (including mints to them).
 */
export async function fetchReceivedCards(
  client: PublicClient,
  contractAddress: Address,
  userAddress: Address
): Promise<ReceivedCardItem[]> {
  let normalizedAddress: Address;
  try {
    normalizedAddress = getAddress(userAddress);
  } catch {
    return [];
  }

  const rawTokenIds = await client.readContract({
    address: contractAddress,
    abi,
    functionName: "getCardsReceived",
    args: [normalizedAddress],
  });

  if (!rawTokenIds || !Array.isArray(rawTokenIds) || rawTokenIds.length === 0) {
    return [];
  }

  const tokenIds = rawTokenIds.map((id) => toBigInt(id));

  const results = await Promise.allSettled(
    tokenIds.map((tokenId) =>
      client.readContract({
        address: contractAddress,
        abi,
        functionName: "getCardDetails",
        args: [tokenId],
      })
    )
  );

  const zero = "0x0000000000000000000000000000000000000000" as Address;

  // Collect raw URIs + senders first, then resolve metadata in parallel
  const rawItems: { tokenId: bigint; uri: string; sender: Address }[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const tokenId = tokenIds[i];

    if (result.status === "fulfilled") {
      const d = result.value as readonly [Address, Address, Address, string];
      rawItems.push({ tokenId, uri: (d[3] ?? "").trim(), sender: d[0] ?? zero });
    } else {
      try {
        const uri = await client.readContract({
          address: contractAddress,
          abi,
          functionName: "tokenURI",
          args: [tokenId],
        });
        rawItems.push({
          tokenId,
          uri: typeof uri === "string" ? uri.trim() : "",
          sender: zero,
        });
      } catch {
        rawItems.push({ tokenId, uri: "", sender: zero });
      }
    }
  }

  // Resolve metadata (JSON or direct image URL) for all cards in parallel
  const metadataResults = await Promise.allSettled(
    rawItems.map((r) => resolveMetadata(r.uri))
  );

  const items: ReceivedCardItem[] = rawItems.map((raw, i) => {
    const meta =
      metadataResults[i].status === "fulfilled"
        ? (metadataResults[i] as PromiseFulfilledResult<CardMetadata>).value
        : { image: raw.uri || "/images/meep.png" };

    return {
      id: `recv-${raw.tokenId}`,
      tokenId: raw.tokenId,
      cardImage: meta.image || "/images/meep.png",
      senderAddress: raw.sender,
      blockNumber: BigInt(0),
      cardTitle: meta.name || "Greeting Card",
      tags: [],
      cardId: meta.cardId,
      message: meta.message,
    };
  });

  return items;
}

function toBigInt(v: unknown): bigint {
  if (typeof v === "bigint") return v;
  if (typeof v === "number") return BigInt(v);
  return BigInt(String(v));
}

/**
 * Fetch sent cards using getCardsSent(sender) and getCardDetails(tokenId).
 * Includes cards the user minted to others (originalSender is tracked in the new contract).
 */
export async function fetchSentCards(
  client: PublicClient,
  contractAddress: Address,
  userAddress: Address
): Promise<SentCardItem[]> {
  let normalizedAddress: Address;
  try {
    normalizedAddress = getAddress(userAddress);
  } catch {
    return [];
  }

  const rawTokenIds = await client.readContract({
    address: contractAddress,
    abi,
    functionName: "getCardsSent",
    args: [normalizedAddress],
  });

  if (!rawTokenIds || !Array.isArray(rawTokenIds) || rawTokenIds.length === 0) {
    return [];
  }

  const tokenIds = rawTokenIds.map((id) => toBigInt(id));

  const results = await Promise.allSettled(
    tokenIds.map((tokenId) =>
      client.readContract({
        address: contractAddress,
        abi,
        functionName: "getCardDetails",
        args: [tokenId],
      })
    )
  );

  const zero = "0x0000000000000000000000000000000000000000" as Address;

  // Collect raw URIs + recipients first, then resolve metadata in parallel
  const rawItems: { tokenId: bigint; uri: string; recipient: Address }[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const tokenId = tokenIds[i];

    if (result.status === "fulfilled") {
      const d = result.value as readonly [Address, Address, Address, string];
      rawItems.push({ tokenId, uri: (d[3] ?? "").trim(), recipient: d[1] ?? zero });
    } else {
      try {
        const uri = await client.readContract({
          address: contractAddress,
          abi,
          functionName: "tokenURI",
          args: [tokenId],
        });
        rawItems.push({
          tokenId,
          uri: typeof uri === "string" ? uri.trim() : "",
          recipient: zero,
        });
      } catch {
        rawItems.push({ tokenId, uri: "", recipient: zero });
      }
    }
  }

  // Resolve metadata (JSON or direct image URL) for all cards in parallel
  const metadataResults = await Promise.allSettled(
    rawItems.map((r) => resolveMetadata(r.uri))
  );

  const items: SentCardItem[] = rawItems.map((raw, i) => {
    const meta =
      metadataResults[i].status === "fulfilled"
        ? (metadataResults[i] as PromiseFulfilledResult<CardMetadata>).value
        : { image: raw.uri || "/images/meep.png" };

    return {
      id: `sent-${raw.tokenId}`,
      tokenId: raw.tokenId,
      cardImage: meta.image || "/images/meep.png",
      recipientAddress: raw.recipient,
      blockNumber: BigInt(0),
      cardTitle: meta.name || "Greeting Card",
      tags: [],
      cardId: meta.cardId,
      message: meta.message,
    };
  });

  return items;
}
