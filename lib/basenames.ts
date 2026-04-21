import {
  type Address,
  createPublicClient,
  encodePacked,
  http,
  keccak256,
  namehash,
} from "viem";
import { base, mainnet } from "viem/chains";

export const BASENAME_L2_RESOLVER_ADDRESS =
  "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD";

const L2_RESOLVER_ABI = [
  {
    inputs: [{ name: "node", type: "bytes32" }],
    name: "name",
    outputs: [{ name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

const baseClient = createPublicClient({
  chain: base,
  transport: http("https://mainnet.base.org"),
});

export const convertChainIdToCoinType = (chainId: number): string => {
  if (chainId === mainnet.id) return "addr";
  const cointype = (0x80000000 | chainId) >>> 0;
  return cointype.toString(16).toLocaleUpperCase();
};

export const convertReverseNodeToBytes = (address: Address, chainId: number) => {
  const addressFormatted = address.toLocaleLowerCase() as Address;
  const addressNode = keccak256(addressFormatted.substring(2) as Address);
  const chainCoinType = convertChainIdToCoinType(chainId);
  const baseReverseNode = namehash(`${chainCoinType.toLocaleUpperCase()}.reverse`);
  const addressReverseNode = keccak256(
    encodePacked(["bytes32", "bytes32"], [baseReverseNode, addressNode])
  );
  return addressReverseNode;
};

export async function getBasename(address: Address): Promise<string | null> {
  try {
    const addressReverseNode = convertReverseNodeToBytes(address, base.id);
    const basename = await baseClient.readContract({
      abi: L2_RESOLVER_ABI,
      address: BASENAME_L2_RESOLVER_ADDRESS,
      functionName: "name",
      args: [addressReverseNode],
    });
    if (basename) return basename;
    return null;
  } catch {
    return null;
  }
}
