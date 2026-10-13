import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  productionBrowserSourceMaps: false,
  experimental: {
    serverSourceMaps: false,
  },
};

export default nextConfig;
