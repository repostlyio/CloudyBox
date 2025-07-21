import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.s3.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.s3.*.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: '*.digitaloceanspaces.com',
      },
      {
        protocol: 'https',
        hostname: '*.your-objectstorage.com',
      },
      {
        protocol: 'https',
        hostname: 'hel1.your-objectstorage.com',
      },
      {
        protocol: 'https',
        hostname: '*.hetzner.cloud',
      },
      // Add more S3-compatible service patterns as needed
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;
