"use client";

import { useTypingEffect } from "@/hooks/useTypingEffect";
import { Pet } from ".";

export interface SummaryProps {
  pet: Pet;
}

export function Summary({ pet }: SummaryProps) {
  let text = `${pet.name} is doing great! 😄`;

  if (pet.health === 0) {
    text = `${pet.name} has passed away. 🪦`;
  } else if (pet.hunger < 30) {
    text = `${pet.name} is starving! Please feed them! 🥣`;
  } else if (pet.happiness < 30) {
    text = `${pet.name} is sad. Play with them! 🎾`;
  } else if (pet.cleanliness < 30) {
    text = `${pet.name} is dirty. Give them a bath! 🛁`;
  } else {
    text = `${pet.name} is happy and healthy! 💖`;
  }

  const typedText = useTypingEffect(text);

  return (
    <div className="bg-white border-2 border-black rounded-lg p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] min-h-[120px] flex items-center justify-center">
      <p className="text-xl font-bold text-center italic">
        "{typedText}"
      </p>
    </div>
  );
}
