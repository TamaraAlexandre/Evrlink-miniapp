/**
 * Basename & ENS Resolution Service
 */

import { createPublicClient, http } from 'viem';
import { base, mainnet } from 'viem/chains';

/**
 * Resolve a basename or ENS name to an Ethereum address
 */
export async function resolveBasename(name: string): Promise<string | null> {
  try {
    const normalizedName = name.toLowerCase().trim();
    
    // Check if it's already an Ethereum address
    if (normalizedName.match(/^0x[a-fA-F0-9]{40}$/)) {
      return normalizedName;
    }

    // If it's a .base.eth name, resolve using Base
    if (normalizedName.endsWith('.base.eth')) {
      return await resolveBasenameOnBase(normalizedName);
    }

    // If it's a .eth name (ENS), resolve on mainnet
    if (normalizedName.endsWith('.eth')) {
      return await resolveENSName(normalizedName);
    }

    // If no extension, try adding .base.eth
    const withExtension = `${normalizedName}.base.eth`;
    return await resolveBasenameOnBase(withExtension);
  } catch (error) {
    console.error('Error resolving basename:', error);
    return null;
  }
}

/**
 * Resolve basename using server-side API (bypasses CORS)
 */
async function resolveBasenameOnBase(name: string): Promise<string | null> {
  try {
    console.log('🔍 Resolving basename via server API:', name);
    
    const response = await fetch('/api/resolve-basename', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name: name.replace('.base.eth', '') }),
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
    console.error('Server-side resolution error:', error);
  }

  return null;
}


/**
 * Resolve ENS name using server-side API
 */
async function resolveENSName(name: string): Promise<string | null> {
  try {
    console.log('🔍 Resolving ENS via server API:', name);
    
    const response = await fetch('/api/resolve-basename', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
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
    console.error('Server-side ENS resolution error:', error);
  }

  return null;
}

/**
 * Validate if a string is a valid Ethereum address
 */
export function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Format address for display
 */
export function formatAddress(address: string): string {
  if (!isValidAddress(address)) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

/**
 * Resolve with caching
 */
const cache = new Map<string, { address: string | null; timestamp: number }>();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export async function resolveBasenameWithCache(name: string): Promise<string | null> {
  const cached = cache.get(name);
  const now = Date.now();

  if (cached && (now - cached.timestamp) < CACHE_TTL) {
    return cached.address;
  }

  const address = await resolveBasename(name);
  cache.set(name, { address, timestamp: now });

  return address;
}

