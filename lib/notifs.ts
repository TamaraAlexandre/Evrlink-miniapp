/**
 * Send an in-app notification to a user by FID.
 * Looks up their stored notification token and POSTs to the client API.
 *
 * This version is Base App compatible and does not depend on @farcaster/miniapp-node.
 */

import { getUserNotificationDetails } from "./kv";

const appUrl = process.env.NEXT_PUBLIC_URL || "";

export type SendNotificationResult =
  | { state: "success" }
  | { state: "no_token" }
  | { state: "rate_limit" }
  | { state: "error"; error: unknown };

type NotificationPayload = {
  notificationId: string;
  title: string;
  body: string;
  targetUrl: string;
  tokens: string[];
};

type NotificationResponse = {
  result?: {
    rateLimitedTokens?: string[];
  };
};

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

  const payload: NotificationPayload = {
    notificationId: crypto.randomUUID(),
    title,
    body,
    targetUrl: targetUrl || appUrl,
    tokens: [details.token],
  };

  try {
    const response = await fetch(details.url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    let responseJson: NotificationResponse | unknown = {};
    try {
      responseJson = (await response.json()) as NotificationResponse;
    } catch {
      // If response is not JSON, treat as opaque but still handle status codes.
    }

    if (response.ok) {
      const rateLimitedTokens =
        (responseJson as NotificationResponse).result?.rateLimitedTokens ??
        [];
      if (rateLimitedTokens.length > 0) {
        return { state: "rate_limit" };
      }
      return { state: "success" };
    }

    return { state: "error", error: responseJson };
  } catch (err) {
    return { state: "error", error: err };
  }
}

