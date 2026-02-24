import { NextResponse, type NextRequest } from "next/server";
import { getPinata } from "@/lib/pinata";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

/**
 * Upload a file to IPFS via Pinata (server-side).
 * Requires PINATA_JWT in env. Optional: NEXT_PUBLIC_GATEWAY_URL for dedicated gateway.
 */
export async function POST(request: NextRequest) {
  try {
    const pinata = getPinata();
    if (!pinata) {
      return NextResponse.json(
        {
          error:
            "IPFS upload is not configured. Set PINATA_JWT (and optionally NEXT_PUBLIC_GATEWAY_URL) in your environment.",
        },
        { status: 503 }
      );
    }

    const data = await request.formData();
    const file = data.get("file") as unknown as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    let uploadResult;
    try {
      uploadResult = await pinata.upload.public.file(file);
    } catch (uploadErr) {
      const err = uploadErr as Error & { cause?: Error; statusCode?: number; details?: unknown };
      const cause = err.cause?.message ?? err.message;
      console.error("Pinata upload failed:", cause, err.cause ?? err);
      const isNetwork =
        cause.includes("fetch failed") ||
        cause.includes("ECONNREFUSED") ||
        cause.includes("ETIMEDOUT") ||
        cause.includes("ENOTFOUND") ||
        cause.includes("network");
      return NextResponse.json(
        {
          error: isNetwork
            ? "Upload failed: cannot reach Pinata (check network or try again)."
            : err.message || "Pinata upload failed.",
        },
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
    } catch (convertErr) {
      console.error("Pinata gateway convert failed:", convertErr);
      url = `https://gateway.pinata.cloud/ipfs/${cid}`;
    }

    return NextResponse.json(url, { status: 200 });
  } catch (error) {
    const err = error as Error & { cause?: Error };
    console.error("IPFS upload API error:", err.message, err.cause ?? err);
    return NextResponse.json(
      {
        error:
          err.message?.includes("fetch failed") ||
          err.message?.includes("Pinata")
            ? "Upload failed: could not reach Pinata. Check your network and try again."
            : err.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
