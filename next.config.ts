import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
  // Allow the Z.ai preview gateway to access dev-server assets directly.
  // Without this, Next 16 logs a "Cross origin request detected" warning
  // and may block /_next/* requests from the preview hostname.
  allowedDevOrigins: ["*.space-z.ai"],
};

export default nextConfig;
