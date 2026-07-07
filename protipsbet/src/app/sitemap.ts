import type { MetadataRoute } from "next";

const BASE_URL = "https://protipsbet.com"; // change to your real domain

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/free-tips", "/vip-tips", "/history", "/contact"];

  return routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}