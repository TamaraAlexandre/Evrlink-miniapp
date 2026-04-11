const hre = require("hardhat");

async function main() {
  const ownerAddress = "0x393b57b89c67349e0fc184b7b57E44e28eF3b29C";
  const usdcAddress = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913";

  console.log("Deploying GreetingCardNFT to Base mainnet...");
  console.log("Owner:", ownerAddress);

  const GreetingCardNFT = await hre.ethers.getContractFactory("GreetingCardNFT");
  const contract = await GreetingCardNFT.deploy(
    "Evrlink Greeting Cards",
    "EVRLINK",
    ownerAddress,
    usdcAddress
  );

  await contract.waitForDeployment();
  const address = await contract.getAddress();
  console.log("GreetingCardNFT deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
