import type { MetadataRoute } from "next";
import { getAllTips, buildSlug, isPubliclyRenderable } from "@/lib/predictions";

const BASE_URL = "https://protipsbet.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = ["", "/free-tips", "/vip-tips", "/history", "/contact", "/partners", "/privacy", "/terms"];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const tips = await getAllTips();
  const predictionEntries: MetadataRoute.Sitemap = tips
    .filter(isPubliclyRenderable)
    .map((tip) => ({
      url: `${BASE_URL}/predictions/${buildSlug(tip)}`,
      lastModified: tip.matchDate ? new Date(tip.matchDate) : new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    }));

  return [...staticEntries, ...predictionEntries];
}