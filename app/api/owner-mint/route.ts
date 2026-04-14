import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, getAddress } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";
import nftAbi from "@/lib/Abi.json";

export async function POST(req: NextRequest) {
  try {
    const { uri, recipient, paymentId } = await req.json();

    if (!uri || !recipient || !paymentId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let privateKey = process.env.OWNER_PRIVATE_KEY || "";
    privateKey = privateKey.trim();
    if (!privateKey.startsWith("0x")) {
      privateKey = "0x" + privateKey;
    }

    const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`;

    if (!privateKey || !contractAddress) {
      return NextResponse.json({ error: "Server misconfigured" }, { status: 500 });
    }

    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const client = createWalletClient({
      account,
      chain: base,
      transport: http(process.env.NEXT_PUBLIC_PAYMASTER_URL || "https://mainnet.base.org"),
    });

    const hash = await client.writeContract({
      address: contractAddress,
      abi: nftAbi.abi,
      functionName: "ownerMint",
      args: [uri, getAddress(recipient)],
    });

    return NextResponse.json({ success: true, hash });
  } catch (error) {
    console.error("owner-mint error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Mint failed" },
      { status: 500 }
    );
  }
}
