import { NextResponse, type NextRequest } from "next/server";
import { getPinata } from "@/lib/pinata";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Upload ERC-721-compatible JSON metadata to IPFS via Pinata.
 * Body: { name, description, image, cardId, message }
 * Returns the public IPFS gateway URL of the uploaded JSON.
 */
export async function POST(request: NextRequest) {
  try {
    const pinata = getPinata();
    if (!pinata) {
      return NextResponse.json(
        { error: "IPFS not configured. Set PINATA_JWT in your environment." },
        { status: 503 }
      );
    }

    const metadata = await request.json();

    if (!metadata || typeof metadata !== "object") {
      return NextResponse.json({ error: "Invalid metadata body" }, { status: 400 });
    }

    let uploadResult;
    try {
      uploadResult = await pinata.upload.public.json(metadata);
    } catch (uploadErr) {
      const err = uploadErr as Error;
      console.error("Pinata metadata upload failed:", err.message);
      return NextResponse.json(
        { error: err.message || "Pinata metadata upload failed" },
        { status: 502 }
      );
    }

    const cid = uploadResult?.cid;
    if (!cid || cid === "pending") {
      return NextResponse.json(
        { error: "IPFS pin is pending or missing CID" },
        { status: 502 }
      );
    }

    let url: string;
    try {
      url = await pinata.gateways.public.convert(`ipfs://${cid}`);
    } catch {
      url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    }

    return NextResponse.json(url, { status: 200 });
  } catch (error) {
    const err = error as Error;
    console.error("Metadata upload API error:", err.message);
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
