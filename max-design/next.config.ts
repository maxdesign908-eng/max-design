import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90, 95],
  },
  experimental: {
    inlineCss: true,
  },
};

export default nextConfig;