import { NextResponse, type NextRequest } from "next/server";
import { createPublicClient, http, namehash } from "viem";
import { normalize } from "viem/ens";
import { base, mainnet } from "viem/chains";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const L2_RESOLVER_ADDRESS =
  "0xC6d566A56A1aFf6508b41f6c90ff131615583BCD" as const;

const L2_RESOLVER_ABI = [
  {
    inputs: [{ name: "node", type: "bytes32" }],
    name: "addr",
    outputs: [{ name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
] as const;

function normalizeBasenameInput(
  raw: string
): { fullName: string; kind: "basename" | "ens" } {
  const name = raw.toLowerCase().trim();

  if (!name.includes(".")) {
    return { fullName: `${name}.base.eth`, kind: "basename" };
  }

  if (name.endsWith(".base.eth")) {
    return { fullName: name, kind: "basename" };
  }

  if (name.endsWith(".eth")) {
    return { fullName: name, kind: "ens" };
  }

  throw new Error(
    `Invalid name: ${raw}. Expected label, *.base.eth, or *.eth`
  );
}

async function resolveViaL2Resolver(name: string): Promise<string | null> {
  try {
    console.log("🔗 Calling L2 Resolver for:", name);

    const publicClient = createPublicClient({
      chain: base,
      transport: http("https://mainnet.base.org", {
        timeout: 30000,
        retryCount: 3,
      }),
    });

    const node = namehash(normalize(name));
    console.log("📝 Namehash:", node);

    const address = await publicClient.readContract({
      address: L2_RESOLVER_ADDRESS,
      abi: L2_RESOLVER_ABI,
      functionName: "addr",
      args: [node],
    });

    console.log("📬 L2 Resolver returned:", address);

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json(
      {
        error: "Name is required. Usage: /api/resolve-basename?name=jesse",
        status: "API is working",
      },
      { status: 400 }
    );
  }

  const fakeRequest = {
    json: async () => ({ name }),
  } as NextRequest;

  return POST(fakeRequest);
}

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

    if (kind === "basename") {
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

      try {
        const label = fullName.replace(/\.base\.eth$/, "");
        const apiUrl = `https://resolver-api.basename.app/v1/basenames/${label}`;

        console.log("📡 Calling Basename API (fallback):", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "User-Agent": "EvrLink-Miniapp/2.0",
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
    }

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
        error:
          error instanceof Error ? error.message : "Resolution failed",
      },
      { status: 500 }
    );
  }
}

