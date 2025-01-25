import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',  // Include the port used in your error message
        pathname: '/images/gallery/**',
      },
    ],
  },
  compiler: {
    styledComponents: true,
  },   
  /* config options here */
};

export default nextConfig;
