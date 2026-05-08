"use client";

import { useWallet } from "@/context/WalletProvider";
import { Connected } from "./Connected";
import { NotConnected } from "./NotConnected";

export function Body() {
  const { connected } = useWallet();

  return (
    <div className="w-full h-full min-h-[600px] flex flex-col items-center justify-center">
      {connected ? <Connected /> : <NotConnected />}
    </div>
  );
}
