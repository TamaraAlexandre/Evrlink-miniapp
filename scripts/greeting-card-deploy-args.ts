import type { HardhatRuntimeEnvironment } from "hardhat/types";

/** Canonical USDC on Base Sepolia (override with USDC_ADDRESS). */
const DEFAULT_BASE_SEPOLIA_USDC =
  "0x036CbD53842c5426634e7929541eC2318f3dCF7e";

/**
 * Build constructor arguments from the compiled GreetingCardNFT artifact so
 * deploy works across constructor variants (e.g. with or without USDC).
 */
export async function getGreetingCardConstructorArgs(
  hre: HardhatRuntimeEnvironment,
  deployerAddress: string
): Promise<readonly unknown[]> {
  const artifact = await hre.artifacts.readArtifact("GreetingCardNFT");
  const ctor = artifact.abi.find(
    (item): item is { type: "constructor"; inputs: { type: string; internalType?: string; name?: string }[] } =>
      item.type === "constructor"
  );
  if (!ctor?.inputs?.length) {
    throw new Error("GreetingCardNFT ABI has no constructor inputs");
  }

  const inputs = ctor.inputs;
  const name = process.env.NFT_NAME || "Evrlink Greeting Card";
  const symbol = process.env.NFT_SYMBOL || "EVRGC";
  const usdc =
    process.env.USDC_ADDRESS?.trim() || DEFAULT_BASE_SEPOLIA_USDC;

  const types = inputs.map((i) => i.type);

  // (string name, string symbol, address initialOwner)
  if (
    types.length === 3 &&
    types[0] === "string" &&
    types[1] === "string" &&
    types[2] === "address"
  ) {
    return [name, symbol, deployerAddress];
  }

  // (string name, string symbol, address initialOwner, address usdcToken)
  if (
    types.length === 4 &&
    types[0] === "string" &&
    types[1] === "string" &&
    types[2] === "address" &&
    types[3] === "address"
  ) {
    return [name, symbol, deployerAddress, usdc];
  }

  // (address owner, address usdcToken)
  if (
    types.length === 2 &&
    types[0] === "address" &&
    types[1] === "address"
  ) {
    return [deployerAddress, usdc];
  }

  throw new Error(
    `Unsupported GreetingCardNFT constructor (${inputs.length} args): ${inputs
      .map((i) => i.internalType || i.type)
      .join(", ")}. Extend scripts/greeting-card-deploy-args.ts if needed.`
  );
}
