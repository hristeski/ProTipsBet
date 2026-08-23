import type { PredictionTip } from "@/lib/prediction-slug";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugifyLeague(league: string): string {
  return slugify(league);
}

// Игнорираме placeholder вредности како "Unknown" / "VIP Only" - тие не се
// реални лиги, туку fallback текст кога league полето не е внесено.
const IGNORED_LEAGUE_VALUES = new Set(["unknown", "vip only", ""]);

export function getDistinctLeagues(tips: PredictionTip[]): string[] {
  const seen = new Map<string, string>(); // slug -> оригинално име (прво најдено)

  for (const tip of tips) {
    const league = tip.league?.trim();
    if (!league || IGNORED_LEAGUE_VALUES.has(league.toLowerCase())) continue;

    const slug = slugifyLeague(league);
    if (!seen.has(slug)) seen.set(slug, league);
  }

  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
}

export function findLeagueBySlug(tips: PredictionTip[], slug: string): string | undefined {
  const leagues = getDistinctLeagues(tips);
  return leagues.find((league) => slugifyLeague(league) === slug);
}