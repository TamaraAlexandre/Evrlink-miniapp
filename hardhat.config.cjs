require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache/hardhat",
    artifacts: "./artifacts",
  },
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.DEPLOYER_PRIVATE_KEY],
    },
  },
};
