/**
 * Test utility for basename resolution
 * Run this in browser console to debug resolution issues
 */

import { resolveBasename, resolveBasenameWithCache } from './basename-resolver';

export async function testBasenameResolution(name: string) {
  console.log('🧪 Testing basename resolution for:', name);
  console.log('─'.repeat(50));
  
  try {
    console.time('Resolution time');
    const address = await resolveBasename(name);
    console.timeEnd('Resolution time');
    
    if (address) {
      console.log('✅ SUCCESS!');
      console.log('Input:', name);
      console.log('Resolved to:', address);
      console.log('─'.repeat(50));
      return { success: true, address };
    } else {
      console.log('❌ FAILED - Could not resolve');
      console.log('Input:', name);
      console.log('─'.repeat(50));
      return { success: false, address: null };
    }
  } catch (error) {
    console.error('❌ ERROR during resolution:', error);
    console.log('─'.repeat(50));
    return { success: false, error };
  }
}

// Test multiple basenames
export async function testMultipleBasenames(names: string[]) {
  console.log('🧪 Testing multiple basenames...');
  console.log('═'.repeat(50));
  
  const results = [];
  
  for (const name of names) {
    const result = await testBasenameResolution(name);
    results.push({ name, ...result });
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1s between tests
  }
  
  console.log('📊 SUMMARY:');
  console.log('═'.repeat(50));
  results.forEach(r => {
    const status = r.success ? '✅' : '❌';
    console.log(`${status} ${r.name}: ${r.address || 'Failed'}`);
  });
  
  return results;
}

// Example usage in browser console:
// import { testBasenameResolution } from './lib/test-basename';
// testBasenameResolution('jesse.base.eth');

