import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: ['academy-dev.dartle.app'],
  },
  /* config options here */
};

export default nextConfig;


// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     domains: ['academy-dev.dartle.app'],
//   },
//   // ... rest of your config
// }

// module.exports = nextConfig