# Avagotchi & FlipCoin Starter

<p align="center">
  <img src="public/icon.png" width="300" alt="Avagotchi Mascot">
</p>

🚀 A robust, automated starter kit for building on-chain applications on Avalanche Subnets.

## Features

- 🏗 **One-Command Setup**: Bootstrap a full-stack dApp in minutes using `npx create-starter-avax`.
- 🦊 **Avagotchi**: A fully functional on-chain pet game (ERC721) with hunger, happiness, and health mechanics.
- 🪙 **FlipCoin**: A provably fair (pseudo-random) coin flip betting game.
- ⚡ **Avalanche Subnet Optimized**: Pre-configured for custom RPCs, Chain IDs, and block explorers.
- 🎨 **NES.css Aesthetics**: A charming 8-bit retro UI design.
- 🛠 **Hardhat Integration**: Script-based deployment with automatic frontend environment configuration.

## Getting Started

1. **Bootstrap your project**:
   ```bash
   npx create-starter-avax
   ```

2. **Follow the CLI prompts** to select your project type (Avagotchi or FlipCoin) and provide your Subnet RPC details.

3. **Fund your project wallet** (displayed in the CLI) to cover deployment costs.

4. **Launch**: The CLI will automatically deploy the contract, install dependencies, and open the browser at `http://localhost:3000`.

## Automated Pipeline

The `create-starter-avax` tool handles:
- ✅ Wallet generation & funding verification
- ✅ Smart contract compilation & deployment
- ✅ Frontend `.env` configuration
- ✅ `npm install` for both blockchain and frontend
- ✅ Automatic dev server launch

## Technology Stack

- **Frontend**: Next.js (App Router), Tailwind CSS, NES.css
- **Blockchain**: Solidity, Hardhat, Ethers.js v6
- **Subnet Support**: Fully compatible with Avalanche Subnets (Custom RPC, Chain ID)

## License

MIT
