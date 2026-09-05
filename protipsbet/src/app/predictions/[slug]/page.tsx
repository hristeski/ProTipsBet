import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, TrendingUp, CheckCircle2, XCircle, Clock, Crown, Trophy, Target } from "lucide-react";
import { getAllTips, buildSlug, findTipBySlug, isPubliclyRenderable } from "@/lib/predictions";
import { getTipStatus, formatDate, formatMatchTime } from "@/lib/tip-format";
import { MARKET_LABELS, type Market } from "@/lib/tips-data";
import { slugifyLeague } from "@/lib/league-slug";
import { classifyMarket, marketSlug } from "@/lib/market-slug";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";

export const revalidate = 60;

export async function generateStaticParams() {
  const tips = await getAllTips();
  return tips.filter(isPubliclyRenderable).map((tip) => ({ slug: buildSlug(tip) }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

async function getTip(slug: string) {
  const tips = await getAllTips();
  const tip = findTipBySlug(tips, slug);
  if (!tip || !isPubliclyRenderable(tip)) return null;
  return tip;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const tip = await getTip(slug);

  if (!tip) {
    return { title: "Prediction Not Found | ProTipsBet" };
  }

  const title = `${tip.homeTeam} vs ${tip.awayTeam} Prediction - ${formatDate(tip.matchDate)} | ProTipsBet`;
  const description = tip.analysis
    ? tip.analysis.slice(0, 155)
    : `${tip.homeTeam} vs ${tip.awayTeam}: our ${tip.predictionType ?? "match"} prediction at odds @${Number(tip.odds).toFixed(2)}. ${tip.league ?? "Football"} match preview, verified track record.`;

  return {
    title,
    description,
    alternates: { canonical: `https://protipsbet.com/predictions/${slug}` },
    openGraph: {
      title,
      description,
      url: `https://protipsbet.com/predictions/${slug}`,
    },
  };
}

function StatusBadge({ status }: { status: "pending" | "win" | "loss" }) {
  if (status === "win") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-black uppercase">
        <CheckCircle2 size={14} /> Won
      </span>
    );
  }
  if (status === "loss") {
    return (
      <span className="inline-flex items-center gap-1.5 bg-red-500/10 border border-red-500/20 text-red-400 px-3 py-1.5 rounded-lg text-xs font-black uppercase">
        <XCircle size={14} /> Lost
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-3 py-1.5 rounded-lg text-xs font-black uppercase">
      <Clock size={14} /> Pending
    </span>
  );
}

export default async function PredictionPage({ params }: Props) {
  const { slug } = await params;
  const tip = await getTip(slug);
  if (!tip) notFound();

  const status = getTipStatus(tip.result);
  const marketKey = classifyMarket(tip.predictionType);
  const marketLabel = marketKey ? MARKET_LABELS[marketKey] : tip.predictionType || "Match Prediction";
  const pageUrl = `https://protipsbet.com/predictions/${slug}`;

  const hasLeague = tip.league && tip.league !== "Unknown" && tip.league !== "VIP Only";
  const leagueSlug = hasLeague ? slugifyLeague(tip.league!) : null;

  return (
    <div className="pb-24 px-4 pt-24 md:pt-32 max-w-3xl mx-auto">
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "https://protipsbet.com/" },
          { name: tip.isVip ? "VIP Tips" : "Free Tips", url: `https://protipsbet.com/${tip.isVip ? "vip-tips" : "free-tips"}` },
          { name: `${tip.homeTeam} vs ${tip.awayTeam}`, url: pageUrl },
        ]}
      />

      <nav className="text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-emerald-400">Home</Link>
        {" / "}
        <Link href={tip.isVip ? "/vip-tips" : "/free-tips"} className="hover:text-emerald-400">
          {tip.isVip ? "VIP Tips" : "Free Tips"}
        </Link>
        {" / "}
        <span className="text-zinc-300">{tip.homeTeam} vs {tip.awayTeam}</span>
      </nav>

      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {tip.isVip && (
          <span className="inline-flex items-center gap-1 bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2.5 py-1 rounded-md text-[11px] font-black uppercase">
            <Crown size={12} /> VIP
          </span>
        )}
        <StatusBadge status={status} />
        <span className="text-zinc-500 text-xs font-bold flex items-center gap-1.5">
          <Calendar size={12} /> {formatDate(tip.matchDate)} • {formatMatchTime(tip.matchDate)}
        </span>
      </div>

      <h1 className="text-2xl md:text-4xl font-black text-white mb-2 leading-tight">
        {tip.homeTeam} vs {tip.awayTeam}
      </h1>

      {/* Cross-linkovi kon league и market hub - го затвора silo circuit-от од двете страни */}
      <div className="flex flex-wrap gap-x-5 gap-y-1 mb-6">
        {hasLeague && leagueSlug && (
          <Link
            href={`/leagues/${leagueSlug}`}
            className="inline-flex items-center gap-1.5 text-zinc-400 text-sm hover:text-emerald-400 transition-colors"
          >
            <Trophy size={14} />
            All {tip.league} predictions
          </Link>
        )}
        {marketKey && (
          <Link
            href={`/markets/${marketSlug(marketKey)}`}
            className="inline-flex items-center gap-1.5 text-zinc-400 text-sm hover:text-emerald-400 transition-colors"
          >
            <Target size={14} />
            All {MARKET_LABELS[marketKey]} tips
          </Link>
        )}
      </div>

      {tip.tags && (
        <div className="flex flex-wrap gap-2 mb-6">
          {tip.tags.split(",").map((tag) => tag.trim()).filter(Boolean).map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center bg-zinc-900 border border-zinc-800 text-zinc-400 text-xs font-bold px-2.5 py-1 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-zinc-400 text-sm mb-8">
        {hasLeague ? tip.league : "Football"} match prediction and betting tip from ProTipsBet.
      </p>

      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 mb-8">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase mb-1">Our Prediction</p>
            <p className="text-white font-black text-xl">{marketLabel}</p>
          </div>
          <div>
            <p className="text-zinc-500 text-xs font-bold uppercase mb-1 flex items-center gap-1">
              <TrendingUp size={12} /> Odds
            </p>
            <p className="text-white font-black text-xl">@{Number(tip.odds).toFixed(2)}</p>
          </div>
        </div>
      </div>

      {tip.analysis ? (
        <div className="text-zinc-300 text-sm leading-relaxed mb-10">
          <h2 className="text-white font-bold text-base mb-2">Our Analysis</h2>
          <p>{tip.analysis}</p>
        </div>
      ) : (
        <div className="text-zinc-300 text-sm leading-relaxed mb-10">
          <p>
            {status === "pending"
              ? "This match hasn't kicked off yet — check back after full time to see the result."
              : status === "win"
                ? "This prediction was correct — see the full breakdown on our History page."
                : "This prediction didn't land — every result, win or loss, stays public on our History page."}
          </p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href={tip.isVip ? "/vip-tips" : "/free-tips"}
          className="flex-1 text-center bg-emerald-500 text-zinc-950 font-bold text-sm px-6 py-3 rounded-xl hover:bg-emerald-400 transition-colors"
        >
          See Today's {tip.isVip ? "VIP" : "Free"} Picks
        </Link>
        <Link
          href="/history"
          className="flex-1 text-center bg-zinc-900 border border-zinc-800 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors"
        >
          View Full Track Record
        </Link>
      </div>
    </div>
  );
}