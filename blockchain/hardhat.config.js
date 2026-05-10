require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: "../.env" });

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      evmVersion: "cancun"
    }
  },
  networks: {
    hardhat: {
      chainId: 1337,
    },
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    avax_custom: {
      url: process.env.RPC_URL || "https://nodes-prod.18.182.4.86.sslip.io/ext/bc/2PyQcV83e7qoCkaGAXVPMTMixfLW3Uxt5eBRiykDUT5EF57MQY/rpc",
      chainId: parseInt(process.env.CHAIN_ID) || 577706,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      gasPrice: 2000000000, // 2 gwei
    },
  },
};
