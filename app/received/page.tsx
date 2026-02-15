"use client";

import Header from "../components/Header";
import TransactionCardItem from "../components/TransactionCardItem";
import BottomNav from "../components/BottomNav";
import { useAccount } from "wagmi";
import { useReceivedCards } from "@/lib/use-nft-activity";

function shortAddress(addr: string | undefined | null): string {
  if (addr == null || typeof addr !== "string" || addr.length < 10)
    return addr ?? "—";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export default function ReceivedPage() {
  const {
    data: receivedCards,
    isLoading,
    error,
    isConfigured,
  } = useReceivedCards();
  const { address: connectedAddress } = useAccount();

  const handleShare = (cardId: string) => {
    if (navigator.share) {
      navigator.share({
        title: "Evrlink Greeting Card",
        text: "Check out this greeting card I received on Evrlink!",
      });
    }
    console.log("Share received card:", cardId);
  };

  return (
    <div className="bg-white max-w-lg mx-auto pb-20">
      <Header />

      <div className="px-4 pb-2">
        <h1 className="text-lg font-semibold text-foreground leading-snug">
          Cards sent to you to relive special
          <br />
          moments. <span className="inline-block">💖</span>
        </h1>
      </div>

      <div className="mx-4 border-t border-border-light" />

      {!isConfigured && (
        <div className="px-4 py-6 text-center text-sm text-text-secondary">
          Set{" "}
          <code className="bg-muted px-1 rounded">
            NEXT_PUBLIC_CONTRACT_ADDRESS
          </code>{" "}
          to your deployed GreetingCardNFT contract to see received cards.
        </div>
      )}

      {isConfigured && error && (
        <div className="px-4 py-6 text-center text-sm text-red-600">
          Could not load received cards. Check that the contract address is
          correct and the contract is deployed.
        </div>
      )}

      {isConfigured && !error && isLoading && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-4xl mb-4">📬</div>
          <p className="text-sm text-text-secondary">
            Loading received cards…
          </p>
        </div>
      )}

      {isConfigured && !error && !isLoading && receivedCards.length > 0 && (
        <div className="divide-y divide-border-light">
          {receivedCards.map((card) => (
            <TransactionCardItem
              key={card.id}
              headerContent={
                <>
                  {card.cardTitle} from{" "}
                  <span className="font-semibold text-primary">
                    {shortAddress(card.senderAddress)}
                  </span>
                </>
              }
              tags={card.tags}
              cardImage={card.cardImage}
              onShare={() => handleShare(card.id)}
            />
          ))}
        </div>
      )}

      {isConfigured && !error && !isLoading && receivedCards.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <div className="text-4xl mb-4">📬</div>
          <h2 className="text-lg font-semibold text-foreground mb-1">
            {connectedAddress
              ? "No received cards yet"
              : "Connect your wallet"}
          </h2>
          <p className="text-sm text-text-secondary text-center">
            {connectedAddress
              ? "Cards you've received will appear here."
              : "Connect your wallet to see cards sent to you."}
          </p>
        </div>
      )}

      <BottomNav />
    </div>
  );
}
