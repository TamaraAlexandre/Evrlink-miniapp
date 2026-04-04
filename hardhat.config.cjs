// CommonJS config so Hardhat works when package.json has "type": "module".
require("@nomicfoundation/hardhat-toolbox");

/** @type import('hardhat/config').HardhatUserConfig */
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
    baseSepolia: {
      url: process.env.BASE_SEPOLIA_RPC_URL || "https://sepolia.base.org",
      accounts:
        process.env.DEPLOYER_PRIVATE_KEY &&
        process.env.DEPLOYER_PRIVATE_KEY.length > 0
          ? [process.env.DEPLOYER_PRIVATE_KEY]
          : [],
    },
  },
};
