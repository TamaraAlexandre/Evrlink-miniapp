import { NextResponse } from "next/server";

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!address || address.toLowerCase() === ZERO_ADDRESS) {
    return NextResponse.json({ name: null });
  }

  if (!NEYNAR_API_KEY) {
    console.warn("[basename] NEYNAR_API_KEY is not set");
    return NextResponse.json({ name: null, debug: "missing_api_key" });
  }

  try {
    const addrLower = address.toLowerCase();
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${addrLower}`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": NEYNAR_API_KEY,
        },
        next: { revalidate: 300 },
      }
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("[basename] Neynar error", res.status, text);
      return NextResponse.json({ name: null, debug: `neynar_${res.status}` });
    }

    const data = await res.json();

    // Neynar may return keys in any casing — search case-insensitively
    const users: { username?: string; display_name?: string }[] | undefined =
      data?.[addrLower] ??
      Object.entries(data as Record<string, unknown>).find(
        ([k]) => k.toLowerCase() === addrLower
      )?.[1] as { username?: string; display_name?: string }[] | undefined;

    if (Array.isArray(users) && users.length > 0) {
      const user = users[0];
      const name =
        user.display_name ||
        (user.username ? `@${user.username}` : null);
      return NextResponse.json({ name });
    }

    return NextResponse.json({ name: null, debug: "no_farcaster_account" });
  } catch (err) {
    console.error("[basename] Unexpected error", err);
    return NextResponse.json({ name: null, debug: "exception" });
  }
}
