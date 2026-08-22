import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import FAQStructuredData from "@/components/FAQStructuredData";
import TipsStructuredData from "@/components/TipsStructuredData";
import ReviewStructuredData from "@/components/ReviewStructuredData";
import ConfidenceStatsBar from "@/components/ConfidenceStatsBar";
import WinningTicketsGallery from "@/components/WinningTicketsGallery";
import { API_BASE } from "@/lib/api";

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
      next: { revalidate: 60 }, //osvezhi na sekoi 60 sekundi
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

  return (
    <>
      <FAQStructuredData />
      <TipsStructuredData tips={freeTips} />
      <ReviewStructuredData />
      <HomeClient
        initialFreeTips={freeTips}
        confidenceBar={<ConfidenceStatsBar />}
        winningGallery={<WinningTicketsGallery />}
      />
    </>
  );
}