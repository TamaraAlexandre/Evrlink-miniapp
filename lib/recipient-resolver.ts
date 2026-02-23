/**
 * Universal Recipient Resolver
 * Resolves basename, ENS, Farcaster, or address to Ethereum address
 */

import { resolveBasenameWithCache, isValidAddress, isBasenameInput, isValidBaseName } from './basename-resolver';
import { resolveFarcasterUsername, isFarcasterUsername } from './farcaster-resolver';

export interface RecipientResolutionResult {
  success: boolean;
  address: string | null;
  originalInput: string;
  resolvedFrom: 'address' | 'basename' | 'ens' | 'farcaster' | null;
  error?: string;
}

/**
 * Resolve any recipient identifier to an Ethereum address
 */
export async function resolveRecipient(input: string): Promise<RecipientResolutionResult> {
  const trimmedInput = input.trim();

  if (!trimmedInput) {
    return {
      success: false,
      address: null,
      originalInput: input,
      resolvedFrom: null,
      error: 'Input is required',
    };
  }

  // 1. Check if it's already a valid Ethereum address
  if (isValidAddress(trimmedInput)) {
    return {
      success: true,
      address: trimmedInput,
      originalInput: input,
      resolvedFrom: 'address',
    };
  }

  // 2. Check if it's a basename input (prioritize basename resolution)
  if (isBasenameInput(trimmedInput)) {
    try {
      // Normalize basename input
      const normalizedBasename = trimmedInput.toLowerCase().trim();
      const basenameToResolve = normalizedBasename.endsWith('.base.eth') 
        ? normalizedBasename 
        : `${normalizedBasename}.base.eth`;
      
      // Validate format before attempting resolution
      if (isValidBaseName(basenameToResolve)) {
        console.log(`🔍 Resolving basename: ${basenameToResolve}`);
        const address = await resolveBasenameWithCache(basenameToResolve);
        if (address) {
          console.log(`✅ Resolved basename ${basenameToResolve} to ${address}`);
          return {
            success: true,
            address,
            originalInput: input,
            resolvedFrom: 'basename',
          };
        } else {
          return {
            success: false,
            address: null,
            originalInput: input,
            resolvedFrom: 'basename',
            error: `Basename "${basenameToResolve}" is not registered or has no address record`,
          };
        }
      }
    } catch (error) {
      console.error('Basename resolution error:', error);
      return {
        success: false,
        address: null,
        originalInput: input,
        resolvedFrom: 'basename',
        error: error instanceof Error ? error.message : 'Failed to resolve basename',
      };
    }
  }

  // 3. Check if it looks like a Farcaster username
  if (isFarcasterUsername(trimmedInput)) {
    try {
      const address = await resolveFarcasterUsername(trimmedInput);
      if (address) {
        return {
          success: true,
          address,
          originalInput: input,
          resolvedFrom: 'farcaster',
        };
      }
    } catch (error) {
      console.error('Farcaster resolution failed, trying ENS:', error);
    }
  }

  // 4. Try as ENS (only if it ends with .eth and is NOT .base.eth)
  if (trimmedInput.toLowerCase().endsWith('.eth') && !trimmedInput.toLowerCase().endsWith('.base.eth')) {
    try {
      const address = await resolveBasenameWithCache(trimmedInput);
      if (address) {
        return {
          success: true,
          address,
          originalInput: input,
          resolvedFrom: 'ens',
        };
      }
    } catch (error) {
      console.error('ENS resolution failed:', error);
    }
  }

  // 5. Resolution failed
  return {
    success: false,
    address: null,
    originalInput: input,
    resolvedFrom: null,
    error: 'Could not resolve to an Ethereum address',
  };
}

/**
 * Validate and resolve with user-friendly errors
 */
export async function validateAndResolveRecipient(
  input: string
): Promise<RecipientResolutionResult> {
  if (!input || !input.trim()) {
    return {
      success: false,
      address: null,
      originalInput: input,
      resolvedFrom: null,
      error: 'Please enter a recipient',
    };
  }

  const result = await resolveRecipient(input);

  if (!result.success) {
    if (input.includes('.')) {
      result.error = `Could not resolve "${input}". Make sure the name is registered.`;
    } else {
      result.error = `Could not find "${input}". Try adding .base.eth or check spelling.`;
    }
  }

  return result;
}

