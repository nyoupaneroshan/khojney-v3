import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin",
          "/admin/",
          "/dashboard",
          "/dashboard/",
          "/api",
          "/api/",
          "/reset-password",
          "/forgot-password",
        ],
      },
    ],
    sitemap: "https://khojney.com/sitemap.xml",
    host: "https://khojney.com",
  };
}
