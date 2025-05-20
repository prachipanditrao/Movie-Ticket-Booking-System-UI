
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.google.com',
        // pathname: '/url/**', // To be more specific if needed
      },
      {
        protocol: 'https',
        hostname: 'www.imdb.com',
        // pathname: '/**', // Broad, adjust if specific paths are known
      },
      {
        protocol: 'https',
        hostname: 'm.media-amazon.com', // Common host for IMDB images
        // pathname: '/images/**', // Often under /images/
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        // pathname: '/**', // Broad, adjust if specific paths are known for direct image access
      },
    ],
  },
};

export default nextConfig;
