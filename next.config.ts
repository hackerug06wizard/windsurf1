import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Standard Next.js configuration for Render deployment
  reactCompiler: true,
  // Image optimization works on Render
  images: {
    domains: ['localhost'],
  },
};

export default nextConfig;
