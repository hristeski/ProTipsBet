import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { API_BASE } from "@/lib/api";

// Ако веќе имаш export const metadata тука, задржи ја - не ја менувам бидејќи
// не си ми ја пратил содржината на постоечкиот app/page.tsx метаданите.

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

async function getFreeTips(): Promise<ApiTip[]> {
  try {
    const res = await fetch(`${API_BASE}/api/tips`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    const tips: ApiTip[] = Array.isArray(data) ? data : [];
    return tips
      .filter((t) => !t.isVip && String(t.result).toLowerCase() === "pending")
      .slice(0, 4);
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const freeTips = await getFreeTips();
  return <HomeClient initialFreeTips={freeTips} />;
}