"use client";

import { FaCopy } from "react-icons/fa";
import { HealthBar } from "@/components/HealthBar";
import { Pet } from ".";
import { Dispatch, SetStateAction, useState } from "react";
import { useWallet } from "@/context/WalletProvider";

export interface DetailsProps {
  pet: Pet;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
}

export function Details({ pet, setPet }: DetailsProps) {
  const { account } = useWallet();
  const owner = account || "";

  const handleCopyOwnerAddr = () => {
    navigator.clipboard.writeText(owner);
  };

  const statItem = (label: string, value: number, icon: any) => (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-sm font-semibold uppercase tracking-wider text-gray-500">
        <span>{label}</span>
        <span>{value}%</span>
      </div>
      <HealthBar totalHealth={100} currentHealth={value} icon={icon} />
    </div>
  );

  return (
    <div className="flex flex-col gap-6 bg-white border-2 border-black rounded-lg p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex flex-col gap-6">
        {statItem("Hunger", pet.hunger, "heart")}
        {statItem("Happiness", pet.happiness, "star")}
        {statItem("Cleanliness", pet.cleanliness, "lightning")}
        {statItem("Health", pet.health, "heart")}
      </div>

      <div className="flex flex-col gap-6 pt-6 border-t-2 border-dashed border-gray-200">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Pet Name</label>
          <div className="p-2 border-2 border-black rounded bg-gray-50 font-bold">
            {pet.name}
          </div>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-gray-500 uppercase">Owner</label>
          <div className="relative group">
            <div className="p-2 border-2 border-black rounded bg-gray-50 text-xs truncate pr-10 font-mono">
              {owner}
            </div>
            <button
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              onClick={handleCopyOwnerAddr}
            >
              <FaCopy className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
