/**
 * Farcaster Username Resolution Service
 */

interface FarcasterUser {
  fid: number;
  username: string;
  custody_address: string;
  verified_addresses: {
    eth_addresses: string[];
  };
}

interface FarcasterAPIResponse {
  result: {
    user: FarcasterUser;
  };
}

/**
 * Resolve Farcaster username to Ethereum address
 */
export async function resolveFarcasterUsername(username: string): Promise<string | null> {
  try {
    const cleanUsername = username.replace('@', '').toLowerCase().trim();

    const response = await fetch(
      `https://api.warpcast.com/v2/user-by-username?username=${cleanUsername}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      console.error('Warpcast API error:', response.status);
      return null;
    }

    const data: FarcasterAPIResponse = await response.json();
    
    // Prefer verified addresses
    const verifiedAddresses = data.result.user.verified_addresses?.eth_addresses || [];
    if (verifiedAddresses.length > 0) {
      return verifiedAddresses[0];
    }

    // Fallback to custody address
    return data.result.user.custody_address || null;
  } catch (error) {
    console.error('Error resolving Farcaster username:', error);
    return null;
  }
}

/**
 * Check if input is a Farcaster username format
 */
export function isFarcasterUsername(input: string): boolean {
  const cleaned = input.replace('@', '');
  return /^[a-z0-9_-]+$/i.test(cleaned) && !cleaned.includes('.');
}

