/**
 * Image Composition Service
 * Combines greeting card images with text messages
 */

import type { GreetingCardData } from "./greeting-cards-data";

/**
 * Compose a greeting card with message text
 */
export async function composeGreetingCard(
  cardData: GreetingCardData,
  message: string
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Could not get canvas context"));
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the greeting card image
      ctx.drawImage(img, 0, 0);

      // Add message text if provided
      if (message && message.trim()) {
        const maxWidth = canvas.width * 0.8;
        const x = canvas.width / 2;
        const y = canvas.height * 0.6;

        // Configure text style
        ctx.font = "bold 32px Arial, sans-serif";
        ctx.fillStyle = "#333333";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        // Word wrap
        const words = message.split(" ");
        const lines: string[] = [];
        let currentLine = words[0];

        for (let i = 1; i < words.length; i++) {
          const word = words[i];
          const width = ctx.measureText(currentLine + " " + word).width;
          if (width < maxWidth) {
            currentLine += " " + word;
          } else {
            lines.push(currentLine);
            currentLine = word;
          }
        }
        lines.push(currentLine);

        // Draw each line
        const lineHeight = 40;
        const startY = y - ((lines.length - 1) * lineHeight) / 2;
        lines.forEach((line, i) => {
          ctx.fillText(line, x, startY + i * lineHeight);
        });
      }

      // Convert canvas to blob
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error("Failed to create image blob"));
          }
        },
        "image/png",
        1.0
      );
    };

    img.onerror = () => {
      reject(new Error("Failed to load greeting card image"));
    };

    // Load the image
    img.src = cardData.paperImage;
  });
}

/**
 * Prepare greeting card for upload (converts to File)
 */
export async function prepareGreetingCardForUpload(
  cardData: GreetingCardData,
  message: string
): Promise<File> {
  const blob = await composeGreetingCard(cardData, message);
  return new File([blob], "greeting_card.png", { type: "image/png" });
}

