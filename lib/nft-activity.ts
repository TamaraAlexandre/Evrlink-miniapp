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
}

export interface SentCardItem {
  id: string;
  tokenId: bigint;
  cardImage: string;
  recipientAddress: Address;
  blockNumber: bigint;
  cardTitle: string;
  tags: string[];
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
  const tokenIds = await client.readContract({
    address: contractAddress,
    abi,
    functionName: "getCardsReceived",
    args: [userAddress],
  });

  if (!tokenIds || !Array.isArray(tokenIds) || tokenIds.length === 0) {
    return [];
  }

  const details = await Promise.all(
    (tokenIds as bigint[]).map((tokenId) =>
      client.readContract({
        address: contractAddress,
        abi,
        functionName: "getCardDetails",
        args: [tokenId],
      })
    )
  );

  const zero = "0x0000000000000000000000000000000000000000" as Address;
  return (details as { sender: Address; recipient: Address; currentOwner: Address; uri: string }[])
    .map((d, i) => ({
      id: `recv-${tokenIds[i]}`,
      tokenId: tokenIds[i] as bigint,
      cardImage: d.uri ?? "",
      senderAddress: d.sender ?? zero,
      blockNumber: BigInt(0),
      cardTitle: "Greeting Card",
      tags: [] as string[],
    }))
    .filter((c) => c.cardImage);
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

  const items: SentCardItem[] = [];

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    const tokenId = tokenIds[i];
    if (result.status === "fulfilled") {
      const d = result.value as {
        sender: Address;
        recipient: Address;
        currentOwner: Address;
        uri: string;
      };
      items.push({
        id: `sent-${tokenId}`,
        tokenId,
        cardImage: d.uri?.trim() || "/images/meep.png",
        recipientAddress: d.recipient ?? ("0x0000000000000000000000000000000000000000" as Address),
        blockNumber: BigInt(0),
        cardTitle: "Greeting Card",
        tags: [],
      });
    } else {
      try {
        const uri = await client.readContract({
          address: contractAddress,
          abi,
          functionName: "tokenURI",
          args: [tokenId],
        });
        items.push({
          id: `sent-${tokenId}`,
          tokenId,
          cardImage: typeof uri === "string" && uri.trim() ? uri : "/images/meep.png",
          recipientAddress: "0x0000000000000000000000000000000000000000" as Address,
          blockNumber: BigInt(0),
          cardTitle: "Greeting Card",
          tags: [],
        });
      } catch {
        items.push({
          id: `sent-${tokenId}`,
          tokenId,
          cardImage: "/images/meep.png",
          recipientAddress: "0x0000000000000000000000000000000000000000" as Address,
          blockNumber: BigInt(0),
          cardTitle: "Greeting Card",
          tags: [],
        });
      }
    }
  }

  return items;
}
