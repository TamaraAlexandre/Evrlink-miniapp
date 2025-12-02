/**
 * Universal Recipient Resolver
 * Resolves basename, ENS, Farcaster, or address to Ethereum address
 */

import { resolveBasenameWithCache, isValidAddress } from './basename-resolver';
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

  // 2. Check if it looks like a Farcaster username
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
      console.error('Farcaster resolution failed, trying basename:', error);
    }
  }

  // 3. Try as basename/ENS
  try {
    const address = await resolveBasenameWithCache(trimmedInput);
    if (address) {
      const resolvedFrom = trimmedInput.includes('.eth') 
        ? trimmedInput.includes('.base.eth') ? 'basename' : 'ens'
        : 'basename';
      
      return {
        success: true,
        address,
        originalInput: input,
        resolvedFrom,
      };
    }
  } catch (error) {
    console.error('Basename/ENS resolution failed:', error);
  }

  // 4. Resolution failed
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

