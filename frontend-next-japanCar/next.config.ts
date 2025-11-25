import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '185.231.115.136',
        port: '1000',
        pathname: '/car-images/**',
      },
    ],
  },
  env: {
    API_URL: 'http://185.231.115.136:1000/api',
    ASSETS_URL: 'http://185.231.115.136:1000/car-images',
    // API_URL:
    //   process.env.NODE_ENV == 'development'
    //     ? 'http://localhost:23341/api'
    //     : 'http://185.231.115.136:1000',
  },
};
export default nextConfig;
