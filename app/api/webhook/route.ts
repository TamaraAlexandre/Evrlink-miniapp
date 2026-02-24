/**
 * POST /api/webhook
 *
 * Receives Farcaster Mini App lifecycle events:
 *   - miniapp_added        → save notification token
 *   - miniapp_removed      → delete token
 *   - notifications_enabled  → save new token
 *   - notifications_disabled → delete token
 *
 * The webhookUrl in farcaster.json must point here.
 * Requires NEYNAR_API_KEY env var for signature verification.
 */

import { NextRequest } from "next/server";
import {
  ParseWebhookEvent,
  parseWebhookEvent,
  verifyAppKeyWithNeynar,
} from "@farcaster/miniapp-node";
import {
  setUserNotificationDetails,
  deleteUserNotificationDetails,
} from "@/lib/kv";
import { sendNotification } from "@/lib/notifs";

export async function POST(request: NextRequest) {
  const requestJson = await request.json();

  let data;
  try {
    data = await parseWebhookEvent(requestJson, verifyAppKeyWithNeynar);
  } catch (e: unknown) {
    const error = e as ParseWebhookEvent.ErrorType;

    switch (error.name) {
      case "VerifyJsonFarcasterSignature.InvalidDataError":
      case "VerifyJsonFarcasterSignature.InvalidEventDataError":
        return Response.json(
          { success: false, error: error.message },
          { status: 400 }
        );
      case "VerifyJsonFarcasterSignature.InvalidAppKeyError":
        return Response.json(
          { success: false, error: error.message },
          { status: 401 }
        );
      case "VerifyJsonFarcasterSignature.VerifyAppKeyError":
        return Response.json(
          { success: false, error: error.message },
          { status: 500 }
        );
    }
  }

  if (!data) {
    return Response.json(
      { success: false, error: "Failed to parse webhook event" },
      { status: 400 }
    );
  }

  const fid = data.fid;
  const event = data.event;

  switch (event.event) {
    case "miniapp_added":
      if (event.notificationDetails) {
        await setUserNotificationDetails(fid, event.notificationDetails);
        await sendNotification({
          fid,
          title: "Welcome to Evrlink!",
          body: "You'll get notified when someone sends you a greeting card.",
        });
      } else {
        await deleteUserNotificationDetails(fid);
      }
      break;

    case "miniapp_removed":
      await deleteUserNotificationDetails(fid);
      break;

    case "notifications_enabled":
      await setUserNotificationDetails(fid, event.notificationDetails);
      await sendNotification({
        fid,
        title: "Notifications enabled",
        body: "You'll now be notified when you receive a greeting card!",
      });
      break;

    case "notifications_disabled":
      await deleteUserNotificationDetails(fid);
      break;
  }

  return Response.json({ success: true });
}
