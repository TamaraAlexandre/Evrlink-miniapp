import hre from "hardhat";
import { getGreetingCardConstructorArgs } from "./greeting-card-deploy-args";

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer. Set DEPLOYER_PRIVATE_KEY in .env");
  }

  const args = await getGreetingCardConstructorArgs(hre, deployer.address);

  const Factory = await ethers.getContractFactory("GreetingCardNFT");
  const contract = await Factory.deploy(...args);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("GreetingCardNFT deployed to:", address);
  console.log("Network: Base Sepolia — set NEXT_PUBLIC_CONTRACT_ADDRESS to this address.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
