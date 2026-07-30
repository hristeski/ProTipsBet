import type { MetadataRoute } from "next";

const BASE_URL = "https://protipsbet.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/api/", "/admin", "/login", "/account"],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}