/**
 * POST /api/webhook
 *
 * Receives Base App (formerly Farcaster Mini App) lifecycle events:
 *   - miniapp_added        → save notification token
 *   - miniapp_removed      → delete token
 *   - notifications_enabled  → save new token
 *   - notifications_disabled → delete token
 *
 * This version is compatible with Base App and does not depend on
 * @farcaster/miniapp-node. It trusts that the platform only calls this
 * endpoint with valid, authorized events.
 */

import type { NextRequest } from "next/server";
import {
  setUserNotificationDetails,
  deleteUserNotificationDetails,
} from "@/lib/kv";
import { sendNotification } from "@/lib/notifs";

type MiniAppEventBase = {
  event: string;
  notificationDetails?: {
    url: string;
    token: string;
  };
};

type MiniAppAddedEvent = MiniAppEventBase & {
  event: "miniapp_added";
};

type MiniAppRemovedEvent = MiniAppEventBase & {
  event: "miniapp_removed";
};

type NotificationsEnabledEvent = MiniAppEventBase & {
  event: "notifications_enabled";
};

type NotificationsDisabledEvent = MiniAppEventBase & {
  event: "notifications_disabled";
};

type WebhookEvent =
  | MiniAppAddedEvent
  | MiniAppRemovedEvent
  | NotificationsEnabledEvent
  | NotificationsDisabledEvent;

type WebhookBody = {
  fid: number;
  event: WebhookEvent;
};

export async function POST(request: NextRequest) {
  let data: WebhookBody;

  try {
    data = (await request.json()) as WebhookBody;
  } catch (e) {
    return Response.json(
      { success: false, error: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (!data || typeof data.fid !== "number" || !data.event) {
    return Response.json(
      { success: false, error: "Missing fid or event" },
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
      if (event.notificationDetails) {
        await setUserNotificationDetails(fid, event.notificationDetails);
      }
      await sendNotification({
        fid,
        title: "Notifications enabled",
        body: "You'll now be notified when you receive a greeting card!",
      });
      break;

    case "notifications_disabled":
      await deleteUserNotificationDetails(fid);
      break;

    default:
      // Ignore unknown events but return success so the platform doesn't retry endlessly.
      break;
  }

  return Response.json({ success: true });
}

