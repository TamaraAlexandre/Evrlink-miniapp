import { NextResponse } from "next/server";
import { createPublicClient, http, keccak256, toBytes, encodePacked } from "viem";
import { base } from "wagmi/chains";
import type { Address } from "viem";

const BASE_L2_RESOLVER = "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD" as Address;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

const L2_RESOLVER_ABI = [
  {
    inputs: [{ name: "node", type: "bytes32" }],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

function computeNamehash(name: string): `0x${string}` {
  let node: `0x${string}` = `0x${"00".repeat(32)}`;
  if (name === "") return node;
  const labels = name.split(".");
  for (let i = labels.length - 1; i >= 0; i--) {
    const labelHash = keccak256(toBytes(labels[i]));
    node = keccak256(encodePacked(["bytes32", "bytes32"], [node, labelHash]));
  }
  return node;
}

function getBaseReverseNode(address: Address): `0x${string}` {
  const chainCoinType = (0x80000000 + base.id) >>> 0;
  const coinTypeHex = chainCoinType.toString(16).toUpperCase();
  const baseReverseNode = computeNamehash(`${coinTypeHex}.reverse`);
  const addressNode = keccak256(toBytes(address.toLowerCase().slice(2)));
  return keccak256(
    encodePacked(["bytes32", "bytes32"], [baseReverseNode, addressNode])
  );
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!address || address === ZERO_ADDRESS) {
    return NextResponse.json({ name: null });
  }

  try {
    const client = createPublicClient({
      chain: base,
      transport: http("https://mainnet.base.org"),
    });

    const reverseNode = getBaseReverseNode(address as Address);

    const name = await client.readContract({
      address: BASE_L2_RESOLVER,
      abi: L2_RESOLVER_ABI,
      functionName: "name",
      args: [reverseNode],
    });

    return NextResponse.json({ name: name && name.length > 0 ? name : null });
  } catch {
    return NextResponse.json({ name: null });
  }
}
