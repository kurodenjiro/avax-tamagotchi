export const GAME_CONFIG = {
  PET_NAME: "AvaxPet",
  MAX_STATS: 100,
  INITIAL_STATS: 80,
  
  // Decay rates (points per hour)
  HUNGER_DECAY: 5,
  HAPPINESS_DECAY: 3,
  CLEANLINESS_DECAY: 2,
  
  // Recovery values
  FEED_RECOVERY: 20,
  PLAY_RECOVERY: 15,
  CLEAN_RECOVERY: 25,
  HEAL_RECOVERY: 50,
  
  // Time thresholds (seconds)
  TICK_INTERVAL: 3600, // 1 hour for full decay cycle in this demo
  
  // Avalanche Fuji Testnet Contract Address (to be updated)
  CONTRACT_ADDRESS: "",
};

export type PetStats = {
  hunger: number;
  happiness: number;
  cleanliness: number;
  health: number;
  lastInteraction: number;
};
