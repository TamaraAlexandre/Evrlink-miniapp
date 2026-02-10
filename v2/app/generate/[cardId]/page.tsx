"use client";

import { useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import PageHeader from "../../components/PageHeader";
import CardBackPreview from "../../components/CardBackPreview";
import SimilarCardItem from "../../components/SimilarCardItem";
import BottomNav from "../../components/BottomNav";
import MintModal from "../../components/MintModal";
import SuccessModal from "../../components/SuccessModal";
import ErrorModal from "../../components/ErrorModal";
import {
  greetingCardsData,
  type GreetingCardData,
} from "@/lib/greeting-cards-data";

const MAX_MESSAGE_LENGTH = 280;

type ModalState = "none" | "mint" | "success" | "error";

// Find a card across all categories by its ID
function findCardById(cardId: string): {
  card: GreetingCardData | null;
  categoryKey: string | null;
} {
  for (const [key, category] of Object.entries(greetingCardsData)) {
    const card = category.cards.find((c) => c.id === cardId);
    if (card) return { card, categoryKey: key };
  }
  return { card: null, categoryKey: null };
}

export default function GenerateMeepPage() {
  const params = useParams();
  const router = useRouter();
  const cardId = params.cardId as string;

  const [message, setMessage] = useState("");
  const [modalState, setModalState] = useState<ModalState>("none");
  const [recipientAddress, setRecipientAddress] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { card, categoryKey } = useMemo(() => findCardById(cardId), [cardId]);

  // Get similar cards from same category (excluding current card)
  const similarCards = useMemo(() => {
    if (!categoryKey) return [];
    return (
      greetingCardsData[categoryKey]?.cards.filter((c) => c.id !== cardId) || []
    );
  }, [categoryKey, cardId]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    if (value.length <= MAX_MESSAGE_LENGTH) {
      setMessage(value);
    }
  };

  const handleMint = () => {
    // Open the mint modal
    setModalState("mint");
  };

  const handleMintConfirm = (recipient: string, paymentMethod: "ETH" | "USDT") => {
    // Store recipient for success screen
    setRecipientAddress(recipient);

    // TODO: Wire up actual minting logic here
    // For now, simulate success after a brief delay
    console.log("Minting card:", cardId, "to:", recipient, "via:", paymentMethod, "message:", message);

    // Simulate minting — replace with real contract call later
    // On success:
    setModalState("success");

    // On error (example - uncomment to test):
    // setErrorMessage("Insufficient funds in wallet. Please add more ETH or USDT to continue.");
    // setModalState("error");
  };

  const handleRetry = () => {
    // Go back to mint modal to try again
    setModalState("mint");
  };

  const handleCloseModal = () => {
    setModalState("none");
  };

  const handleSimilarMint = (similarCard: GreetingCardData) => {
    router.push(`/generate/${similarCard.id}`);
  };

  if (!card) {
    return (
      <div className="bg-white max-w-lg mx-auto min-h-screen">
        <PageHeader title="Generate a Meep" />
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <p className="text-text-secondary text-sm">Card not found</p>
        </div>
      </div>
    );
  }

  const remainingChars = MAX_MESSAGE_LENGTH - message.length;

  return (
    <div className="bg-white max-w-lg mx-auto pb-20">
      {/* Header */}
      <PageHeader title="Generate a Meep" />

      {/* Card Back Preview */}
      <CardBackPreview message={message} maxLength={MAX_MESSAGE_LENGTH} />

      {/* Custom Message Section */}
      <div className="px-4 py-4">
        <h2 className="text-base font-semibold text-foreground mb-1">
          Custom Message
        </h2>
        <p className="text-sm text-text-secondary mb-3 leading-relaxed">
          Write a heartfelt message for the back of the card. Keep it on one
          line for the best visual effect.
        </p>

        {/* Textarea */}
        <textarea
          value={message}
          onChange={handleMessageChange}
          placeholder="Write your message here"
          maxLength={MAX_MESSAGE_LENGTH}
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-white text-sm text-foreground placeholder:text-text-tertiary outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 resize-none transition-colors"
        />

        {/* Character Counter */}
        <p className="text-xs text-text-tertiary mt-1.5">
          {remainingChars}/{MAX_MESSAGE_LENGTH} characters
        </p>

        {/* Mint Button */}
        <button
          type="button"
          onClick={handleMint}
          className="w-full mt-4 py-3.5 rounded-xl bg-primary text-white text-base font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
        >
          Mint for {card.price}
        </button>
      </div>

      {/* Divider */}
      <div className="mx-4 border-t border-border-light" />

      {/* Similar Cards */}
      {similarCards.length > 0 && (
        <div className="pt-4">
          <h2 className="text-base font-semibold text-foreground px-4 mb-2">
            Similar Cards
          </h2>
          <div className="divide-y divide-border-light">
            {similarCards.map((similarCard) => (
              <SimilarCardItem
                key={similarCard.id}
                card={similarCard}
                onClick={() => router.push(`/generate/${similarCard.id}`)}
                onMint={() => handleSimilarMint(similarCard)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Modals */}
      <MintModal
        isOpen={modalState === "mint"}
        onClose={handleCloseModal}
        card={card}
        onMint={handleMintConfirm}
      />

      <SuccessModal
        isOpen={modalState === "success"}
        onClose={handleCloseModal}
        recipientAddress={recipientAddress}
      />

      <ErrorModal
        isOpen={modalState === "error"}
        onClose={handleCloseModal}
        errorMessage={errorMessage}
        onRetry={handleRetry}
      />
    </div>
  );
}
