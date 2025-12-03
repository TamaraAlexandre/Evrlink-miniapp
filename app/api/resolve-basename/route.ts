import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient, http, namehash } from "viem";
import { normalize } from "viem/ens";
import { base, mainnet } from "viem/chains";

// Force dynamic rendering (not static)
export const dynamic = "force-dynamic";
export const runtime = "nodejs"; // Use Node.js runtime, not Edge

// Base L2 Resolver Address
const L2_RESOLVER_ADDRESS =
    "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD" as const;

// Correct L2 Resolver ABI (ENS-style addr(bytes32 node))
const L2_RESOLVER_ABI = [
    {
        inputs: [{ name: "node", type: "bytes32" }],
        name: "addr",
        outputs: [{ name: "", type: "address" }],
        stateMutability: "view",
        type: "function",
    },
] as const;

// Normalize/validate the incoming name and decide how to treat it
function normalizeBasenameInput(raw: string): {
    fullName: string;
    kind: "basename" | "ens";
} {
    const name = raw.toLowerCase().trim();

    // Only label => assume Basename label
    if (!name.includes(".")) {
        return { fullName: `${name}.base.eth`, kind: "basename" };
    }

    // Already a proper Basename
    if (name.endsWith(".base.eth")) {
        return { fullName: name, kind: "basename" };
    }

    // Plain ENS name (foo.eth)
    if (name.endsWith(".eth")) {
        return { fullName: name, kind: "ens" };
    }

    // Anything else is garbage (foo.base, foo.base.et, etc.)
    throw new Error(`Invalid name: ${raw}. Expected label, *.base.eth, or *.eth`);
}

/**
 * Resolve using Base's L2 Resolver directly
 */
async function resolveViaL2Resolver(name: string): Promise<string | null> {
    try {
        const publicClient = createPublicClient({
            chain: base,
            transport: http("https://mainnet.base.org"),
        });

        // ENS standard: normalize then namehash
        const node = namehash(normalize(name));

        const address = await publicClient.readContract({
            address: L2_RESOLVER_ADDRESS,
            abi: L2_RESOLVER_ABI,
            functionName: "addr",
            args: [node],
        });

        if (
            address &&
            address.toLowerCase() !==
            "0x0000000000000000000000000000000000000000"
        ) {
            return address;
        }

        return null;
    } catch (error) {
        console.error("L2 Resolver contract call failed:", error);
        return null;
    }
}

/**
 * Server-side Basename Resolution API
 * Bypasses CORS restrictions by resolving from server
 */
export async function POST(request: NextRequest) {
    try {
        const { name } = await request.json();

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        const normalizedInput = name.toLowerCase().trim();
        console.log("🔍 Resolving basename server-side:", normalizedInput);

        // If it's already an address, just return it
        if (normalizedInput.match(/^0x[a-f0-9]{40}$/i)) {
            return NextResponse.json({
                success: true,
                address: normalizedInput,
                resolvedFrom: "address",
            });
        }

        let fullName: string;
        let kind: "basename" | "ens";

        try {
            ({ fullName, kind } = normalizeBasenameInput(normalizedInput));
        } catch (e) {
            console.warn(String(e));
            return NextResponse.json(
                {
                    success: false,
                    address: null,
                    error: String(e),
                },
                { status: 400 }
            );
        }

        // Strategy 1: Basename API for .base.eth
        if (kind === "basename") {
            try {
                // Basename API expects the *label* without .base.eth
                const label = fullName.replace(/\.base\.eth$/, "");
                const apiUrl = `https://resolver-api.basename.app/v1/basenames/${label}`;

                console.log("📡 Calling Basename API:", apiUrl);

                const response = await fetch(apiUrl, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "User-Agent": "EvrLink-Miniapp/1.0",
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.address) {
                        console.log("✅ Resolved via Basename API:", data.address);
                        return NextResponse.json({
                            success: true,
                            address: data.address,
                            resolvedFrom: "basename-api",
                            name: fullName,
                        });
                    }
                } else {
                    console.warn(`Basename API returned ${response.status}`);
                }
            } catch (error) {
                console.error("Basename API error:", error);
            }

            // Strategy 2: Direct L2 Resolver Contract Call (fallback)
            try {
                const address = await resolveViaL2Resolver(fullName);
                if (address) {
                    console.log("✅ Resolved via L2 Resolver:", address);
                    return NextResponse.json({
                        success: true,
                        address,
                        resolvedFrom: "l2-resolver",
                        name: fullName,
                    });
                }
            } catch (error) {
                console.error("L2 Resolver error:", error);
            }
        }

        // Strategy 3: Try ENS mainnet for plain .eth names (NOT .base.eth)
        if (kind === "ens" && !fullName.endsWith(".base.eth")) {
            try {
                const publicClient = createPublicClient({
                    chain: mainnet,
                    transport: http(),
                });

                const address = await publicClient.getEnsAddress({
                    name: fullName,
                });

                if (address) {
                    console.log("✅ Resolved via ENS (mainnet):", address);
                    return NextResponse.json({
                        success: true,
                        address,
                        resolvedFrom: "ens",
                        name: fullName,
                    });
                }
            } catch (error) {
                console.error("ENS mainnet resolution error:", error);
            }
        }

        // Resolution failed
        console.log("❌ All resolution strategies failed for:", fullName);
        return NextResponse.json(
            {
                success: false,
                address: null,
                error: `Could not resolve ${fullName}`,
            },
            { status: 404 }
        );
    } catch (error) {
        console.error("❌ Resolve API error:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Resolution failed",
            },
            { status: 500 }
        );
    }
}
