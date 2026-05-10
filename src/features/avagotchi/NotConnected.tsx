"use client";

import React, { useState } from "react";
import { useTypingEffect } from "@/hooks/useTypingEffect";
import { ShufflePetImage } from "./Pet/ShufflePetImage";
import { useWallet } from "@/context/WalletProvider";

export function NotConnected() {
  const [petParts, setPetParts] = useState<number[]>([0, 0, 0]);
  const { connect, connecting } = useWallet();


  return (
    <div className="flex flex-col items-center gap-12 p-8 text-center max-w-2xl mx-auto">
      <div className="transform hover:scale-105 transition-transform duration-300">
        <ShufflePetImage petParts={petParts} setPetParts={setPetParts} />
      </div>
      
      <div className="bg-white border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative">
        <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-yellow-400 border-4 border-black px-6 py-2 rounded-full font-black text-xl uppercase tracking-tighter shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Welcome
        </div>
        <div className="flex flex-col gap-4 text-xl font-bold leading-relaxed mt-4">
          <p>Welcome to Avagotchi!</p>
          <p className="text-gray-600 text-lg">Connect your wallet to mint your new on-chain pet on the Avalanche Subnet.</p>
          <p className="text-blue-600">Feed, play, and clean your new friend to keep them healthy and happy!</p>
        </div>
      </div>

      <button
        onClick={connect}
        disabled={connecting}
        className="group relative px-12 py-6 bg-red-500 border-4 border-black rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none"
      >
        <span className="text-2xl font-black text-white uppercase tracking-widest">
          {connecting ? "Connecting..." : "Get Started"}
        </span>
      </button>
    </div>
  );
}
