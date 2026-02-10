# IPFS Setup for Evrlink

This guide explains how to set up IPFS for uploading PNG assets in your greeting card editor.

## Environment Variables

Add these to your `.env.local` file:

```bash
# IPFS Configuration
NEXT_PUBLIC_IPFS_GATEWAY=https://ipfs.io/ipfs/
NEXT_PUBLIC_IPFS_UPLOAD_ENDPOINT=https://ipfs.infura.io:5001/api/v0/add
```

## IPFS Providers

### Option 1: Infura IPFS (Recommended for development)
- Free tier available
- Reliable and fast
- Good documentation

### Option 2: Pinata
- Popular IPFS pinning service
- Free tier: 1GB storage
- API endpoint: `https://api.pinata.cloud/pinning/pinFileToIPFS`

### Option 3: Web3.Storage
- Free decentralized storage
- Built on IPFS and Filecoin
- API endpoint: `https://api.web3.storage/upload`

### Option 4: NFT.Storage
- Free IPFS storage for NFTs
- Built on IPFS and Filecoin
- API endpoint: `https://api.nft.storage/upload`

## Setup Steps

1. **Choose an IPFS provider** from the options above
2. **Sign up** for an account
3. **Get your API key** (if required)
4. **Update environment variables** with your chosen provider
5. **Test the upload** in the greeting card editor

## Usage

1. Open the greeting card editor
2. Click the "Upload" tool button
3. Drag and drop a PNG file or click to browse
4. The file will be uploaded to IPFS
5. The IPFS hash and URL will be displayed on the canvas

## File Requirements

- **Format**: PNG only
- **Size**: Maximum 10MB
- **Content**: Any PNG image suitable for greeting cards

## Security Notes

- Files are pinned to IPFS for persistence
- IPFS hashes are immutable and verifiable
- Consider adding authentication for production use
- Monitor storage usage if using paid services

## Troubleshooting

### Upload Fails
- Check your internet connection
- Verify the IPFS endpoint is correct
- Ensure the file is a valid PNG under 10MB
- Check browser console for error messages

### File Not Displaying
- Verify the IPFS gateway is accessible
- Check if the file was properly pinned
- Try refreshing the page

## Production Considerations

- Use a reliable IPFS provider with good uptime
- Implement rate limiting for uploads
- Add file validation and virus scanning
- Consider using multiple IPFS gateways for redundancy
- Monitor costs if using paid services
