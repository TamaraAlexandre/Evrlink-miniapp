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

  type PendingRecv = {
    tokenId: bigint;
    sender: Address;
    rawUri: string;
  };

  const pending: PendingRecv[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const tokenId = tokenIds[i];

    if (result.status === "fulfilled") {
      // getCardDetails returns tuple: [sender, recipient, currentOwner, uri]
      const d = result.value as readonly [Address, Address, Address, string];
      const sender = d[0] ?? zero;
      const uri = (d[3] ?? "").trim();
      pending.push({ tokenId, sender, rawUri: uri });
    } else {
      // Fallback: try tokenURI
      try {
        const uri = await client.readContract({
          address: contractAddress,
          abi,
          functionName: "tokenURI",
          args: [tokenId],
        });
        const rawUri = typeof uri === "string" ? uri.trim() : "";
        pending.push({ tokenId, sender: zero, rawUri });
      } catch {
        pending.push({ tokenId, sender: zero, rawUri: "" });
      }
    }
  }

  const items = await Promise.all(
    pending.map(async ({ tokenId, sender, rawUri }) => {
      const { cardImage, backImage: catalogBack } =
        await resolveCardDisplayFromTokenUri(rawUri);
      const backImage = backImageFromTokenUri(rawUri, catalogBack);
      const item: ReceivedCardItem = {
        id: `recv-${tokenId}`,
        tokenId,
        cardImage,
        senderAddress: sender,
        blockNumber: BigInt(0),
        cardTitle: "Greeting Card",
        tags: [],
      };
      if (backImage) item.backImage = backImage;
      return item;
    })
  );

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

  const zeroRecipient = "0x0000000000000000000000000000000000000000" as Address;

  type PendingSent = {
    tokenId: bigint;
    recipient: Address;
    rawUri: string;
  };

  const pending: PendingSent[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const tokenId = tokenIds[i];
    if (result.status === "fulfilled") {
      // getCardDetails returns tuple: [sender, recipient, currentOwner, uri]
      const d = result.value as readonly [Address, Address, Address, string];
      const recipient = d[1] ?? zeroRecipient;
      const uri = (d[3] ?? "").trim();
      pending.push({ tokenId, recipient, rawUri: uri });
    } else {
      try {
        const uri = await client.readContract({
          address: contractAddress,
          abi,
          functionName: "tokenURI",
          args: [tokenId],
        });
        const rawUri = typeof uri === "string" ? uri.trim() : "";
        pending.push({ tokenId, recipient: zeroRecipient, rawUri });
      } catch {
        pending.push({ tokenId, recipient: zeroRecipient, rawUri: "" });
      }
    }
  }

  const items = await Promise.all(
    pending.map(async ({ tokenId, recipient, rawUri }) => {
      const { cardImage, backImage: catalogBack } =
        await resolveCardDisplayFromTokenUri(rawUri);
      const backImage = backImageFromTokenUri(rawUri, catalogBack);
      const item: SentCardItem = {
        id: `sent-${tokenId}`,
        tokenId,
        cardImage,
        recipientAddress: recipient,
        blockNumber: BigInt(0),
        cardTitle: "Greeting Card",
        tags: [],
      };
      if (backImage) item.backImage = backImage;
      return item;
    })
  );

  return items;
}
