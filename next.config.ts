import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip TS errors during build (e.g. @noble/curves type mismatch in node_modules).
  // Your app code is still type-checked in the IDE.
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "imagedelivery.net", pathname: "/**" },
    ],
  },
};

export default nextConfig;
