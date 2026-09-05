export interface PredictionTip {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league?: string;
  matchDate?: string;
  predictionType?: string;
  odds: number;
  result?: string;
  isVip: boolean;
  analysis?: string; // НОВО
  tags?: string;
}

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function buildSlug(tip: PredictionTip): string {
  const datePart = tip.matchDate ? new Date(tip.matchDate).toISOString().slice(0, 10) : "tbd";
  return `${slugify(tip.homeTeam)}-vs-${slugify(tip.awayTeam)}-${datePart}-${tip.id}`;
}

function getStatus(result?: string): "pending" | "win" | "loss" {
  const normalized = result?.toLowerCase();
  if (normalized === "win") return "win";
  if (normalized === "loss") return "loss";
  return "pending";
}

export function isPubliclyRenderable(tip: PredictionTip): boolean {
  if (!tip.isVip) return true;
  return getStatus(tip.result) !== "pending";
}

export function findTipBySlug(tips: PredictionTip[], slug: string): PredictionTip | undefined {
  return tips.find((t) => buildSlug(t) === slug);
}