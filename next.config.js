/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'media.formula1.com',
        pathname: '/**',
      },
    ],
  },
};
module.exports = nextConfig;
