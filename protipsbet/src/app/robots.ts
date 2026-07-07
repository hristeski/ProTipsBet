import type { MetadataRoute } from "next";

const BASE_URL = "https://protipsbet.com"; // change to your real domain

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/api/"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}