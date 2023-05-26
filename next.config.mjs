/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  experimental: {
    transpilePackages: ['@reservoir0x/reservoir-kit-ui'],
  },
  images: {
    domains: ['ipfs-2.thirdwebcdn.com'],
  },
};

export default nextConfig;
