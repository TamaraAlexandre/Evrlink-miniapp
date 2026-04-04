import hre from "hardhat";

async function main() {
  const { ethers } = hre;
  const [deployer] = await ethers.getSigners();
  if (!deployer) {
    throw new Error("No deployer signer. Set DEPLOYER_PRIVATE_KEY in .env");
  }

  const name = process.env.NFT_NAME || "Evrlink Greeting Card";
  const symbol = process.env.NFT_SYMBOL || "EVRGC";

  const Factory = await ethers.getContractFactory("GreetingCardNFT");
  const contract = await Factory.deploy(name, symbol, deployer.address);
  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("GreetingCardNFT deployed to:", address);
  console.log("Network: Base Sepolia — set NEXT_PUBLIC_CONTRACT_ADDRESS to this address.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
