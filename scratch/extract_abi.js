const fs = require('fs');
const artifact = JSON.parse(fs.readFileSync('blockchain/artifacts/contracts/Tamagotchi.sol/Tamagotchi.json', 'utf8'));
const abiContent = `export const TAMAGOTCHI_ABI = ${JSON.stringify(artifact.abi, null, 2)};`;
fs.writeFileSync('src/utils/abi.ts', abiContent);
