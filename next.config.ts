import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'fafncxwbckmnsrbfumuz.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'cn.bing.com',
      },
      {
        protocol: 'https',
        hostname: 'ts1.tc.mm.bing.net',
      },
      {
        protocol: 'http',
        hostname: 'www.cyclingchina.net',
      },
    ],
  },
};

export default nextConfig;
