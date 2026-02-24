/**
 * POST /api/notify
 *
 * Called after a successful mint to notify the recipient that they received a card.
 *
 * Body: { recipientAddress: string, senderAddress?: string }
 *
 * Flow:
 *   1. Resolve recipientAddress → Farcaster FID via Neynar bulk-by-address API
 *   2. Look up stored notification token for that FID
 *   3. Send an in-app notification via the Farcaster client
 *
 * Requires NEYNAR_API_KEY env var.
 */

import { NextRequest } from "next/server";
import { sendNotification } from "@/lib/notifs";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const APP_URL = process.env.NEXT_PUBLIC_URL || "";

function shortAddr(addr: string): string {
  if (addr.length < 10) return addr;
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

/**
 * Resolve an Ethereum address to a Farcaster FID using Neynar's API.
 * Returns the FID of the first matching user, or null.
 */
async function resolveAddressToFid(
  address: string
): Promise<number | null> {
  if (!NEYNAR_API_KEY) {
    console.warn("[notify] NEYNAR_API_KEY not set, cannot resolve address to FID");
    return null;
  }

  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address.toLowerCase()}`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": NEYNAR_API_KEY,
        },
      }
    );

    if (!res.ok) {
      console.error("[notify] Neynar API error:", res.status, await res.text());
      return null;
    }

    const data = await res.json();
    // Response shape: { [address]: [{ fid, username, ... }] }
    const users = data?.[address.toLowerCase()];
    if (Array.isArray(users) && users.length > 0) {
      return users[0].fid as number;
    }
    return null;
  } catch (err) {
    console.error("[notify] Failed to resolve address to FID:", err);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { recipientAddress, senderAddress } = body as {
      recipientAddress?: string;
      senderAddress?: string;
    };

    if (!recipientAddress) {
      return Response.json(
        { success: false, error: "recipientAddress is required" },
        { status: 400 }
      );
    }

    // Resolve recipient wallet address → Farcaster FID
    const fid = await resolveAddressToFid(recipientAddress);

    if (!fid) {
      return Response.json({
        success: true,
        notified: false,
        reason: "Could not resolve recipient address to a Farcaster FID",
      });
    }

    const senderLabel = senderAddress ? shortAddr(senderAddress) : "Someone";

    const result = await sendNotification({
      fid,
      title: "You received a greeting card!",
      body: `${senderLabel} sent you a card on Evrlink. Open to view it!`,
      targetUrl: `${APP_URL}/received`,
    });

    return Response.json({
      success: true,
      notified: result.state === "success",
      notificationState: result.state,
      recipientFid: fid,
    });
  } catch (err) {
    console.error("[notify] Error:", err);
    return Response.json(
      { success: false, error: "Internal error sending notification" },
      { status: 500 }
    );
  }
}
