"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

/**
 * Calls sdk.actions.ready() once on client mount so the Farcaster/Base host
 * knows the mini app is ready to display.
 *
 * See: https://miniapps.farcaster.xyz/docs/getting-started#making-your-app-display
 */
export default function MiniAppReady() {
  useEffect(() => {
    const callReady = async () => {
      try {
        await sdk.actions.ready();
      } catch (err) {
        // Log for debugging but never break the UI.
        console.error("Failed to call sdk.actions.ready()", err);
      }
    };

    void callReady();
  }, []);

  return null;
}

