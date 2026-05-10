"use client";

import React, { useState } from 'react';
import { ethers } from 'ethers';
import { FLIPCOIN_CONTRACT_ADDRESS } from '@/utils/const';

import { useWallet } from '@/context/WalletProvider';

// Minimal ABI for FlipCoin
const ABI = [
  "function flip(bool choice) external payable",
  "event BetPlaced(address indexed player, uint256 amount, bool choice, bool won)"
];

export function Body() {
  const { connected, connect, signer, account } = useWallet();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleFlip = async (choice: boolean) => {
    if (!connected || !signer) return;
    
    setLoading(true);
    setResult(null);
    try {
      const contract = new ethers.Contract(FLIPCOIN_CONTRACT_ADDRESS, ABI, signer);

      const tx = await contract.flip(choice, { 
        value: ethers.parseEther("0.01"),
        gasLimit: 150000 // Add gas limit for reliability
      });
      const receipt = await tx.wait();
      
      console.log("Flip successful:", receipt.hash);
      
      // Parse the logs to find the BetPlaced event
      let gameResult = "Transaction successful!";
      if (receipt.logs) {
        for (const log of receipt.logs) {
          try {
            const parsedLog = contract.interface.parseLog(log);
            if (parsedLog?.name === "BetPlaced") {
              const won = parsedLog.args[3]; // 'won' is the 4th argument
              gameResult = won ? "🎉 YOU WON! DOUBLE AVAX! 🎉" : "😢 YOU LOST! TRY AGAIN? 😢";
              break;
            }
          } catch (e) {
            // Not our event, ignore
          }
        }
      }
      
      setResult(gameResult);
    } catch (err: any) {
      console.error(err);
      setResult(err.reason || err.message || "Error occurred.");
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="p-10 text-center bg-white rounded-3xl border-4 border-black shadow-[16px_16px_0_0_rgba(0,0,0,1)] min-h-[400px] flex flex-col justify-center items-center gap-8">
        <div className="w-32 h-32 bg-yellow-400 border-4 border-black rounded-full flex items-center justify-center animate-bounce shadow-[8px_8px_0_0_rgba(0,0,0,1)]">
           <span className="text-6xl">🪙</span>
        </div>
        <div>
          <h2 className="text-3xl font-black uppercase mb-2">Wallet Disconnected</h2>
          <p className="text-gray-500 font-bold uppercase tracking-widest">Connect to start flipping</p>
        </div>
        <button
          onClick={connect}
          className="px-12 py-6 bg-indigo-600 text-white font-black text-2xl border-4 border-black rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-x-2 active:translate-y-2 active:shadow-none transition-all"
        >
          CONNECT WALLET
        </button>
      </div>
    );
  }

  return (
    <div className="p-10 text-center bg-gradient-to-br from-indigo-50 to-white min-h-[400px] flex flex-col justify-center">
      <h2 className="text-5xl font-black mb-4 uppercase tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
        Flip a Coin
      </h2>
      <p className="text-gray-500 font-bold uppercase tracking-widest mb-12">
        Playing as: <span className="text-black font-mono lowercase">{account?.slice(0,6)}...{account?.slice(-4)}</span>
      </p>

      <div className="flex justify-center gap-12 mb-12">
        <button 
          onClick={() => handleFlip(true)}
          disabled={loading}
          className="group relative w-48 h-48 bg-yellow-400 border-4 border-black rounded-full shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors"></div>
          <span className="relative text-3xl font-black text-black">HEADS</span>
        </button>

        <button 
          onClick={() => handleFlip(false)}
          disabled={loading}
          className="group relative w-48 h-48 bg-indigo-500 border-4 border-black rounded-full shadow-[8px_8px_0_0_rgba(0,0,0,1)] hover:translate-y-1 hover:shadow-[4px_4px_0_0_rgba(0,0,0,1)] active:translate-y-2 active:shadow-none transition-all flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-white/20 group-hover:bg-transparent transition-colors"></div>
          <span className="relative text-3xl font-black text-white">TAILS</span>
        </button>
      </div>

      <div className="min-h-[60px]">
        {loading && (
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xl font-bold text-indigo-600 animate-pulse uppercase">Flipping in progress...</p>
          </div>
        )}
        {result && (
          <div className="p-4 bg-white border-4 border-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] rounded-xl inline-block animate-bounce max-w-lg">
            <p className="text-lg font-black text-black uppercase break-words">{result}</p>
          </div>
        )}
      </div>

      <div className="mt-12 p-4 bg-black/5 rounded-2xl border-2 border-dashed border-black/10">
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">
          Standard Bet: <span className="text-black">0.01 AVAX</span> • Payout: <span className="text-indigo-600">2x</span>
        </p>
      </div>
    </div>
  );
}
