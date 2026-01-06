import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enforce strict mode for identifying legacy API usage and potential issues
  reactStrictMode: true,
  
  // Transpile specific packages if they ship uncompiled source code (e.g., ESM modules that need CJS compatibility)
  transpilePackages: ['z-ai-web-dev-sdk'],
  
  experimental: {
    // Configuration for Next.js Server Actions
    serverActions: {
      // Increase default body size limit for file uploads or large data payloads
      bodySizeLimit: '2mb',
    },
  },
};

export default nextConfig;