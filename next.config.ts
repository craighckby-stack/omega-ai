import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enforce strict mode for identifying legacy API usage and potential issues
  reactStrictMode: true,
  
  // Transpile specific packages if they ship uncompiled source code (e.g., ESM modules that need CJS compatibility)
  // This is crucial for integrating external packages designed for Node/Vite into Next.js environment
  transpilePackages: ['z-ai-web-dev-sdk'],
  
  experimental: {
    // Configuration for Next.js Server Actions
    serverActions: {
      // DALEK KHAN MANDATE: Increase default body size limit to support larger file uploads (e.g., high-res images, video segments)
      bodySizeLimit: '10mb',
    },
  },

  // Ensure webpack configuration is optimized for production if custom needed later
  // webpack: (config, { isServer }) => {
  //   return config;
  // },
};

export default nextConfig;