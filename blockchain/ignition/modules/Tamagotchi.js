const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("TamagotchiModule", (m) => {
  const tamagotchi = m.contract("Tamagotchi");

  return { tamagotchi };
});
