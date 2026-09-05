import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import FAQStructuredData from "@/components/FAQStructuredData";
import TipsStructuredData from "@/components/TipsStructuredData";
import ReviewStructuredData from "@/components/ReviewStructuredData";
import ConfidenceStatsBar from "@/components/ConfidenceStatsBar";
import WinningTicketsGallery from "@/components/WinningTicketsGallery";
import { API_BASE } from "@/lib/api";
import { isToday, isYesterday } from "@/lib/tip-format";

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

async function getHomeTipsData() {
  try {
    const res = await fetch(`${API_BASE}/api/tips`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return { todayFreeTips: [], yesterdayFreeTips: [] };
    const data = await res.json();
    const tips: ApiTip[] = Array.isArray(data) ? data : [];

    const todayFreeTips = tips.filter(
      (t) => !t.isVip && String(t.result).toLowerCase() === "pending" && isToday(t.matchDate)
    );
    const yesterdayFreeTips = tips.filter(
      (t) => !t.isVip && String(t.result).toLowerCase() !== "pending" && isYesterday(t.matchDate)
    );

    return {
      todayFreeTips: todayFreeTips.slice(0, 4),
      yesterdayFreeTips: yesterdayFreeTips.slice(0, 4),
    };
  } catch {
    return { todayFreeTips: [], yesterdayFreeTips: [] };
  }
}

export default async function HomePage() {
  const { todayFreeTips, yesterdayFreeTips } = await getHomeTipsData();

  return (
    <>
      <FAQStructuredData />
      <TipsStructuredData tips={todayFreeTips} />
      <ReviewStructuredData />
      <HomeClient
        initialFreeTips={todayFreeTips}
        yesterdayFreeTips={yesterdayFreeTips}
        confidenceBar={<ConfidenceStatsBar />}
        winningGallery={<WinningTicketsGallery />}
      />
    </>
  );
}