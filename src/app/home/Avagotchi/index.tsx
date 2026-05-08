"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Pet } from "../Pet";
import { Food } from "../Food";
import { Details } from "../Pet/Details";
import { Summary } from "../Pet/Summary";
import { Action, Actions } from "../Pet/Actions";
import { useWallet } from "@/context/WalletProvider";

interface AvagotchiProps {
  pet: Pet;
  food: Food;
  setPet: Dispatch<SetStateAction<Pet | undefined>>;
  setFood: Dispatch<SetStateAction<Food | undefined>>;
}

export function Avagotchi({ food, pet, setFood, setPet }: AvagotchiProps) {
  const { account } = useWallet();
  const [selectedAction, setSelectedAction] = useState<Action>("play");

  return (
    <div className="flex flex-col md:flex-row self-center gap-8 md:gap-12 m-4 md:m-8">
      <div className="flex flex-col gap-4 w-full md:w-[360px]">
        <Pet pet={pet} setPet={setPet} />
        <Details
          pet={pet}
          setPet={setPet}
        />
      </div>
      <div className="flex flex-col gap-8 w-full md:w-[600px] h-full">
        <Actions
          selectedAction={selectedAction}
          setSelectedAction={setSelectedAction}
          setFood={setFood}
          setPet={setPet}
          pet={pet}
          food={food}
        />
        <Summary pet={pet} />
      </div>
    </div>
  );
}
