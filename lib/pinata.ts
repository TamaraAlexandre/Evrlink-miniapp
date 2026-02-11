import { PinataSDK } from "pinata";

/**
 * Pinata SDK instance for server-side IPFS uploads.
 * Only initialized when PINATA_JWT is set; otherwise getPinata() returns null.
 */
function createPinata(): PinataSDK | null {
  const jwt = process.env.PINATA_JWT;
  const gateway = process.env.NEXT_PUBLIC_GATEWAY_URL;
  if (!jwt) return null;
  return new PinataSDK({
    pinataJwt: jwt,
    ...(gateway && { pinataGateway: gateway }),
  });
}

let pinataInstance: PinataSDK | null | undefined = undefined;

export function getPinata(): PinataSDK | null {
  if (pinataInstance === undefined) {
    pinataInstance = createPinata();
  }
  return pinataInstance;
}

export function isPinataConfigured(): boolean {
  return getPinata() !== null;
}
