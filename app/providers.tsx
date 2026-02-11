"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { sdk } from "@farcaster/miniapp-sdk";
import { wagmiConfig } from "@/lib/wagmi";

type MiniAppUser = {
  fid: number;
  username?: string;
  displayName?: string;
  pfpUrl?: string;
};

type MiniAppContextValue = {
  user: MiniAppUser | null;
  isInMiniApp: boolean;
};

const MiniAppContext = createContext<MiniAppContextValue>({
  user: null,
  isInMiniApp: false,
});

export function MiniAppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MiniAppUser | null>(null);
  const [isInMiniApp, setIsInMiniApp] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const loadContextAndAuth = async () => {
      try {
        const inMiniApp = await sdk.isInMiniApp();
        if (!inMiniApp || cancelled) return;

        setIsInMiniApp(true);

        const context = await sdk.context;
        if (!cancelled && context?.user) {
          setUser(context.user as MiniAppUser);
        }

        // Trigger Quick Auth to obtain a session token without explicit sign-in.
        try {
          await sdk.quickAuth.getToken();
        } catch (authError) {
          console.error("Quick Auth failed", authError);
        }
      } catch (error) {
        console.error("Failed to load mini app context", error);
      }
    };

    loadContextAndAuth();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <MiniAppContext.Provider value={{ user, isInMiniApp }}>
      {children}
    </MiniAppContext.Provider>
  );
}

export function useMiniAppUser() {
  return useContext(MiniAppContext);
}

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <WagmiProvider config={wagmiConfig}>
        <MiniAppProvider>{children}</MiniAppProvider>
      </WagmiProvider>
    </QueryClientProvider>
  );
}

