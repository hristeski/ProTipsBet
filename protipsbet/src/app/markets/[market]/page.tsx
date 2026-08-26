import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, Clock, Target } from "lucide-react";
import { getAllTips, isPubliclyRenderable, buildSlug } from "@/lib/predictions";
import { getAllMarkets, marketBySlug, classifyMarket } from "@/lib/market-slug";
import { MARKET_LABELS } from "@/lib/tips-data";
import { getTipStatus, formatDate, formatMatchTime } from "@/lib/tip-format";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";

export const revalidate = 300;

export function generateStaticParams() {
  return getAllMarkets().map((m) => ({ market: m.slug }));
}

interface Props {
  params: Promise<{ market: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market: marketSlugParam } = await params;
  const market = marketBySlug(marketSlugParam);
  if (!market) return { title: "Market Not Found | ProTipsBet" };

  const label = MARKET_LABELS[market];
  return {
    title: `${label} Predictions & Tips`,
    description: `Daily ${label} football predictions, verified and public. See our upcoming picks and full track record for this market.`,
    alternates: { canonical: `https://protipsbet.com/markets/${marketSlugParam}` },
  };
}

function StatusIcon({ status }: { status: "pending" | "win" | "loss" }) {
  if (status === "win") return <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />;
  if (status === "loss") return <XCircle size={20} className="text-red-400 shrink-0" />;
  return <Clock size={20} className="text-amber-400 shrink-0" />;
}

export default async function MarketPage({ params }: Props) {
  const { market: marketSlugParam } = await params;
  const market = marketBySlug(marketSlugParam);
  if (!market) notFound();

  const tips = await getAllTips();
  const publicTips = tips.filter(isPubliclyRenderable);
  const marketTips = publicTips
    .filter((t) => classifyMarket(t.predictionType) === market)
    .sort((a, b) => new Date(b.matchDate ?? 0).getTime() - new Date(a.matchDate ?? 0).getTime());

  const label = MARKET_LABELS[market];
  const pendingTips = marketTips.filter((t) => getTipStatus(t.result) === "pending");
  const completedTips = marketTips.filter((t) => getTipStatus(t.result) !== "pending");
  const wins = completedTips.filter((t) => getTipStatus(t.result) === "win").length;
  const winRate = completedTips.length > 0 ? Math.round((wins / completedTips.length) * 100) : null;

  return (
    <div className="pb-24 px-4 pt-24 md:pt-32 max-w-3xl mx-auto">
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "https://protipsbet.com/" },
          { name: "Markets", url: "https://protipsbet.com/markets" },
          { name: `${label} Tips`, url: `https://protipsbet.com/markets/${marketSlugParam}` },
        ]}
      />

      <nav className="text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-emerald-400">Home</Link>
        {" / "}
        <Link href="/markets" className="hover:text-emerald-400">Markets</Link>
        {" / "}
        <span className="text-zinc-300">{label}</span>
      </nav>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <Target className="text-emerald-500" size={28} />
          <h1 className="text-2xl md:text-4xl font-black text-white">{label} Predictions</h1>
        </div>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Daily verified {label} picks.
          {winRate !== null && ` Track record: ${winRate}% win rate over ${completedTips.length} completed picks.`}
        </p>
      </div>

      {pendingTips.length > 0 && (
        <div className="mb-12">
          <h2 className="text-lg font-black text-white mb-4">Upcoming Picks</h2>
          <div className="flex flex-col gap-3">
            {pendingTips.map((tip) => (
              <Link
                key={tip.id}
                href={`/predictions/${buildSlug(tip)}`}
                className="flex items-center justify-between gap-4 bg-zinc-900/40 border border-amber-500/20 rounded-xl px-4 py-3 hover:bg-zinc-900/70 transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-500 mb-0.5">
                    {formatDate(tip.matchDate)} • {tip.league && tip.league !== "Unknown" ? tip.league : "Football"}
                  </p>
                  <p className="text-white font-bold text-sm truncate">
                    {tip.homeTeam} vs {tip.awayTeam}
                  </p>
                </div>
                <span className="text-white font-bold text-sm shrink-0">@ {Number(tip.odds).toFixed(2)}</span>
                <StatusIcon status="pending" />
              </Link>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-black text-white mb-4">Past Results</h2>
        {completedTips.length === 0 ? (
          <p className="text-zinc-500 text-sm">No completed {label} predictions yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {completedTips.map((tip) => {
              const status = getTipStatus(tip.result);
              return (
                <Link
                  key={tip.id}
                  href={`/predictions/${buildSlug(tip)}`}
                  className={`flex items-center justify-between gap-4 bg-zinc-900/40 border rounded-xl px-4 py-3 hover:bg-zinc-900/70 transition-colors ${
                    status === "win" ? "border-emerald-500/20" : "border-red-500/20"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-500 mb-0.5">{formatDate(tip.matchDate)}</p>
                    <p className="text-white font-bold text-sm truncate">
                      {tip.homeTeam} vs {tip.awayTeam}
                    </p>
                  </div>
                  <span className="text-white font-bold text-sm shrink-0">@ {Number(tip.odds).toFixed(2)}</span>
                  <StatusIcon status={status} />
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}