/**
 * Send a Farcaster in-app notification to a user by FID.
 * Looks up their stored notification token and POSTs to the Farcaster client's API.
 */

import {
  type SendNotificationRequest,
  sendNotificationResponseSchema,
} from "@farcaster/miniapp-node";
import { getUserNotificationDetails } from "./kv";

const appUrl = process.env.NEXT_PUBLIC_URL || "";

export type SendNotificationResult =
  | { state: "success" }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "error"; error: unknown };

export async function sendNotification({
  fid,
  title,
  body,
  targetUrl,
}: {
  fid: number;
  title: string;
  body: string;
  targetUrl?: string;
}): Promise<SendNotificationResult> {
  const details = await getUserNotificationDetails(fid);
  if (!details) {
    return { state: "no_token" };
  }

  try {
    const response = await fetch(details.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        notificationId: crypto.randomUUID(),
        title,
        body,
        targetUrl: targetUrl || appUrl,
        tokens: [details.token],
      } satisfies SendNotificationRequest),
    });

    const responseJson = await response.json();

    if (response.status === 200) {
      const parsed = sendNotificationResponseSchema.safeParse(responseJson);
      if (!parsed.success) {
        return { state: "error", error: parsed.error.errors };
      }
      if (parsed.data.result.rateLimitedTokens.length) {
        return { state: "rate_limit" };
      }
      return { state: "success" };
    }

    return { state: "error", error: responseJson };
  } catch (err) {
    return { state: "error", error: err };
  }
}
