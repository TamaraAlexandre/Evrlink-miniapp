import "./theme.css";
import "@coinbase/onchainkit/styles.css";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || "https://www.evrlinkapp.com";
  const PROJECT_NAME = process.env.NEXT_PUBLIC_ONCHAINKIT_PROJECT_NAME || "EvrLink";
  const HERO_IMAGE = process.env.NEXT_PUBLIC_APP_HERO_IMAGE || "https://i.imgur.com/nhm1ph1.png";
  const SPLASH_IMAGE = process.env.NEXT_PUBLIC_SPLASH_IMAGE || "https://i.imgur.com/nhm1ph1.png";
  const SPLASH_BG_COLOR = process.env.NEXT_PUBLIC_SPLASH_BACKGROUND_COLOR || "#000000";

  return {
    title: PROJECT_NAME,
    description: process.env.NEXT_PUBLIC_APP_DESCRIPTION || "Create and share greeting cards instantly.",
    openGraph: {
      title: PROJECT_NAME,
      description: "Create and share greeting cards instantly.",
      images: [HERO_IMAGE],
      url: URL,
    },
    other: {
      "fc:frame": JSON.stringify({
        version: "next",
        imageUrl: HERO_IMAGE,
        button: {
          title: `Launch ${PROJECT_NAME}`,
          action: {
            type: "launch_frame",
            name: PROJECT_NAME,
            url: URL,
            splashImageUrl: SPLASH_IMAGE,
            splashBackgroundColor: SPLASH_BG_COLOR,
          },
        },
      }),
    },
  };
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-background">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
