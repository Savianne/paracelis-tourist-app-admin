import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
        {
            source: '/:path*', // Match all routes
            headers: [
                { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
                { key: 'Pragma', value: 'no-cache' },
                { key: 'Expires', value: '0' },
            ],
        },
    ];
  },
  reactStrictMode: false,
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '88.222.244.153',
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
