import { createPublicClient, http } from "viem";
import { mainnet, base } from "viem/chains";
import type { Address } from "viem";

// toCoinType(base.id) = 0x80000000 | 8453 = 2147491781
const BASE_COIN_TYPE = 2147491781;

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http("https://cloudflare-eth.com"),
});

export async function getBasename(address: Address): Promise<string | null> {
  try {
    const name = await mainnetClient.getEnsName({
      address,
      coinType: BASE_COIN_TYPE,
    });
    return name ?? null;
  } catch {
    return null;
  }
}
