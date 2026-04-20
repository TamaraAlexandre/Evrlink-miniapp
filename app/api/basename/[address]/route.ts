import { NextResponse } from "next/server";
import { reverseResolveAddress } from "@/lib/basename-resolver";

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
    const name = await reverseResolveAddress(address);
    return NextResponse.json({ name });
  } catch {
    return NextResponse.json({ name: null });
  }
}
