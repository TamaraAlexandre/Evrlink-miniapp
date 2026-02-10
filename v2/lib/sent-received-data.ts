/**
 * Data types and mock data for Sent / Received cards.
 * This will eventually be replaced with on-chain queries.
 */

export interface SentCardData {
  id: string;
  recipientName: string; // e.g. "wisgee.eth"
  price: string; // e.g. "0.02eth"
  tags: string[];
  cardImage: string;
  /** ISO timestamp of when it was sent */
  sentAt: string;
}

export interface ReceivedCardData {
  id: string;
  cardTitle: string; // e.g. "Birthday Bling"
  senderName: string; // e.g. "wisgee.eth"
  tags: string[];
  cardImage: string;
  /** ISO timestamp of when it was received */
  receivedAt: string;
}

// ── Mock data (replace with real on-chain data later) ──────────────

export const mockSentCards: SentCardData[] = [
  {
    id: "sent-1",
    recipientName: "wisgee.eth",
    price: "0.02eth",
    tags: ["#birthday", "#celebration"],
    cardImage: "/images/categories/birthday/birthday2.png",
    sentAt: "2026-02-09T14:30:00Z",
  },
  {
    id: "sent-2",
    recipientName: "wisgee.eth",
    price: "0.02eth",
    tags: ["#birthday", "#celebration"],
    cardImage: "/images/categories/birthday/birthday1.png",
    sentAt: "2026-02-08T10:15:00Z",
  },
  {
    id: "sent-3",
    recipientName: "alice.base",
    price: "0.01eth",
    tags: ["#love", "#valentines"],
    cardImage: "/images/categories/love/love1.png",
    sentAt: "2026-02-07T09:00:00Z",
  },
  {
    id: "sent-4",
    recipientName: "0xABc...1234",
    price: "0.015eth",
    tags: ["#thankyou", "#gratitude"],
    cardImage: "/images/categories/thankyou/thankyou1.png",
    sentAt: "2026-02-06T16:45:00Z",
  },
];

export const mockReceivedCards: ReceivedCardData[] = [
  {
    id: "recv-1",
    cardTitle: "Birthday Bling",
    senderName: "wisgee.eth",
    tags: ["#birthday", "#celebration"],
    cardImage: "/images/categories/birthday/birthday2.png",
    receivedAt: "2026-02-09T14:30:00Z",
  },
  {
    id: "recv-2",
    cardTitle: "Birthday Bling",
    senderName: "wisgee.eth",
    tags: ["#birthday", "#celebration"],
    cardImage: "/images/categories/birthday/birthday1.png",
    receivedAt: "2026-02-08T10:15:00Z",
  },
  {
    id: "recv-3",
    cardTitle: "Love Note",
    senderName: "alice.base",
    tags: ["#love", "#valentines"],
    cardImage: "/images/categories/love/love1.png",
    receivedAt: "2026-02-07T09:00:00Z",
  },
  {
    id: "recv-4",
    cardTitle: "Thank You",
    senderName: "0xABc...1234",
    tags: ["#thankyou", "#gratitude"],
    cardImage: "/images/categories/thankyou/thankyou1.png",
    receivedAt: "2026-02-06T16:45:00Z",
  },
];
