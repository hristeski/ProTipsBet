import type { Metadata } from "next";
import FreeTipsClient from "./FreeTipsClient";
import { API_BASE } from "@/lib/api";

export const metadata: Metadata = {
  title: "Free Football Predictions Today",
  description: "Daily free football tips, verified and public. Filter by market — 1X2, BTTS, Over/Under 2.5. No signup required.",
  alternates: {
    canonical: "https://protipsbet.com/free-tips",
  },
  openGraph: {
    title: "Free Football Predictions Today | ProTipsBet",
    description: "Daily free football tips, verified and public.",
    url: "https://protipsbet.com/free-tips",
  },
};

interface ApiTip {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league?: string;
  matchDate?: string;
  predictionType?: string;
  odds: number;
  result?: string;
  isVip: boolean;
}

async function getTips(): Promise<ApiTip[]> {
  try {
    const res = await fetch(`${API_BASE}/api/tips`, {
      next: { revalidate: 300 }, // ISR - освежи на секои 5 мин
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function FreeTipsPage() {
  const tips = await getTips();
  return <FreeTipsClient initialTips={tips} />;
}