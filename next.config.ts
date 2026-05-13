import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Oculta la "N" verde del dev indicator en development (Next 15.2+ API)
  devIndicators: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "randomuser.me" },
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "assets.cdn.filesafe.space" },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
