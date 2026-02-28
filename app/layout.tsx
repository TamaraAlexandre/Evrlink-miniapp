import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import MiniAppReady from "./components/MiniAppReady";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const appUrl = process.env.NEXT_PUBLIC_URL || "https://your-app-url.com";
  const embedImageUrl = `${appUrl}/api/og`; // adjust if you have a different OG image route

  return {
    title: "Evrlink – Digital Greeting Cards",
    description: "Send and recieve greeting cards because some moments should last forever.",
    other: {
      "base:app_id": "699746e0de5d09de18347da4",
      "fc:miniapp": JSON.stringify({
        version: "next",
        imageUrl: embedImageUrl,
        button: {
          title: "Open Evrlink",
          action: {
            type: "launch_miniapp",
            name: "Evrlink",
            url: appUrl,
            splashImageUrl: `${appUrl}/splash.png`,
            splashBackgroundColor: "#00B2C7",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <MiniAppReady />
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
