/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false;
    // Disable filesystem cache to prevent snapshot errors in paths with spaces
    config.cache = false;
    return config;
  },
  experimental: {
    serverComponentsExternalPackages: ['pdf-parse', 'mongoose', 'bcryptjs'],
  },
};

export default nextConfig;
