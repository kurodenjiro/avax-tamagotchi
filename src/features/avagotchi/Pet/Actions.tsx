"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { useWallet } from "@/context/WalletProvider";
import { Pet } from ".";
import { Food } from "../Food";
import { TAMAGOTCHI_CONTRACT_ADDRESS } from "@/utils/const";
import { TAMAGOTCHI_ABI } from "@/utils/abi";
import { ethers } from "ethers";

export type Action = "feed" | "play" | "clean";

export interface ActionsProps {
  pet: Pet;
  food: Food;
  selectedAction: Action;
  setSelectedAction: (action: Action) => void;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
  setFood: Dispatch<SetStateAction<Food | undefined>>;
}

export function Actions({
  selectedAction,
  setSelectedAction,
  setPet,
  setFood,
  pet,
  food,
}: ActionsProps) {
  const [transactionInProgress, setTransactionInProgress] = useState<boolean>(false);
  const { account, signer, provider } = useWallet();

  const handleStart = () => {
    switch (selectedAction) {
      case "feed":
        handleAction("feed");
        break;
      case "play":
        handleAction("play");
        break;
      case "clean":
        handleAction("clean");
        break;
    }
  };

  const handleAction = async (action: Action) => {
    if (!account || !signer || !provider || !TAMAGOTCHI_CONTRACT_ADDRESS) {
      console.error("Missing wallet or contract configuration");
      return;
    }

    setTransactionInProgress(true);
    try {
      const contract = new ethers.Contract(TAMAGOTCHI_CONTRACT_ADDRESS, TAMAGOTCHI_ABI, signer);
      
      console.log(`Getting pet ID for ${account}...`);
      const petId = await contract.getPetIdByOwner(account);
      console.log(`Executing ${action} for pet ${petId}...`);
      
      let tx;
      const options = { gasLimit: 200000 }; // Explicit gas limit for reliability on subnets

      if (action === "feed") tx = await contract.feed(petId, options);
      else if (action === "play") tx = await contract.play(petId, options);
      else if (action === "clean") tx = await contract.clean(petId, options);
      
      if (tx) {
        console.log(`Transaction sent: ${tx.hash}`);
        await tx.wait();
        console.log(`${action} successful!`);
        
        // Refresh pet stats
        const data = await contract.getFullPet(petId);
        setPet({
          name: data[0],
          hunger: Number(data[1]),
          happiness: Number(data[2]),
          cleanliness: Number(data[3]),
          health: Number(data[4]),
          parts: [Number(data[5]), Number(data[6]), Number(data[7])],
        });
      }
    } catch (error: any) {
      console.error(`Error during ${action}:`, error);
      alert(`Transaction failed: ${error.reason || error.message || "Unknown error"}`);
    } finally {
      setTransactionInProgress(false);
    }
  };

  return (
    <div className="flex-1 bg-white border-2 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <h3 className="text-lg font-bold mb-4">Actions</h3>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          {["play", "feed", "clean"].map((action) => (
            <label key={action} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="action"
                className="w-4 h-4"
                checked={selectedAction === action}
                onChange={() => setSelectedAction(action as Action)}
              />
              <span className="capitalize">{action}</span>
            </label>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200">
          <p className="text-sm text-gray-600 mb-4">{actionDescriptions[selectedAction]}</p>
          <button
            type="button"
            className={`w-full p-3 rounded font-bold text-white transition-all ${
              transactionInProgress ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600 active:translate-y-1"
            }`}
            onClick={handleStart}
            disabled={transactionInProgress}
          >
            {transactionInProgress ? "Processing..." : "Start"}
          </button>
        </div>
      </div>
    </div>
  );
}

const actionDescriptions: Record<Action, string> = {
  feed: "Feeding your pet increases hunger satisfaction.",
  play: "Playing with your pet increases happiness but consumes some energy.",
  clean: "Cleaning your pet improves its cleanliness and health.",
};
