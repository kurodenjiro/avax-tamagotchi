const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("FlipCoinModule", (m) => {
  const flipCoin = m.contract("FlipCoin");

  return { flipCoin };
});
