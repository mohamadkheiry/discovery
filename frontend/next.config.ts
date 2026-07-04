import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/discovery",
  assetPrefix: "/discovery",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
