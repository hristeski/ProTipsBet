import type { Metadata } from "next";
import Link from "next/link";
import { Target, ChevronRight } from "lucide-react";
import { getAllTips, isPubliclyRenderable } from "@/lib/predictions";
import { getAllMarkets, classifyMarket } from "@/lib/market-slug";
import { getTipStatus } from "@/lib/tip-format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Football Predictions by Market",
  description: "Browse verified predictions by betting market — 1X2, BTTS, and Over/Under 2.5 Goals.",
  alternates: { canonical: "https://protipsbet.com/markets" },
};

export default async function MarketsIndexPage() {
  const tips = await getAllTips();
  const publicTips = tips.filter(isPubliclyRenderable);
  const markets = getAllMarkets();

  const marketStats = markets.map((m) => {
    const marketTips = publicTips.filter((t) => classifyMarket(t.predictionType) === m.key);
    const pendingCount = marketTips.filter((t) => getTipStatus(t.result) === "pending").length;
    return { ...m, totalCount: marketTips.length, pendingCount };
  });

  return (
    <div className="pb-24 px-4 pt-24 md:pt-32 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3">Predictions by Market</h1>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Browse our verified predictions organized by betting market.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {marketStats.map(({ slug, label, totalCount, pendingCount }) => (
          <Link
            key={slug}
            href={`/markets/${slug}`}
            className="flex items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-xl px-5 py-4 hover:bg-zinc-900/70 hover:border-emerald-500/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                <Target size={18} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">{label} Tips</p>
                <p className="text-zinc-500 text-xs">
                  {totalCount} prediction{totalCount === 1 ? "" : "s"}
                  {pendingCount > 0 ? ` • ${pendingCount} pending` : ""}
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-zinc-600 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}