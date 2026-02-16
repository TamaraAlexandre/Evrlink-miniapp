/**
 * Simple KV store for Farcaster notification tokens.
 * Uses Upstash Redis (free tier works fine).
 *
 * Required env vars:
 *   KV_REST_API_URL   – Upstash Redis REST URL
 *   KV_REST_API_TOKEN – Upstash Redis REST token
 */

import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export interface NotificationDetails {
  url: string;
  token: string;
}

function userKey(fid: number): string {
  return `evrlink:notif:${fid}`;
}

export async function getUserNotificationDetails(
  fid: number
): Promise<NotificationDetails | null> {
  return await redis.get<NotificationDetails>(userKey(fid));
}

export async function setUserNotificationDetails(
  fid: number,
  details: NotificationDetails
): Promise<void> {
  await redis.set(userKey(fid), details);
}

export async function deleteUserNotificationDetails(
  fid: number
): Promise<void> {
  await redis.del(userKey(fid));
}
