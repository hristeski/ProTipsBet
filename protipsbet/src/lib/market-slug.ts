import { MARKET_LABELS, type Market } from "@/lib/tips-data";

const MARKET_KEYS: Market[] = ["1X2", "BTTS", "OU25"];

// Иста логика како филтерот во FreeTipsClient - го препознава пазарот
// од слободниот текст во predictionType (пр. "BTTS - Yes", "Over 2.5 Goals").
export function classifyMarket(predictionType?: string): Market | null {
  const upper = String(predictionType ?? "").toUpperCase();
  for (const key of MARKET_KEYS) {
    if (upper.includes(key)) return key;
  }
  // Дополнителни синоними за OU25, бидејќи луѓето не секогаш го внесуваат
  // буквалниот "OU25" во predictionType, туку "Over 2.5" / "Under 2.5".
  if (upper.includes("OVER") || upper.includes("UNDER")) return "OU25";
  return null;
}

export function marketSlug(market: Market): string {
  switch (market) {
    case "1X2":
      return "1x2";
    case "BTTS":
      return "btts";
    case "OU25":
      return "over-under-2-5";
  }
}

export function marketBySlug(slug: string): Market | null {
  return MARKET_KEYS.find((m) => marketSlug(m) === slug) ?? null;
}

export function getAllMarkets(): { key: Market; slug: string; label: string }[] {
  return MARKET_KEYS.map((key) => ({ key, slug: marketSlug(key), label: MARKET_LABELS[key] }));
}