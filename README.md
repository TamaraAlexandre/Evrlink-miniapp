# Evrlink - Greeting Card Miniapp

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-onchain --mini`](), configured with:

- [MiniKit](https://docs.base.org/builderkits/minikit/overview)
- [OnchainKit](https://www.base.org/builders/onchainkit)
- [Tailwind CSS](https://tailwindcss.com)
- [Next.js](https://nextjs.org/docs)

## Project Overview

Evrlink is a Web3 greeting card miniapp built on Base using Coinbase's OnchainKit. Users can mint greeting cards and send them to basenames. The app features:

- **Multi-screen navigation**: Home, Birthday category, and Greeting Card Editor
- **IPFS integration**: Upload PNG assets to decentralized storage
- **Professional UI**: Modern design with teal color scheme and Inter typography
- **Responsive layout**: Optimized for miniapp environment

## Key Features Implemented

### 1. Screen Navigation System
- **Home Screen**: Categories grid, "Earn as a Creator" card, action buttons
- **Birthday Screen**: Category-specific greeting cards with horizontal tabs
- **Greeting Card Editor**: Full-featured card creation interface

### 2. UI Components

#### Action Buttons (Received/Sent)
- **Styling**: Teal theme with `bg-[rgba(0,178,199,0.08)]` background
- **Icons**: Custom SVG icons (gift box for Received, paper plane for Sent)
- **Typography**: Inter font, medium weight, 14px size
- **Layout**: Left-justified Received button, right-justified Sent button using `justify-between`

#### Earn as a Creator Card
- **Background**: Teal gradient `bg-gradient-to-b from-[#00FFFF] to-[rgba(255,255,255,0.75)]`
- **Typography**: Inter bold 24px for heading, Inter medium 14px for description
- **Layout**: Full width with left-justified content
- **Button**: Dark "Coming soon!" button with precise positioning

#### Greeting Card Component (`components/GreetingCard.tsx`)
- **Dimensions**: 350×315 card with layered paper effect
- **Features**: Rotated elements, drop shadows, decorative overlays
- **Props**: Configurable title, byline, tags, likes, CTA, and images
- **Styling**: Professional typography with Inter font family

### 3. IPFS Integration

#### IPFS Service (`lib/ipfs-service.ts`)
```typescript
class IPFSService {
  uploadPNG(file: File): Promise<IPFSUploadResult>
  uploadMultiplePNGs(files: File[]): Promise<IPFSUploadResult[]>
  getIPFSURL(hash: string): string
  isValidIPFSHash(hash: string): boolean
}
```

#### React Hook (`lib/hooks/use-ipfs-upload.ts`)
- **State management**: Upload progress, success/error states
- **File validation**: PNG format, 10MB max size
- **Progress tracking**: Simulated upload progress

#### File Upload Component (`components/FileUpload.tsx`)
- **Drag & drop**: Visual feedback for file selection
- **Validation**: File type and size checks
- **Progress display**: Upload progress indicator
- **Error handling**: User-friendly error messages

### 4. Typography & Styling

#### Font Integration
- **Inter font**: Added to `theme.css` with weights 400, 500, 700
- **Usage**: Applied to all text elements for consistency

#### Custom CSS Classes
```css
.evrlink-gradient {
  background: linear-gradient(135deg, #e0f2fe 0%, #ccfbf1 100%);
}

.evrlink-card {
  background: var(--app-card-bg);
  border: 1px solid var(--app-card-border);
  backdrop-filter: blur(8px);
}

.evrlink-shadow {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
```

### 5. Navigation System
- **State management**: `currentScreen` state for screen transitions
- **Screen components**: `BirthdayScreen`, `GreetingCardEditor`
- **Navigation flow**: Home → Birthday → Editor → Back navigation

## Getting Started

1. Install dependencies:
```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

2. Set up environment variables:

```bash
# IPFS Configuration
NEXT_PUBLIC_IPFS_GATEWAY=https://gateway.pinata.cloud/ipfs/
NEXT_PUBLIC_IPFS_UPLOAD_ENDPOINT=https://api.pinata.cloud/pinning/pinFileToIPFS

# Shared/OnchainKit variables
NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME=
NEXT_PUBLIC_URL=
NEXT_PUBLIC_ICON_URL=
NEXT_PUBLIC_ONCHAINKIT_API_KEY=

# Frame metadata
FARCASTER_HEADER=
FARCASTER_PAYLOAD=
FARCASTER_SIGNATURE=
NEXT_PUBLIC_APP_ICON=
NEXT_PUBLIC_APP_SUBTITLE=
NEXT_PUBLIC_APP_DESCRIPTION=
NEXT_PUBLIC_APP_SPLASH_IMAGE=
NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR=
NEXT_PUBLIC_APP_PRIMARY_CATEGORY=
NEXT_PUBLIC_APP_HERO_IMAGE=
NEXT_PUBLIC_APP_TAGLINE=
NEXT_PUBLIC_APP_OG_TITLE=
NEXT_PUBLIC_APP_OG_DESCRIPTION=
NEXT_PUBLIC_APP_OG_IMAGE=

# Redis config
REDIS_URL=
REDIS_TOKEN=
```

3. Start the development server:
```bash
npm run dev
```

## File Structure

```
app/
├── components/
│   ├── FileUpload.tsx          # IPFS file upload component
│   └── GreetingCard.tsx        # Reusable greeting card component
├── page.tsx                    # Main app with navigation and screens
├── providers.tsx               # OnchainKit configuration
├── theme.css                   # Custom styling and Inter font
└── globals.css                 # Global styles

lib/
├── hooks/
│   └── use-ipfs-upload.ts      # IPFS upload state management
├── ipfs-service.ts             # IPFS upload logic
├── notification-client.ts       # Notification utilities
└── redis.ts                    # Redis configuration

public/                         # Static assets
```

## IPFS Setup

See `IPFS_SETUP.md` for detailed IPFS configuration instructions.

## Customization

### Adding New Categories
1. Add category button to the grid in `page.tsx`
2. Create corresponding screen component
3. Add navigation logic to `currentScreen` state

### Modifying Card Styles
1. Update `GreetingCard.tsx` component
2. Adjust CSS variables in `theme.css`
3. Test responsive behavior

### Adding New Features
1. Create new components in `app/components/`
2. Add utility functions in `lib/`
3. Update navigation and state management

## Learn More

- [MiniKit Documentation](https://docs.base.org/builderkits/minikit/overview)
- [OnchainKit Documentation](https://docs.base.org/builderkits/onchainkit/getting-started)
- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [IPFS Documentation](https://docs.ipfs.io/)
