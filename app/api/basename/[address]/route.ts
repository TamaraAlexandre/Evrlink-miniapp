import { NextResponse } from "next/server";
import { getBasename } from "@/lib/basenames";
import type { Address } from "viem";

const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const dynamic = "force-dynamic";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  if (!address || address.toLowerCase() === ZERO_ADDRESS) {
    return NextResponse.json({ name: null });
  }
  try {
    const name = await getBasename(address as Address);
    return NextResponse.json({ name, debug: "success" });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ name: null, debug: msg });
  }
}
