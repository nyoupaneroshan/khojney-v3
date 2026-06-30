import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  // Surface real type errors at build time. (Previously this was `true`,
  // which silently let type-checked bugs ship to production.)
  typescript: {
    ignoreBuildErrors: false,
  },
  // Surface impure renders, missing cleanups, and stale-state bugs in dev.
  reactStrictMode: true,
  // Don't advertise the Next.js version via response headers.
  poweredByHeader: false,
  // Allow the Z.ai preview gateway to access dev-server assets directly.
  allowedDevOrigins: ["*.space-z.ai"],
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
