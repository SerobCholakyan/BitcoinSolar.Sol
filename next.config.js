/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000"]
    }
  },

  transpilePackages: ["ai-orchestrator"]
};

module.exports = nextConfig;
