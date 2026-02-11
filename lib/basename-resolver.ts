/**
 * Basename & ENS Resolution Service
 * (ported from v1 – client-side helper that calls our API route)
 */

export function isValidBaseName(name: string): boolean {
  if (!name || typeof name !== "string") return false;
  return /^[a-zA-Z0-9]+\.base\.eth$/.test(name);
}

export function isBasenameInput(input: string): boolean {
  if (!input || typeof input !== "string") return false;
  const normalized = input.toLowerCase().trim();

  if (normalized.endsWith(".base.eth")) {
    return isValidBaseName(normalized);
  }

  if (!normalized.includes(".")) {
    return /^[a-zA-Z0-9]+$/.test(normalized);
  }

  return false;
}

export async function resolveBasename(name: string): Promise<string | null> {
  try {
    const normalizedName = name.toLowerCase().trim();

    if (normalizedName.match(/^0x[a-fA-F0-9]{40}$/)) {
      return normalizedName;
    }

    if (normalizedName.endsWith(".base.eth")) {
      if (!isValidBaseName(normalizedName)) {
        console.warn(`Invalid BaseName format: ${name}`);
        return null;
      }
      return await resolveBasenameOnBase(normalizedName);
    }

    if (
      normalizedName.endsWith(".eth") &&
      !normalizedName.endsWith(".base.eth")
    ) {
      return await resolveENSName(normalizedName);
    }

    if (!normalizedName.includes(".")) {
      const withExtension = `${normalizedName}.base.eth`;
      if (isValidBaseName(withExtension)) {
        return await resolveBasenameOnBase(withExtension);
      }
    }

    return null;
  } catch (error) {
    console.error("Error resolving basename:", error);
    return null;
  }
}

async function resolveBasenameOnBase(name: string): Promise<string | null> {
  try {
    console.log("🔍 Resolving basename via server API:", name);

    const response = await fetch("/api/resolve-basename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: name.replace(".base.eth", "") }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.address) {
        console.log(`✅ Resolved ${name} via server:`, data.address);
        return data.address;
      }
    } else {
      console.warn(`Server resolution failed with status ${response.status}`);
    }
  } catch (error) {
    console.error("Server-side resolution error:", error);
  }

  return null;
}

async function resolveENSName(name: string): Promise<string | null> {
  try {
    console.log("🔍 Resolving ENS via server API:", name);

    const response = await fetch("/api/resolve-basename", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name }),
    });

    if (response.ok) {
      const data = await response.json();
      if (data.success && data.address) {
        console.log(`✅ Resolved ${name} via server:`, data.address);
        return data.address;
      }
    }
  } catch (error) {
    console.error("Server-side ENS resolution error:", error);
  }

  return null;
}

export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

export function formatAddress(address: string): string {
  if (!isValidAddress(address)) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

const cache = new Map<string, { address: string | null; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000;

export async function resolveBasenameWithCache(
  name: string
): Promise<string | null> {
  const cached = cache.get(name);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached.address;
  }

  const address = await resolveBasename(name);
  cache.set(name, { address, timestamp: now });
  return address;
}

