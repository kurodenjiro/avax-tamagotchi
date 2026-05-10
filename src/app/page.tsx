"use client";

import dynamic from "next/dynamic";
import { Body as AvagotchiBody } from "@/features/avagotchi/Body";
import { Body as FlipCoinBody } from "@/features/flipcoin/Body";

export default function Home() {
  const projectType = (process.env.NEXT_PUBLIC_PROJECT_TYPE || 'Avagotchi');

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="flex-grow flex items-center justify-center py-10 px-4">
        <div className="w-full max-w-6xl bg-white rounded-3xl shadow-[16px_16px_0px_0px_rgba(0,0,0,1)] border-4 border-black overflow-hidden relative">
          {/* Floating Wallet Buttons moved from Header */}
          <div className="absolute top-6 right-8 z-10">
            <WalletButtons />
          </div>
          
          <div className="p-4 pt-16">
            {projectType.toLowerCase() === 'flip coin' ? <FlipCoinBody /> : <AvagotchiBody />}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

function Footer() {
  return (
    <footer className="py-8 text-center text-sm font-bold text-gray-500 uppercase tracking-widest">
      Built on Avalanche Subnet
    </footer>
  );
}


const WalletButtons = dynamic(
  async () => {
    const { WalletButtons } = await import("@/components/WalletButtons");
    return { default: WalletButtons };
  },
  {
    loading: () => (
      <div className="px-4 py-2 bg-gray-200 border-2 border-black rounded opacity-50">
        Loading...
      </div>
    ),
    ssr: false,
  }
);
