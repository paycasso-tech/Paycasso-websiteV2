import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Exclude these packages from client-side bundling
      config.externals = config.externals || [];
      config.externals.push({
        'pdf-parse': 'commonjs pdf-parse',
        'mammoth': 'commonjs mammoth'
      });
    }
    return config;
  },
  experimental: {
    optimizeCss: true, // Tailwind v4 supports this
    serverComponentsExternalPackages: ['pdf-parse', 'mammoth'],
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ disables lint errors from breaking build
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "assets.aceternity.com",
      },
    ],
    formats: ["image/webp", "image/avif"],
  },
  async headers() {
    return [
      {
        source: "/experience",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
