# 🎯 User Wallet Mint Implementation Plan

## ✅ New Approach

**Instead of**: External service with backend wallet paying
**Now**: User's connected wallet signs and pays

### Benefits:
- ✅ No private keys needed
- ✅ No external service dependency
- ✅ User controls their own transactions
- ✅ More secure (no backend wallet)
- ✅ Works immediately (no service setup)

---

## 📋 Implementation Plan

### Step 1: Get NFT Contract ABI

We need the NFT contract's ABI to call the `mint` function. The contract should have a function like:

```solidity
function mint(address to, string memory tokenURI) public payable returns (uint256)
```

**Options:**
1. If you have the contract address, we can fetch ABI from BaseScan
2. If you have the contract code, we can extract the ABI
3. We can create a minimal ABI with just the mint function

### Step 2: Update Frontend to Use Direct Contract Call

**Replace**: `fetch("/api/mint")` 
**With**: `useWriteContract` from wagmi

**Changes needed:**
- Import `useWriteContract`, `useWaitForTransactionReceipt` from wagmi
- Get contract address from environment variable
- Call contract's `mint` function directly
- User signs transaction in wallet
- Wait for transaction confirmation

### Step 3: Update Environment Variables

**Remove** (no longer needed):
- `MINT_API_URL`
- `MINT_API_KEY`

**Keep/Add**:
- `NEXT_PUBLIC_CONTRACT_ADDRESS` - NFT contract address (public, used in frontend)

### Step 4: Optional - Keep API Route for Backwards Compatibility

We can keep `/api/mint` but make it optional, or remove it entirely.

---

## 🔧 Code Changes

### Frontend Changes (`app/page.tsx`)

**Before** (current):
```typescript
const mintResponse = await fetch("/api/mint", {
  method: "POST",
  body: JSON.stringify({
    tokenURI: generatedMeepUrl,
    recipient: recipientResolution.address,
    basename: recipientInput,
    sender: walletAddress,
  }),
});
```

**After** (new):
```typescript
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';

// In component:
const { writeContract, data: hash, isPending, error } = useWriteContract();
const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({
  hash,
});

// In handleFinalSubmit:
writeContract({
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  abi: NFT_ABI,
  functionName: 'mint',
  args: [recipientResolution.address, generatedMeepUrl],
  value: parseEther('0.0002'), // Mint price
});
```

---

## 📝 Required Information

To implement this, I need:

1. **NFT Contract Address**: What's the deployed contract address?
2. **Contract ABI**: Do you have the ABI, or should I create a minimal one?
3. **Mint Function Signature**: 
   - Function name: `mint`?
   - Parameters: `(address to, string tokenURI)`?
   - Payable: Yes (0.0002 ETH)?
   - Returns: `uint256 tokenId`?

4. **Mint Price**: Is it 0.0002 ETH (as shown in UI)?

---

## 🎨 User Experience Flow

```
1. User creates card → Uploads to IPFS
2. User enters recipient → Resolves to address
3. User clicks "Send Gift"
4. Wallet popup appears → User reviews transaction
5. User signs transaction → Pays 0.0002 ETH + gas
6. Transaction submitted → Waiting for confirmation
7. Transaction confirmed → Success modal shows
8. NFT minted to recipient address ✅
```

---

## 🔐 Security Benefits

- ✅ No private keys in codebase
- ✅ User controls their own funds
- ✅ No backend service to maintain
- ✅ Direct blockchain interaction
- ✅ Transparent transaction flow

---

## ⚠️ Considerations

1. **User Pays**: Users will pay mint price + gas (not free anymore)
2. **Transaction Rejection**: Users can reject the transaction
3. **Gas Costs**: Users need ETH in their wallet for gas
4. **Network**: Must be on Base network (already configured)

---

## 🚀 Next Steps

**Please provide:**
1. NFT contract address
2. Contract ABI (or I can create minimal one)
3. Mint function details (name, parameters, price)

Once I have this, I'll implement the direct wallet minting! 🎉

