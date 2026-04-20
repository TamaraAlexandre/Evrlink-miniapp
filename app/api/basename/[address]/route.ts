import { NextResponse } from "next/server";
import { getName } from "@coinbase/onchainkit/identity";
import { base } from "viem/chains";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;

  if (!address || address.toLowerCase() === ZERO_ADDRESS) {
    return NextResponse.json({ name: null });
  }

  try {
    const name = await getName({ address: address as `0x${string}`, chain: base });
    return NextResponse.json({ name: name ?? null });
  } catch {
    return NextResponse.json({ name: null });
  }
}
