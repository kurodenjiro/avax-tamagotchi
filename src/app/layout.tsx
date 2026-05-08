import { WalletProvider } from "@/context/WalletProvider";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { PropsWithChildren } from "react";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: "Avagotchi",
  description: "Avagotchi - Your new favorite on-chain pet on Avalanche!",
  openGraph: {
    title: "Avagotchi",
    description: "Avagotchi - Your new favorite on-chain pet on Avalanche!",
    images: ["/tamagotchi.png"],
  },
};

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50 text-gray-900 min-h-screen`}>
        <WalletProvider>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </WalletProvider>
      </body>
    </html>
  );
}
