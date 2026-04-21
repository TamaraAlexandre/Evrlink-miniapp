import { createPublicClient, http } from "viem";
import { mainnet, base } from "viem/chains";
import type { Address } from "viem";
import { toCoinType } from "viem/utils/ens/toCoinType";

const mainnetClient = createPublicClient({
  chain: mainnet,
  transport: http("https://cloudflare-eth.com"),
});

export async function getBasename(address: Address): Promise<string | null> {
  try {
    const name = await mainnetClient.getEnsName({
      address,
      coinType: toCoinType(base.id),
    });
    return name ?? null;
  } catch {
    return null;
  }
}
