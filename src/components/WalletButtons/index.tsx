"use client";

import { useWallet } from "@/context/WalletProvider";

const buttonStyles = "px-4 py-2 bg-blue-600 text-white rounded font-bold transition-all hover:bg-blue-700 active:translate-y-0.5 shadow-[2px_2px_0_0_rgba(0,0,0,1)] border-2 border-black";

export const WalletButtons = () => {
  const { connected, disconnect, connect, connecting, account } = useWallet();

  if (connected && account) {
    return (
      <div className="flex flex-row items-center gap-4">
        <span className="text-sm font-mono bg-gray-100 px-2 py-1 border border-black rounded">
          {account.slice(0, 6)}...{account.slice(-4)}
        </span>
        <button
          className={`${buttonStyles} bg-red-500 hover:bg-red-600`}
          onClick={disconnect}
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      className={`${buttonStyles} ${connecting ? "opacity-50 cursor-not-allowed" : ""}`}
      onClick={connect}
      disabled={connecting}
    >
      {connecting ? "Connecting..." : "Connect Wallet"}
    </button>
  );
};
