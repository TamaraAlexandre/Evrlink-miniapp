"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "wagmi/chains";
import { createConfig, WagmiProvider } from "wagmi";
import { createBaseAccountSDK } from "@base-org/account";
import { custom } from "viem";
import { cookieStorage, createStorage } from "wagmi";

const sdk = createBaseAccountSDK({
  appName: "Evrlink",
  appChainIds: [8453],
});

const wagmiConfig = createConfig({
  chains: [base],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: custom(sdk.getProvider()),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
