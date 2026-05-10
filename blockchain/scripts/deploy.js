const hre = require("hardhat");

async function main() {
  const contractName = process.env.CONTRACT_NAME || "Tamagotchi";
  console.log(`Deploying ${contractName}...`);
  
  const Factory = await hre.ethers.getContractFactory(contractName);
  const contract = await Factory.deploy();

  await contract.waitForDeployment();
  const address = await contract.getAddress();
  const tx = contract.deploymentTransaction();

  console.log(`${contractName} deployed to:`, address);
  if (tx) {
    console.log(`Transaction hash: ${tx.hash}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
