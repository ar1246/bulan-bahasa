import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: false, // Disable React Strict Mode to fix useEffect issues in React 19
  experimental: {
    reactCompiler: false, // Disable experimental React compiler
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignore ESLint errors during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Ignore TypeScript errors during builds
  },
};

export default nextConfig;
