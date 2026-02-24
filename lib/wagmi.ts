import { createConfig, http } from "wagmi";
import { WagmiProvider } from "wagmi";
import { base } from "wagmi/chains";
import { farcasterFrame } from "@farcaster/miniapp-wagmi-connector";

export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http("https://mainnet.base.org"),
  },
  connectors: [farcasterFrame()],
  ssr: true,
});

export type WagmiProviderType = typeof WagmiProvider;

