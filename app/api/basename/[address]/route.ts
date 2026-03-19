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
    return NextResponse.json({ name: null });
  }

  try {
    const res = await fetch(
      `https://api.neynar.com/v2/farcaster/user/bulk-by-address?addresses=${address.toLowerCase()}`,
      {
        headers: {
          accept: "application/json",
          "x-api-key": NEYNAR_API_KEY,
        },
        next: { revalidate: 300 }, // cache for 5 minutes
      }
    );

    if (!res.ok) {
      return NextResponse.json({ name: null });
    }

    const data = await res.json();
    // Response: { [address_lowercase]: [{ username, display_name, ... }] }
    const users = data?.[address.toLowerCase()];
    if (Array.isArray(users) && users.length > 0) {
      const user = users[0];
      const name = user.display_name || (user.username ? `@${user.username}` : null);
      return NextResponse.json({ name });
    }

    return NextResponse.json({ name: null });
  } catch {
    return NextResponse.json({ name: null });
  }
}
