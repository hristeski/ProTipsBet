import type { MetadataRoute } from "next";
import { getAllTips, buildSlug, isPubliclyRenderable } from "@/lib/predictions";
import { getDistinctLeagues, slugifyLeague } from "@/lib/league-slug";
import { getAllMarkets } from "@/lib/market-slug";
import { GLOSSARY_TERMS } from "@/lib/glossary-data";
import { getTipStatus } from "@/lib/tip-format";
import { getISOWeekString } from "@/lib/iso-week";

const BASE_URL = "https://protipsbet.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    "",
    "/free-tips",
    "/vip-tips",
    "/history",
    "/leagues",
    "/markets",
    "/glossary",
    "/results",
    "/sitemap-page",
    "/contact",
    "/partners",
    "/privacy",
    "/terms",
  ];

  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date(),
    changeFrequency: route === "" ? "daily" : "weekly",
    priority: route === "" ? 1 : 0.7,
  }));

  const tips = await getAllTips();
  const publicTips = tips.filter(isPubliclyRenderable);

  const predictionEntries: MetadataRoute.Sitemap = publicTips.map((tip) => ({
    url: `${BASE_URL}/predictions/${buildSlug(tip)}`,
    lastModified: tip.matchDate ? new Date(tip.matchDate) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const leagueEntries: MetadataRoute.Sitemap = getDistinctLeagues(publicTips).map((league) => ({
    url: `${BASE_URL}/leagues/${slugifyLeague(league)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const marketEntries: MetadataRoute.Sitemap = getAllMarkets().map((m) => ({
    url: `${BASE_URL}/markets/${m.slug}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const glossaryEntries: MetadataRoute.Sitemap = GLOSSARY_TERMS.map((t) => ({
    url: `${BASE_URL}/glossary/${t.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  const weeks = new Set<string>();
  for (const tip of tips) {
    const status = getTipStatus(tip.result);
    if ((status === "win" || status === "loss") && tip.matchDate) {
      weeks.add(getISOWeekString(new Date(tip.matchDate)));
    }
  }
  const resultsEntries: MetadataRoute.Sitemap = Array.from(weeks).map((week) => ({
    url: `${BASE_URL}/results/${week}`,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));

  return [
    ...staticEntries,
    ...predictionEntries,
    ...leagueEntries,
    ...marketEntries,
    ...glossaryEntries,
    ...resultsEntries,
  ];
}