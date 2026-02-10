# Evrlink v2 – Implementation Scratchpad

## Background and Motivation

Evrlink is a Farcaster miniapp for sending digital greeting cards as NFTs on Base. v1 is complete and working. We're building v2 with a fresh Next.js 16 / React 19 scaffold, implementing a new design system. **4-hour deadline to go live.**

**Strategy:** UI first (all screens), then wire up functions/APIs from v1.

---

## Key Challenges and Analysis

### Design System (from Home Page design)
- **Primary color:** Teal/Cyan (~#14B8A6 or #0891B2)
- **Card border accent:** Gold/Orange (~#F59E0B)
- **Background:** White (#FFFFFF) with subtle light gray sections
- **Text:** Dark (#111827 primary), Gray (#6B7280 secondary)
- **Font:** Clean sans-serif (Geist already set up in v2)
- **Border radius:** Generous (pills ~full, cards ~16px, buttons ~8-12px)
- **Bottom nav:** Fixed, white, 3 tabs (Home, Sent, Received)

### Home Page Components (from design)
1. **Header** – Evrlink logo (left), notification bell (right)
2. **Tagline** – "Send and relive moments with digital cards. 💕"
3. **Search Bar** – rounded input + teal "Search" button
4. **Categories** – "Categories" label + horizontal scrollable pill chips with emoji icons
5. **Card Feed** – vertical scroll of cards, each with:
   - Title: "{Card Name} by Everlink"
   - Tags: "#birthday #celebration" (gray)
   - Card image: rounded, thick gold/orange border, "tap to flip" overlay
6. **Bottom Navigation** – fixed: Home (active), Sent, Received

### v2 File Structure Plan
```
v2/
├── app/
│   ├── layout.tsx          (root layout + bottom nav)
│   ├── page.tsx            (home page)
│   ├── globals.css         (design tokens + base styles)
│   ├── sent/page.tsx       (sent tab - stub)
│   ├── received/page.tsx   (received tab - stub)
│   └── components/
│       ├── Header.tsx
│       ├── SearchBar.tsx
│       ├── CategoryPills.tsx
│       ├── CardFeed.tsx
│       ├── CardItem.tsx
│       └── BottomNav.tsx
├── lib/
│   └── greeting-cards-data.ts  (ported from v1)
└── public/
    └── images/              (copied from v1)
```

---

## High-level Task Breakdown

### Task 1: Project Setup & Assets
- [ ] Copy v1 card images + fonts + logo to v2/public
- [ ] Update globals.css with design tokens (colors, fonts)
- [ ] Update layout.tsx metadata (title, description)
- **Success criteria:** Assets accessible, design tokens in CSS

### Task 2: Greeting Cards Data
- [ ] Port `greeting-cards-data.ts` to v2/lib (UI-only, no API refs)
- [ ] Add category metadata (emoji/icon, display name) for pill chips
- **Success criteria:** Data importable, categories render correctly

### Task 3: Bottom Navigation
- [ ] Create BottomNav component (Home, Sent, Received)
- [ ] Wire with Next.js Link for routing
- [ ] Active state highlighting (teal for current tab)
- **Success criteria:** Fixed bottom bar, correct active state, navigation works

### Task 4: Header + Tagline
- [ ] Create Header component (logo + bell icon)
- [ ] Tagline text with emoji
- **Success criteria:** Matches design pixel-perfectly

### Task 5: Search Bar
- [ ] Rounded input + teal Search button
- [ ] Stub search (no API yet)
- **Success criteria:** Visual match, focus states

### Task 6: Category Pills
- [ ] Horizontal scrollable pill chips
- [ ] Emoji icons per category
- [ ] Selected state (teal bg, white text) vs unselected (white bg, border, dark text)
- [ ] Filtering logic (client-side: filter card feed by category)
- **Success criteria:** Scrollable, selection works, filters cards

### Task 7: Card Feed + Card Item
- [ ] Vertical scrolling feed of cards
- [ ] Each card: title + byline, tags, large image with gold border + rounded corners
- [ ] "tap to flip" overlay text on card image
- [ ] Proper spacing and peek of next card
- **Success criteria:** Cards render with correct styling, scroll feed works

### Task 8: Compose Home Page
- [ ] Wire all components into page.tsx
- [ ] Test full layout with proper spacing
- [ ] Bottom nav padding (content not hidden behind fixed nav)
- **Success criteria:** Home page matches design, scrolls correctly, categories filter

---

## Project Status Board

- [x] Task 1: Project Setup & Assets (copied images/fonts, set up design tokens in globals.css)
- [x] Task 2: Greeting Cards Data (ported all categories with emoji metadata)
- [x] Task 3: Bottom Navigation (Home/Sent/Received with active state)
- [x] Task 4: Header + Tagline (logo + bell + tagline with emoji)
- [x] Task 5: Search Bar (input + teal button, search filtering works)
- [x] Task 6: Category Pills (horizontal scrollable, selected=teal, filters cards)
- [x] Task 7: Card Feed + Card Item (full-width images, gold border, tap to flip overlay)
- [x] Task 8: Compose Home Page (all components wired, natural page scrolling, pb-20 for nav)

- [x] Task 9: Generate a Meep page - route, card back preview, message input, mint button, similar cards
- [x] Task 10: Mint modal, success modal, error modal popups on Generate page

**Home Page v2 UI is COMPLETE.**
**Generate a Meep page with all 3 modal states is COMPLETE.**
**Awaiting user review and next design screens.**

---

## Executor's Feedback or Assistance Requests

- All 10 tasks done. Dev server running on http://localhost:3001.
- Modal flow: Mint button → Mint Card modal → enter recipient → Mint → Success modal (or Error modal)
- Error modal "Try Again" goes back to Mint modal with recipient preserved
- Success modal "Back To Home" navigates to /
- All 3 modal designs match provided UI screenshots
- Minting logic is currently simulated (defaults to success). Ready to wire up real contract calls when APIs are implemented.

---

## Lessons

- v2 uses Tailwind v4 with CSS-based config (@theme inline in globals.css), no tailwind.config.ts
- v1 files are in /v1/ folder (moved from root)
- Next.js 16 + React 19 in v2
- Card images are in v1/public/images/categories/
- Design uses thick gold/orange border on card images (not from v1 styling)
- Bottom nav is a new v2 addition (v1 didn't have tab navigation)
- Tailwind v4 oxide binary may need explicit install: `npm install @tailwindcss/oxide-darwin-arm64@version --cache /tmp/npm-cache-evrlink` (npm cache permission issue workaround)
- Use native `<img>` instead of `next/image` with `fill` for simpler full-width card images (avoids sizing issues)
- For page scrolling, use `pb-20` padding at bottom instead of flex-1 overflow-y-auto (natural body scroll works better on mobile)
