"use client";

import type { ReactNode } from "react";
import { useState } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { base } from "wagmi/chains";
import { createConfig, WagmiProvider } from "wagmi";
import { injected, baseAccount } from "wagmi/connectors";
import { http, cookieStorage, createStorage } from "wagmi";

const wagmiConfig = createConfig({
  chains: [base],
  connectors: [injected(), baseAccount({ appName: "Evrlink" })],
  storage: createStorage({ storage: cookieStorage }),
  ssr: true,
  transports: {
    [base.id]: http(),
  },
});

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <OnchainKitProvider
      chain={base}
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      miniKit={{ enabled: true }}
      config={{ appearance: { mode: "auto" } }}
    >
      <WagmiProvider config={wagmiConfig}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </WagmiProvider>
    </OnchainKitProvider>
  );
}
