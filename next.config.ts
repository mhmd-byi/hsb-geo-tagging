import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // Disable ESLint during production builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Optionally ignore TypeScript errors during builds (use with caution)
    // ignoreBuildErrors: true,
  },
};

export default nextConfig;
