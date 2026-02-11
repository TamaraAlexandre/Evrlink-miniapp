import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    // Allow Farcaster/Base profile images and other remote assets
    domains: ["imagedelivery.net"],
  },
};

export default nextConfig;
