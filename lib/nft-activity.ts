/**
 * Fetch sent/received greeting card NFTs from the GreetingCardNFT contract.
 * Uses the contract's getCardsSent / getCardsReceived and getCardDetails (new contract).
 * Requires NEXT_PUBLIC_CONTRACT_ADDRESS to be the deployed contract address.
 */

import type { Address } from "viem";
import { getAddress, type PublicClient } from "viem";
import nftAbi from "./Abi.json";
import { getAllCards } from "./greeting-cards-data";

const abi = (nftAbi as { abi: readonly unknown[] }).abi;

const IPFS_GATEWAY_PREFIX = "https://ipfs.io/ipfs/";
const MIGGLES_BACK_IMAGE = "/images/categories/miggles/miggles2.png";

function backImageFromTokenUri(rawUri: string, resolvedBack?: string): string | undefined {
  if (rawUri.toLowerCase().includes("miggles")) {
    return MIGGLES_BACK_IMAGE;
  }
  return resolvedBack;
}

export interface ReceivedCardItem {
  id: string;
  tokenId: bigint;
  cardImage: string;
  backImage?: string;
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
  backImage?: string;
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

function ipfsUriToHttp(uri: string): string {
  const t = uri.trim();
  if (t.startsWith("ipfs://")) {
    return `${IPFS_GATEWAY_PREFIX}${t.slice("ipfs://".length)}`;
  }
  return t;
}

function resolveNftImageField(image: string): string {
  const i = image.trim();
  if (i.startsWith("ipfs://")) return ipfsUriToHttp(i);
  return i;
}

async function fetchMetadataJson(tokenUri: string): Promise<unknown | null> {
  const url = ipfsUriToHttp(tokenUri.trim());
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const text = await res.text();
    const trimmed = text.trim();
    if (!trimmed.startsWith("{")) return null;
    return JSON.parse(trimmed) as unknown;
  } catch {
    return null;
  }
}

function imageUrlMatchesPaperImage(metaImage: string, paperImage: string): boolean {
  const paper = paperImage.trim();
  const meta = metaImage.trim();
  if (!paper || !meta) return false;
  if (meta === paper) return true;
  const paperPath = paper.startsWith("/") ? paper.slice(1) : paper;
  const lowerMeta = meta.toLowerCase();
  const lowerPaper = paperPath.toLowerCase();
  if (lowerMeta.endsWith(lowerPaper)) return true;
  if (lowerMeta.includes(`/${lowerPaper}`)) return true;
  try {
    const pathname = new URL(meta).pathname.toLowerCase();
    if (pathname.endsWith(`/${lowerPaper}`) || pathname.endsWith(lowerPaper)) return true;
    if (pathname === paper.toLowerCase()) return true;
  } catch {
    /* not an absolute URL */
  }
  const basePaper = paperPath.split("/").pop() ?? "";
  const baseMeta = meta.split("/").pop()?.split("?")[0] ?? "";
  if (basePaper && baseMeta && basePaper.toLowerCase() === baseMeta.toLowerCase()) return true;
  return false;
}

function findBackImageForMetadataImage(metaImageRaw: string): string | undefined {
  const displayResolved = resolveNftImageField(metaImageRaw);
  for (const card of getAllCards()) {
    if (
      (imageUrlMatchesPaperImage(metaImageRaw, card.paperImage) ||
        imageUrlMatchesPaperImage(displayResolved, card.paperImage)) &&
      card.backImage
    ) {
      return card.backImage;
    }
  }
  return undefined;
}

/**
 * Resolves token URI: fetches ERC-721 metadata JSON when possible, uses `image` for card art,
 * and matches that image to catalog `paperImage` to attach `backImage` for pre-designed cards.
 */
async function resolveCardDisplayFromTokenUri(
  rawUri: string
): Promise<{ cardImage: string; backImage?: string }> {
  const trimmed = rawUri.trim();
  const fallbackImage = trimmed || "/images/meep.png";
  if (!trimmed) {
    return { cardImage: "/images/meep.png" };
  }

  const meta = await fetchMetadataJson(trimmed);
  if (!meta || typeof meta !== "object" || meta === null || !("image" in meta)) {
    return { cardImage: fallbackImage };
  }

  const imageRaw = (meta as { image?: unknown }).image;
  if (typeof imageRaw !== "string" || !imageRaw.trim()) {
    return { cardImage: fallbackImage };
  }

  const cardImage = resolveNftImageField(imageRaw);
  const backImage = findBackImageForMetadataImage(imageRaw);
  return backImage ? { cardImage, backImage } : { cardImage };
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
