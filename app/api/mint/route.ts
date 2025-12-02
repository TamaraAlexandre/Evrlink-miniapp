import { NextResponse, type NextRequest } from "next/server";

/**
 * API Route to mint greeting card NFT
 * Forwards request to backend NFT minting service
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { tokenURI, recipient, basename, sender } = body;

    // Validate inputs
    if (!tokenURI) {
      return NextResponse.json(
        { error: "tokenURI is required" },
        { status: 400 }
      );
    }

    if (!recipient) {
      return NextResponse.json(
        { error: "recipient address is required" },
        { status: 400 }
      );
    }

    // Get environment variables
    const mintApiUrl = process.env.MINT_API_URL;
    const mintApiKey = process.env.MINT_API_KEY;
    const contractAddress = process.env.CONTRACT_ADDRESS;

    if (!mintApiUrl || !mintApiKey || !contractAddress) {
      console.error("Missing environment variables:", {
        mintApiUrl: !!mintApiUrl,
        mintApiKey: !!mintApiKey,
        contractAddress: !!contractAddress,
      });
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 }
      );
    }

    console.log("🎁 Sending greeting card gift...", {
      tokenURI,
      recipient,
      basename: basename || "N/A",
      sender: sender || "N/A",
      contractAddress,
      mintApiUrl, // Log the URL being used
    });

    // Call the mint API service
    // Note: mintApiUrl should already include the full URL
    const mintResponse = await fetch(mintApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": mintApiKey,
      },
      body: JSON.stringify({
        tokenURI,
        recipient,
        contractAddress,
      }),
    });

    if (!mintResponse.ok) {
      const errorText = await mintResponse.text();
      console.error("Mint API error:", errorText);
      throw new Error(`Minting failed: ${mintResponse.status} ${errorText}`);
    }

    const mintResult = await mintResponse.json();

    console.log("✅ Greeting card NFT sent successfully:", {
      transactionHash: mintResult.transactionHash,
      tokenId: mintResult.tokenId,
      mintPrice: mintResult.mintPrice,
    });

    return NextResponse.json(
      {
        success: true,
        transactionHash: mintResult.transactionHash,
        tokenId: mintResult.tokenId?.toString(),
        mintPrice: mintResult.mintPrice?.toString(),
        recipient: recipient,
        basename,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Mint API route error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Minting failed",
      },
      { status: 500 }
    );
  }
}

