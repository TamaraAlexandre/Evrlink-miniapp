import { WagmiProvider } from "wagmi";
import {
  cookieStorage,
  createConfig,
  createStorage,
  http,
} from "wagmi";
import { base } from "wagmi/chains";
import { baseAccount, injected } from "wagmi/connectors";

export const wagmiConfig = createConfig({
  chains: [base],
  connectors: [
    injected(),
    baseAccount({
      appName: "Evrlink",
    }),
  ],
  storage: createStorage({
    storage: cookieStorage,
  }),
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

export type WagmiProviderType = typeof WagmiProvider;

