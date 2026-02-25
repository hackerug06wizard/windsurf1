import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for ByetHost compatibility
  output: 'export',
  // Disable image optimization for static hosting
  images: {
    unoptimized: true,
  },
  // Set trailing slash for better static hosting
  trailingSlash: true,
  // Optional: Set base path if deploying to subdirectory
  // basePath: '/store',
  reactCompiler: true,
};

export default nextConfig;
