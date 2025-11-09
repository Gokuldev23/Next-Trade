import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.public.blob.vercel-storage.com", // wildcard for all blob subdomains
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
