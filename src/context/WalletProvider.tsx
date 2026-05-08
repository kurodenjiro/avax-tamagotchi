"use client";

import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from "react";
import { ethers } from "ethers";
import { CHAIN_ID, RPC_URL } from "@/utils/evmClient";

declare global {
  interface Window {
    ethereum?: any;
  }
}

interface WalletContextType {
  account: string | null;
  connected: boolean;
  connecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
  network: string | null;
  signer: ethers.Signer | null;
  provider: ethers.BrowserProvider | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: PropsWithChildren) {
  const [account, setAccount] = useState<string | null>(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [signer, setSigner] = useState<ethers.Signer | null>(null);
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);

  const connect = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("Please install MetaMask");
      return;
    }
    setConnecting(true);
    try {
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await browserProvider.send("eth_requestAccounts", []);
      const currentSigner = await browserProvider.getSigner();
      
      // Switch network if needed
      const network = await browserProvider.getNetwork();
      if (Number(network.chainId) !== CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: `0x${CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [{
                chainId: `0x${CHAIN_ID.toString(16)}`,
                chainName: "Avagotchi Subnet",
                rpcUrls: [RPC_URL],
                nativeCurrency: { name: "AVAX", symbol: "AVAX", decimals: 18 },
                blockExplorerUrls: ["https://2uvc4cxc.firn.gg"],
              }],
            });
          }
        }
      }

      setAccount(accounts[0]);
      setSigner(currentSigner);
      setProvider(browserProvider);
      setConnected(true);
    } catch (err) {
      console.error(err);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = () => {
    setAccount(null);
    setSigner(null);
    setProvider(null);
    setConnected(false);
  };

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAccount(accounts[0]);
        } else {
          disconnect();
        }
      });
    }
  }, []);

  return (
    <WalletContext.Provider value={{ account, connected, connecting, connect, disconnect, network: "AVAX", signer, provider }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return {
    ...context,
    wallet: context.account ? { adapter: { name: "MetaMask" } } : null,
    signAndSubmitTransaction: async (tx: any) => {
        // Mocking signAndSubmitTransaction for Aptos compatibility
        // In real EVM we use signer.sendTransaction
        return { hash: "0x..." };
    }
  };
};
