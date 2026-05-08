"use client";

import { useState, useEffect, useCallback } from "react";
import { Avagotchi } from "./Avagotchi";
import { useWallet } from "@/context/WalletProvider";
import { Mint } from "./Mint";
import { Pet } from "./Pet";
import { Food } from "./Food";
import { Modal } from "@/components/Modal";
import { ethers } from "ethers";
import { TAMAGOTCHI_ABI } from "@/utils/abi";
import { TAMAGOTCHI_CONTRACT_ADDRESS } from "@/utils/const";

export function Connected() {
  const [loading, setLoading] = useState(true);
  const [pet, setPet] = useState<Pet>();
  const [food, setFood] = useState<Food>();
  const { account, provider } = useWallet();

  const fetchPet = useCallback(async (retryCount = 0) => {
    if (!account || !provider) return;
    
    try {
      const contract = new ethers.Contract(TAMAGOTCHI_CONTRACT_ADDRESS, TAMAGOTCHI_ABI, provider);
      
      // Check balance first
      const balance = await contract.balanceOf(account);
      if (Number(balance) === 0) {
        if (retryCount < 3) {
          // If we just minted, the balance might not be updated yet
          setTimeout(() => fetchPet(retryCount + 1), 2000);
          return;
        }
        setPet(undefined);
        setLoading(false);
        return;
      }

      const petId = await contract.tokenOfOwnerByIndex(account, 0);
      const data = await contract.getFullPet(petId);
      
      setPet({
        name: data[0],
        hunger: Number(data[1]),
        happiness: Number(data[2]),
        cleanliness: Number(data[3]),
        health: Number(data[4]),
        parts: [Number(data[5]), Number(data[6]), Number(data[7])],
      });
      setFood({ number: 5 }); 
      setLoading(false);
    } catch (err) {
      console.error("Error fetching pet:", err);
      setPet(undefined);
      setLoading(false);
    }
  }, [account, provider]);

  useEffect(() => {
    fetchPet();
  }, [fetchPet]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-10 gap-4">
        <div className="w-12 h-12 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
        <p className="font-bold uppercase tracking-widest text-sm text-gray-500">Syncing with Blockchain...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 p-3 w-full max-w-4xl">
      {pet ? (
        <Avagotchi food={food || { number: 0 }} pet={pet} setPet={setPet} setFood={setFood} />
      ) : (
        <Mint fetchPet={() => {
          setLoading(true);
          return fetchPet();
        }} />
      )}
    </div>
  );
}
