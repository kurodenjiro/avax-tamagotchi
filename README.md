# Avagotchi: On-Chain Tamagotchi Demo

Avagotchi is a premium blockchain-based Tamagotchi game built on the **Avalanche** network. It features unique NFT pets with real-time statistical decay and on-chain interactions.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Solidity](https://img.shields.io/badge/solidity-%5E0.8.24-lightgrey)
![React](https://img.shields.io/badge/react-19-blue)
![Vite](https://img.shields.io/badge/vite-6-purple)

## ✨ Features

- **Pet NFTs (ERC721)**: Every pet is a unique token owned by the user.
- **On-Chain Lifecycle**: Hunger, Happiness, Cleanliness, and Health are tracked directly on the blockchain.
- **Real-Time Decay**: Pet stats decay based on block timestamps (e.g., hunger drops 5 points per hour).
- **Interactive Gameplay**: Feed, play, and clean your pet through the dApp UI.
- **Premium Design**: A glassmorphism-inspired UI built with Framer Motion for smooth animations and a premium feel.
- **Configurable Mechanics**: Centralized configuration for easy customization of decay rates and recovery values.

## 🛠 Tech Stack

- **Smart Contracts**: Solidity ^0.8.24, OpenZeppelin 5.0
- **Blockchain Environment**: Hardhat, Hardhat Ignition
- **Frontend**: React 19, TypeScript, Vite
- **Web3 Library**: Ethers.js v6
- **UI & Animations**: Lucide-React, Framer Motion, Vanilla CSS (Premium Design System)

## 📁 Project Structure

```
avagotchi/
├── blockchain/          # Smart contract development (Hardhat)
│   ├── contracts/       # Solidity source files
│   ├── ignition/        # Deployment modules
│   └── test/            # Contract unit tests
├── src/                 # Frontend source code (React)
│   ├── abi.ts           # Contract ABI
│   ├── config.ts        # Game mechanics configuration
│   └── App.tsx          # Main application logic
├── public/              # Static assets
└── package.json         # Frontend dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v22.13.0 or later recommended)
- MetaMask or any Web3 wallet
- Avalanche Fuji Testnet AVAX (for testnet deployment)

### 1. Blockchain Setup

Navigate to the `blockchain` directory and install dependencies:

```bash
cd blockchain
npm install
```

Start a local Hardhat node:

```bash
npx hardhat node
```

In a new terminal, deploy the contract to the local network:

```bash
npx hardhat ignition deploy ./ignition/modules/Tamagotchi.js --network localhost
```

### 2. Frontend Setup

Install dependencies at the root directory:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

### 3. Configure Contract Address

Update the `CONTRACT_ADDRESS` constant in `src/App.tsx` with the address of your deployed contract.

## 🧪 Testing

To run the smart contract tests:

```bash
cd blockchain
npx hardhat test
```

## 📄 License

This project is licensed under the MIT License.
