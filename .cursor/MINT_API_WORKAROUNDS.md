# 🔧 Mint API Workaround Options

## 🎯 Problem
External mint service at `http://34.132.124.108:8787/mint` is not reachable (connection timeout).

---

## 💡 Workaround Options

### Option 1: **Mock/Stub Service for Development** ⭐ Recommended for Testing

**What**: Create a local mock service that simulates the external mint API.

**Implementation**:
- Create a simple Express/Node server that mimics the external API
- Returns mock transaction hash and token ID
- No actual blockchain interaction

**Pros**:
- ✅ Allows frontend development to continue
- ✅ No external dependencies
- ✅ Fast and reliable
- ✅ Easy to test different scenarios

**Cons**:
- ❌ No real NFTs minted
- ❌ Only for development/testing

**Code Changes Needed**:
```typescript
// Add environment variable: MOCK_MINT=true
if (process.env.MOCK_MINT === 'true') {
  // Return mock response
  return NextResponse.json({
    success: true,
    transactionHash: `0x${Math.random().toString(16).substring(2, 66)}`,
    tokenId: Math.floor(Math.random() * 10000).toString(),
    mintPrice: "20000000000000000",
    recipient: recipient,
    basename,
  });
}
```

---

### Option 2: **Retry Logic with Exponential Backoff**

**What**: Automatically retry failed connections with increasing delays.

**Implementation**:
- Retry up to 3 times
- Exponential backoff: 2s, 4s, 8s
- Only retry on connection errors (not validation errors)

**Pros**:
- ✅ Handles temporary network issues
- ✅ No code changes to external service needed
- ✅ Better user experience

**Cons**:
- ❌ Still fails if service is permanently down
- ❌ Longer wait times for users

**Code Changes Needed**:
```typescript
async function fetchWithRetry(url, options, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
    }
  }
}
```

---

### Option 3: **Health Check Before Attempting**

**What**: Check if external service is available before attempting mint.

**Implementation**:
- Add `/health` endpoint check
- If service is down, return helpful error immediately
- Don't waste time on timeout

**Pros**:
- ✅ Faster failure (no 30s timeout)
- ✅ Better error messages
- ✅ Can show service status in UI

**Cons**:
- ❌ Requires external service to have health endpoint
- ❌ Still doesn't solve the core problem

**Code Changes Needed**:
```typescript
// Check health first
const healthCheck = await fetch(`${mintApiUrl.replace('/mint', '/health')}`, {
  signal: AbortSignal.timeout(5000)
});

if (!healthCheck.ok) {
  throw new Error("Mint service is currently unavailable. Please try again later.");
}
```

---

### Option 4: **Direct Blockchain Interaction** ⚠️ Less Secure

**What**: Mint NFTs directly from Next.js API using viem/wagmi.

**Implementation**:
- Use viem to interact with NFT contract directly
- Store private key in environment variable (server-side only)
- Call contract.mint() directly

**Pros**:
- ✅ No external service dependency
- ✅ Full control
- ✅ Faster (no network hop)

**Cons**:
- ⚠️ Private key in Next.js (less secure than separate service)
- ⚠️ Next.js server must pay for all mints
- ⚠️ Requires contract ABI and deployment
- ⚠️ More complex error handling

**Code Changes Needed**:
```typescript
import { createWalletClient, http } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { base } from 'viem/chains';

const account = privateKeyToAccount(process.env.MINT_PRIVATE_KEY as `0x${string}`);
const client = createWalletClient({ account, chain: base, transport: http() });

// Call contract directly
const hash = await client.writeContract({
  address: contractAddress,
  abi: [...], // NFT contract ABI
  functionName: 'mint',
  args: [recipient, tokenURI],
});
```

---

### Option 5: **Queue System (Async Processing)**

**What**: Queue mint requests and process them when service is available.

**Implementation**:
- Store requests in database/Redis
- Background worker processes queue
- Return immediately with "pending" status
- Poll for completion

**Pros**:
- ✅ Handles service downtime gracefully
- ✅ Better user experience (no waiting)
- ✅ Can batch process requests

**Cons**:
- ❌ More complex architecture
- ❌ Requires database/queue system
- ❌ Users don't get immediate confirmation

**Code Changes Needed**:
- Add database (PostgreSQL/Redis)
- Add queue system (Bull/BullMQ)
- Add background worker
- Add polling endpoint

---

### Option 6: **Fallback to Alternative Service**

**What**: Try primary service, fallback to alternative if it fails.

**Implementation**:
- Try primary service first
- If fails, try backup service
- Or use local mock as fallback

**Pros**:
- ✅ High availability
- ✅ Better reliability

**Cons**:
- ❌ Requires multiple services
- ❌ More complex configuration

**Code Changes Needed**:
```typescript
const services = [
  process.env.MINT_API_URL,
  process.env.MINT_API_URL_BACKUP,
  process.env.MINT_API_URL_LOCAL,
];

for (const serviceUrl of services) {
  try {
    const response = await fetch(serviceUrl, options);
    if (response.ok) return response;
  } catch (error) {
    continue; // Try next service
  }
}
```

---

### Option 7: **Local Development Service**

**What**: Run a local version of the mint service for development.

**Implementation**:
- Create simple Node.js/Express server
- Mimics external API structure
- Can use real blockchain or mock

**Pros**:
- ✅ Full control
- ✅ Can test real blockchain interaction
- ✅ No external dependencies

**Cons**:
- ❌ Requires setting up local service
- ❌ Need to manage private keys locally

---

## 🎯 Recommended Approach

### For Development/Testing: **Option 1 (Mock Service)**
- Quick to implement
- Allows development to continue
- No external dependencies

### For Production: **Option 2 (Retry Logic) + Option 3 (Health Check)**
- Handles temporary outages
- Better user experience
- Still uses external service (secure)

### If External Service Permanently Unavailable: **Option 4 (Direct Interaction)**
- Last resort
- Requires security review
- More complex but fully functional

---

## 📋 Implementation Plan (Option 1 - Mock Service)

### Step 1: Add Mock Mode
```typescript
// app/api/mint/route.ts
const MOCK_MINT = process.env.MOCK_MINT === 'true';

if (MOCK_MINT) {
  // Return mock response
  return mockMintResponse(recipient, basename);
}
```

### Step 2: Create Mock Function
```typescript
function mockMintResponse(recipient: string, basename: string) {
  return NextResponse.json({
    success: true,
    transactionHash: `0x${Array.from({length: 64}, () => 
      Math.floor(Math.random() * 16).toString(16)
    ).join('')}`,
    tokenId: Math.floor(Math.random() * 10000).toString(),
    mintPrice: "20000000000000000",
    recipient,
    basename,
  });
}
```

### Step 3: Update .env.local
```bash
MOCK_MINT=true  # Enable mock mode
```

### Step 4: Add UI Indicator
```typescript
// Show "MOCK MODE" badge in development
{process.env.NODE_ENV === 'development' && MOCK_MINT && (
  <div className="mock-badge">MOCK MODE - No real NFTs minted</div>
)}
```

---

## 🔍 Which Option Should We Use?

**Tell me:**
1. Is this for development or production?
2. Do you have access to fix the external service?
3. Do you want real NFTs minted or just testing?
4. Are you okay with private keys in Next.js (Option 4)?

Based on your answers, I'll implement the best solution! 🚀

