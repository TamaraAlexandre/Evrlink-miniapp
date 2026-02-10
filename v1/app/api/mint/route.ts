import { NextResponse, type NextRequest } from "next/server";

// Force dynamic rendering
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

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
    // Add timeout and better error handling
    const controller = new AbortController();
    const timeoutMs = 30000; // 30 seconds timeout
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let mintResponse;
    try {
      mintResponse = await fetch(mintApiUrl, {
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
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      // Handle specific timeout errors
      if (fetchError instanceof Error) {
        if (fetchError.name === 'AbortError' || fetchError.message.includes('timeout')) {
          throw new Error(
            `Connection timeout: Unable to reach mint service at ${mintApiUrl} within ${timeoutMs}ms. ` +
            `Please check if the service is running and accessible.`
          );
        }
        if (fetchError.message.includes('ECONNREFUSED') || fetchError.message.includes('ENOTFOUND')) {
          throw new Error(
            `Connection refused: Cannot connect to mint service at ${mintApiUrl}. ` +
            `Please verify the MINT_API_URL is correct and the service is running.`
          );
        }
      }
      throw fetchError;
    }

    if (!mintResponse.ok) {
      let errorMessage;
      try {
        const errorData = await mintResponse.json();
        errorMessage = errorData.error || errorData.message || `HTTP ${mintResponse.status}`;
      } catch {
        const errorText = await mintResponse.text();
        errorMessage = errorText || `HTTP ${mintResponse.status}`;
      }
      console.error("Mint API error:", {
        status: mintResponse.status,
        statusText: mintResponse.statusText,
        error: errorMessage,
        url: mintApiUrl,
      });
      throw new Error(`Minting failed: ${mintResponse.status} - ${errorMessage}`);
    }

    let mintResult;
    try {
      mintResult = await mintResponse.json();
    } catch (jsonError) {
      const responseText = await mintResponse.text();
      console.error("Failed to parse mint API response as JSON:", responseText);
      throw new Error(`Invalid response format from mint service: ${responseText.substring(0, 100)}`);
    }

    // Validate required response fields
    if (!mintResult.transactionHash) {
      throw new Error("Mint API response missing transactionHash");
    }

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

