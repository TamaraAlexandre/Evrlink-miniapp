# Environment Setup Guide

## Quick Reference: Environment Variables Needed

### ✅ Step 1: Create `.env.local` file

Copy and paste this into your `.env.local` file in the project root:

```bash
# ===================================
# REQUIRED: Pinata IPFS Credentials
# ===================================
PINATA_JWT=your_jwt_token_here
NEXT_PUBLIC_GATEWAY_URL=your-gateway-domain.mypinata.cloud

# ===================================
# REQUIRED: NFT Minting Configuration
# ===================================
MINT_API_URL=http://localhost:8787
MINT_API_KEY=your_mint_api_key_here
CONTRACT_ADDRESS=your_deployed_contract_address_here

# ===================================
# REQUIRED: OnchainKit Configuration
# ===================================
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=Evrlink
NEXT_PUBLIC_URL=https://www.evrlinkapp.com
NEXT_PUBLIC_ICON_URL=https://i.imgur.com/nhm1ph1.png
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key_here

# ===================================
# OPTIONAL: Redis for Notifications
# ===================================
REDIS_URL=your_upstash_redis_url_here
REDIS_TOKEN=your_upstash_redis_token_here
```

### ✅ Step 2: Get Pinata Credentials

1. **Sign up at Pinata**: [https://app.pinata.cloud/](https://app.pinata.cloud/)
2. **Create API Key**: Go to API Keys → New Key
3. **Copy credentials**: 
   - JWT Token → `PINATA_JWT`
   - Gateway Domain → `NEXT_PUBLIC_GATEWAY_URL`

📖 **Detailed guide**: See [PINATA_SETUP.md](./PINATA_SETUP.md)

### ✅ Step 3: Verify Setup

After adding your credentials:

```bash
# Restart the dev server
npm run dev
```

Watch the console for:
- ✅ **No warnings** = Credentials loaded successfully
- ⚠️ **Warning message** = Check your `.env.local` file

## What Was Updated

### 1. **IPFS Service** (`lib/ipfs-service.ts`)

**Before**: Basic IPFS with Infura (deprecated)
```typescript
// ❌ Old - Infura with Basic Auth
const auth = btoa(`${projectId}:${secret}`);
fetch(uploadEndpoint, {
  method: 'POST',
  headers: { 'Authorization': `Basic ${auth}` },
  body: formData,
});
```

**After**: Pinata SDK with JWT authentication
```typescript
// ✅ New - Pinata SDK v2
import { pinata } from "./pinata-config";

const result = await pinata.upload.file(file);
const url = `https://${gateway}/ipfs/${result.cid}`;
```

**Features Added**:
- ✅ Pinata SDK v2.5.1 integration
- ✅ Simple JWT authentication
- ✅ Dedicated Pinata gateway
- ✅ Automatic credential detection
- ✅ Console warnings if credentials missing
- ✅ Better error handling and logging

### 2. **Environment Configuration**

**Files Created**:
- 📄 `PINATA_SETUP.md` - Complete Pinata setup guide
- 📄 `ENV_SETUP_GUIDE.md` - This file
- 🔧 `lib/pinata-config.ts` - Pinata SDK configuration

**Files Updated**:
- 📝 `IPFS_SETUP.md` - Added reference to Pinata guide
- 🔧 `lib/ipfs-service.ts` - Migrated to Pinata SDK

## How Authentication Works

### Pinata IPFS Authentication

Pinata uses **JWT (JSON Web Token)** authentication - much simpler than Infura!

The service automatically:
1. Reads `PINATA_JWT` from environment variables
2. Initializes Pinata SDK with JWT
3. Uses SDK methods for uploads (no manual headers needed)
4. Constructs URLs with your dedicated gateway

### Security Notes

- ✅ JWT token is in `.env.local` (not committed to git)
- ✅ Using server-side environment variable `PINATA_JWT` (secure)
- ✅ Only gateway URL is public (`NEXT_PUBLIC_GATEWAY_URL`)
- ⚠️ Keep your JWT token secure - it's shown only once!
- ⚠️ Don't share `.env.local` file or expose JWT

## Testing the Setup

### 1. Start the App
```bash
npm run dev
```

### 2. Navigate to Greeting Card Editor
1. Select a greeting card category
2. Choose a card
3. Click "Choose Card"
4. Write a message
5. Click "Generate Meep - 0.02 ETH"

### 3. Watch the Console
```
Composing greeting card image...
Uploading to IPFS...
IPFS Upload successful: https://xyz.ipfs.dweb.link/QmAbc...
```

### 4. Check the Modal
After successful upload, you should see:
- ✅ Green success box with IPFS hash
- 📝 Input field for basename
- 🔵 "Submit Meep" button

## Troubleshooting

### "PINATA_JWT is not set" Warning

**Problem**: Environment variables not loaded

**Fix**:
```bash
# 1. Check .env.local exists in project root
ls -la .env.local

# 2. Verify variables are set
cat .env.local | grep PINATA

# 3. Restart dev server
npm run dev
```

### Upload Fails with "401 Unauthorized"

**Problem**: Invalid credentials

**Fix**:
1. Log in to [Pinata Dashboard](https://app.pinata.cloud/)
2. Go to API Keys → Create new key
3. Copy the JWT token
4. Update `.env.local` with `PINATA_JWT=...`
5. Restart server

### Upload Fails with "403 Forbidden"

**Problem**: Rate limits or billing issue

**Fix**:
1. Check your Pinata dashboard usage
2. Verify you haven't exceeded free tier limits (1GB storage, 100GB bandwidth)
3. Verify API key has upload permissions
4. Consider upgrading plan if needed

### Canvas/Image Composition Errors

**Problem**: CORS or image loading issues

**Fix**:
- Ensure greeting card images are accessible
- Check browser console for CORS errors
- Verify image paths in `greeting-cards-data.ts`

## Alternative IPFS Providers

Don't want to use Infura? You can use:

### Web3.Storage
- Free unlimited storage
- API: `https://api.web3.storage/upload`
- Auth: API token in `Authorization: Bearer` header

### NFT.Storage
- Free for NFT metadata
- API: `https://api.nft.storage/upload`
- Auth: API token in `Authorization: Bearer` header

To use alternatives, you'll need to modify the IPFS service accordingly.

## Cost Estimates (Pinata Free Tier)

**Limits**:
- 1 GB storage
- 100 GB bandwidth/month

**Greeting Card Usage**:
- Average card size: ~500 KB
- 1,000 cards = ~500 MB storage
- 10,000 views = ~5 GB bandwidth

**Recommendation**: Free tier is sufficient for development and initial launch.

## Next Steps

1. ✅ Set up Pinata credentials
2. ✅ Test greeting card generation
3. 🔲 Set up OnchainKit API key
4. 🔲 Configure Redis for notifications (optional)
5. 🔲 Deploy to production with environment variables

## Support Resources

- **Pinata Docs**: [https://docs.pinata.cloud/](https://docs.pinata.cloud/)
- **Pinata Next.js Guide**: [https://docs.pinata.cloud/frameworks/next-js](https://docs.pinata.cloud/frameworks/next-js)
- **IPFS Docs**: [https://docs.ipfs.tech/](https://docs.ipfs.tech/)
- **OnchainKit Docs**: [https://docs.base.org/builderkits/onchainkit](https://docs.base.org/builderkits/onchainkit)

