import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    // Required for React Server Components streaming
    serverActions: { bodySizeLimit: '2mb' },
  },
};

export default nextConfig;
