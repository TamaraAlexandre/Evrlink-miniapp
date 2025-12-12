# 🎁 How the Mint API Works

## 📐 Architecture Overview

The mint API is a **proxy/relay service** that sits between your Next.js frontend and an external NFT minting service. Here's the architecture:

```
┌─────────────────┐
│   Frontend      │
│  (Next.js App)  │
│                 │
│  User clicks    │
│  "Send Gift"    │
└────────┬────────┘
         │
         │ POST /api/mint
         │ { tokenURI, recipient, basename, sender }
         ▼
┌─────────────────┐
│  Next.js API    │
│  /api/mint      │
│  (route.ts)     │
│                 │
│  • Validates    │
│  • Forwards     │
│  • Returns      │
└────────┬────────┘
         │
         │ POST to external service
         │ Headers: x-api-key
         │ Body: { tokenURI, recipient, contractAddress }
         ▼
┌─────────────────┐
│ External Mint   │
│ Service         │
│ (evrlink-nft-   │
│  service)       │
│                 │
│  • Signs tx     │
│  • Pays gas     │
│  • Mints NFT    │
└────────┬────────┘
         │
         │ Returns: { transactionHash, tokenId, mintPrice }
         ▼
┌─────────────────┐
│  Blockchain     │
│  (Base L2)      │
│                 │
│  NFT minted to  │
│  recipient      │
└─────────────────┘
```

---

## 🔄 Complete Flow Step-by-Step

### Step 1: User Creates & Uploads Card
```typescript
// Frontend: app/page.tsx
1. User writes message on greeting card
2. Clicks "Generate Meep - 0.02 ETH"
3. Image composed → Uploaded to IPFS
4. Gets IPFS URL: "https://gateway.pinata.cloud/ipfs/Qm..."
```

### Step 2: User Enters Recipient
```typescript
// Frontend: app/page.tsx (handleFinalSubmit)
5. User enters recipient: "alice.base.eth"
6. System resolves to: "0x1234...5678"
7. User clicks "🎁 Send Greeting Card Gift"
```

### Step 3: Frontend Calls Next.js API
```typescript
// Frontend: app/page.tsx:2275
const mintResponse = await fetch("/api/mint", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    tokenURI: "https://gateway.pinata.cloud/ipfs/Qm...",  // IPFS URL
    recipient: "0x1234...5678",                          // Resolved address
    basename: "alice.base.eth",                          // Original input
    sender: "0xabcd...efgh",                             // Sender's wallet
  }),
});
```

### Step 4: Next.js API Validates & Forwards
```typescript
// Backend: app/api/mint/route.ts

// 4a. Validate Inputs
✅ Check tokenURI exists
✅ Check recipient exists
✅ Check env vars (MINT_API_URL, MINT_API_KEY, CONTRACT_ADDRESS)

// 4b. Forward to External Service
const mintResponse = await fetch(MINT_API_URL, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": MINT_API_KEY,  // Authentication
  },
  body: JSON.stringify({
    tokenURI: "...",           // IPFS URL
    recipient: "0x1234...",    // Where NFT goes
    contractAddress: "0x...",  // NFT contract
  }),
});
```

### Step 5: External Service Mints NFT
```typescript
// External Service (evrlink-nft-service)
// This is a SEPARATE service running elsewhere

1. Receives request with tokenURI, recipient, contractAddress
2. Uses backend wallet (PRIVATE_KEY) to sign transaction
3. Calls NFT contract's mint() function
4. Pays mint price (0.0002 ETH) + gas fees
5. NFT is minted to recipient address
6. Returns: {
     transactionHash: "0x...",
     tokenId: "123",
     mintPrice: "20000000000000000"
   }
```

### Step 6: Response Flows Back
```typescript
// Next.js API receives response
✅ Validate transactionHash exists
✅ Return to frontend:
{
  success: true,
  transactionHash: "0x...",
  tokenId: "123",
  mintPrice: "20000000000000000",
  recipient: "0x1234...",
  basename: "alice.base.eth"
}

// Frontend shows success modal
✅ Display transaction hash
✅ Show token ID
✅ User can view on BaseScan
```

---

## 🔑 Key Components

### 1. **Next.js API Route** (`/app/api/mint/route.ts`)
**Role**: Proxy/Relay Service

**What it does**:
- ✅ Validates incoming requests
- ✅ Checks environment variables
- ✅ Forwards to external mint service
- ✅ Handles errors gracefully
- ✅ Returns formatted response

**What it does NOT do**:
- ❌ Does NOT sign transactions
- ❌ Does NOT pay for mints
- ❌ Does NOT interact with blockchain directly

### 2. **External Mint Service** (`evrlink-nft-service`)
**Role**: Blockchain Interaction Service

**What it does**:
- ✅ Signs transactions with backend wallet
- ✅ Pays mint price + gas fees
- ✅ Calls NFT contract's `mint()` function
- ✅ Returns transaction details

