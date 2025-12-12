# 🎯 User Wallet Mint Implementation Plan

## ✅ Contract Details Found

### Function: `mintGreetingCard`
- **Location**: Line 465 in ABI
- **Signature**: `mintGreetingCard(string uri, address recipient) payable returns (uint256)`
- **Parameters**:
  1. `uri` (string) - The IPFS token URI
  2. `recipient` (address) - Where to mint the NFT
- **Payable**: Yes (requires ETH payment)
- **Returns**: `uint256` - The token ID

### Mint Price
- **Constant**: `MINT_PRICE` (line 337-346)
- **UI Shows**: 0.0002 ETH
- **Note**: We can read this from contract or use hardcoded value

### Contract Address
- **Location**: `.env.local` as `CONTRACT_ADDRESS`
- **Need**: Make it public as `NEXT_PUBLIC_CONTRACT_ADDRESS` for frontend use

---

## 📋 Implementation Steps

### Step 1: Update Environment Variable
- Change `CONTRACT_ADDRESS` → `NEXT_PUBLIC_CONTRACT_ADDRESS` in `.env.local`
- This makes it accessible in the frontend

### Step 2: Import ABI and Wagmi Hooks
```typescript
import nftAbi from '@/lib/Abi.json';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
```

### Step 3: Replace API Call with Contract Interaction

**Current Code** (lines 2275-2293):
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

**New Code**:
```typescript
const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
  hash,
});

// In handleFinalSubmit:
writeContract({
  address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
  abi: nftAbi.abi,
  functionName: 'mintGreetingCard',
  args: [generatedMeepUrl, recipientResolution.address],
  value: parseEther('0.0002'), // Mint price
});
```

### Step 4: Handle Transaction States

**Loading States**:
- `isPending` - Transaction being sent
- `isConfirming` - Waiting for confirmation
- `isSuccess` - Transaction confirmed

**Success Handling**:
- Extract token ID from transaction receipt/logs
- Show success modal
- Display transaction hash

**Error Handling**:
- Handle user rejection
- Handle transaction failures
- Show appropriate error messages

### Step 5: Extract Token ID from Transaction

The contract emits a `GreetingCardMinted` event (line 241-263):
```solidity
event GreetingCardMinted(
  uint256 tokenId,
  address owner,
  string tokenURI
);
```

We can extract the token ID from the transaction receipt logs.

---

## 🔧 Code Changes Summary

### File: `app/page.tsx`

1. **Add Imports**:
```typescript
import nftAbi from '@/lib/Abi.json';
import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
```

2. **Add Hooks in Component**:
```typescript
const { writeContract, data: hash, isPending: isWritingContract, error: writeError } = useWriteContract();
const { isLoading: isConfirming, isSuccess, data: receipt } = useWaitForTransactionReceipt({
  hash,
});
```

3. **Replace handleFinalSubmit**:
- Remove `fetch("/api/mint")` call
- Add `writeContract()` call
- Handle transaction states
- Extract token ID from receipt

4. **Update Loading States**:
- Combine `isMinting`, `isWritingContract`, `isConfirming`
- Show appropriate loading messages

5. **Update Error Handling**:
- Handle `writeError` (user rejection, etc.)
- Handle transaction failures

### File: `.env.local`

```bash
# Change from:
CONTRACT_ADDRESS=0x...

# To:
NEXT_PUBLIC_CONTRACT_ADDRESS=0x...
```

---

## 🎨 User Experience Flow

1. User clicks "Send Gift"
2. Wallet popup appears → Shows transaction details
3. User reviews: 
   - Function: `mintGreetingCard`
   - Recipient: `0x1234...`
   - Amount: `0.0002 ETH`
4. User signs transaction
5. Transaction submitted → "Transaction pending..."
6. Waiting for confirmation → "Confirming transaction..."
7. Transaction confirmed → Success modal with:
   - Transaction hash (link to BaseScan)
   - Token ID
   - Recipient address

---

## ⚠️ Important Considerations

1. **Mint Price**: 
   - Currently hardcoded as `0.0002 ETH`
   - Could read from contract's `MINT_PRICE` constant for accuracy

2. **Token ID Extraction**:
   - Parse `GreetingCardMinted` event from transaction logs
   - Or read from contract after mint

3. **Error Messages**:
   - User rejection: "Transaction rejected"
   - Insufficient funds: "Insufficient balance"
   - Transaction failed: "Transaction failed"

4. **Network**:
   - Must be on Base network (already configured in providers)

---

## 🚀 Ready to Implement

**Next Steps**:
1. ✅ ABI found - `mintGreetingCard(string uri, address recipient)`
2. ✅ Contract address location known
3. ✅ Wagmi hooks ready to use
4. ⏳ Update environment variable
5. ⏳ Replace API call with contract interaction
6. ⏳ Handle transaction states
7. ⏳ Extract token ID from receipt

**Ready to implement when you approve!** 🎉

