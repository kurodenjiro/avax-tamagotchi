const hre = require("hardhat");

async function main() {
  const Tamagotchi = await hre.ethers.getContractFactory("Tamagotchi");
  const tamagotchi = await Tamagotchi.deploy();

  await tamagotchi.waitForDeployment();

  console.log("Tamagotchi deployed to:", await tamagotchi.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