**Why separate?**
- 🔐 **Security**: Private keys never exposed to frontend
- 💰 **Payment**: Backend wallet pays (sponsored mints)
- 🛡️ **Control**: Can add rate limiting, validation, etc.

### 3. **Environment Variables**
```bash
MINT_API_URL=http://34.132.124.108:8787/mint
MINT_API_KEY=cfa9f675-934f-4077-8cec-df74d59a38d4
CONTRACT_ADDRESS=0x...  # NFT contract address
```

---

## 💰 Payment Model

### Who Pays What?

| Party | Action | Cost |
|-------|--------|------|
| **Sender** | Creates card, connects wallet | $0 (free) |
| **Recipient** | Receives NFT | $0 (free) |
| **Backend Wallet** | Signs tx, pays mint + gas | ~$0.63/gift |

### Cost Breakdown
```
Mint Price:  0.0002 ETH  (~$0.50)
Gas Fee:    ~0.00005 ETH (~$0.13)
─────────────────────────────────
Total:      ~0.00025 ETH (~$0.63)
```

**This is sponsored minting** - the backend wallet pays for everything, making it free for users!

---

## 🔐 Security Model

### Why This Architecture?

1. **Private Keys Never Exposed**
   - Backend wallet's PRIVATE_KEY stays on external service
   - Frontend never sees or handles private keys

2. **API Key Authentication**
   - External service requires `x-api-key` header
   - Prevents unauthorized minting

3. **Server-Side Validation**
   - Next.js API validates inputs before forwarding
   - Prevents invalid requests from reaching blockchain

4. **Environment Variables**
   - All sensitive data in `.env.local` (not in git)
   - API keys only accessible server-side

---

## 📊 Data Flow

### Request Flow
```
Frontend Request:
{
  tokenURI: "https://gateway.pinata.cloud/ipfs/Qm...",
  recipient: "0x1234...5678",
  basename: "alice.base.eth",
  sender: "0xabcd...efgh"
}
         ↓
Next.js API validates & transforms:
{
  tokenURI: "https://gateway.pinata.cloud/ipfs/Qm...",
  recipient: "0x1234...5678",
  contractAddress: "0x..."  // Added from env
}
         ↓
External Service receives:
{
  tokenURI: "...",
  recipient: "0x1234...",
  contractAddress: "0x..."
}
         ↓
External Service mints NFT:
- Calls contract.mint(recipient, tokenURI)
- Pays 0.0002 ETH + gas
- Returns transaction hash
```

### Response Flow
```
External Service returns:
{
  transactionHash: "0xabc...",
  tokenId: "123",
  mintPrice: "20000000000000000"
}
         ↓
Next.js API formats:
{
  success: true,
  transactionHash: "0xabc...",
  tokenId: "123",
  mintPrice: "20000000000000000",
  recipient: "0x1234...",
  basename: "alice.base.eth"
}
         ↓
Frontend receives & displays:
✅ Success modal
✅ Transaction hash (clickable to BaseScan)
✅ Token ID
```

---

## 🐛 Current Issue

### Connection Timeout
```
Error: Connect Timeout Error
Address: 34.132.124.108:8787
Timeout: 10000ms
```

**Problem**: The external mint service at `http://34.132.124.108:8787/mint` is not reachable.

**Possible Causes**:
1. Service is not running
2. Wrong IP address or port
3. Firewall blocking connection
4. Service is down or moved

**Solution**: 
- Verify the external service is running
- Check if URL/IP has changed
- Test connectivity: `curl http://34.132.124.108:8787/mint`

---

## 🧪 Testing the API

### 1. Test Next.js API Directly
```bash
curl -X POST http://localhost:3000/api/mint \
  -H "Content-Type: application/json" \
  -d '{
    "tokenURI": "https://gateway.pinata.cloud/ipfs/QmTest",
    "recipient": "0x1234567890123456789012345678901234567890",
    "basename": "alice.base.eth",
    "sender": "0xabcdefabcdefabcdefabcdefabcdefabcdefabcd"
  }'
```

### 2. Test External Service Directly
```bash
curl -X POST http://34.132.124.108:8787/mint \
  -H "Content-Type: application/json" \
  -H "x-api-key: cfa9f675-934f-4077-8cec-df74d59a38d4" \
  -d '{
    "tokenURI": "https://gateway.pinata.cloud/ipfs/QmTest",
    "recipient": "0x1234567890123456789012345678901234567890",
    "contractAddress": "0x..."
  }'
```

---

## 📝 Summary

**The mint API is a proxy that:**
1. ✅ Receives mint requests from frontend
2. ✅ Validates and forwards to external service
3. ✅ External service handles blockchain interaction
4. ✅ Returns transaction details to frontend

**Key Benefits:**
- 🔐 Secure (no private keys in frontend)
- 💰 Free for users (backend pays)
- 🛡️ Controlled (can add validation/rate limiting)
- 🚀 Simple (frontend just calls one endpoint)

**Current Status:**
- ✅ Code is correct and well-structured
- ❌ External service is not reachable (connection timeout)
- 🔧 Need to verify external service is running

