import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, Clock, Trophy } from "lucide-react";
import { getAllTips, isPubliclyRenderable, buildSlug } from "@/lib/predictions";
import { findLeagueBySlug, getDistinctLeagues, slugifyLeague } from "@/lib/league-slug";
import { getTipStatus, formatDate, formatMatchTime } from "@/lib/tip-format";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";

export const revalidate = 300;

export async function generateStaticParams() {
  const tips = await getAllTips();
  const leagues = getDistinctLeagues(tips.filter(isPubliclyRenderable));
  return leagues.map((league) => ({ league: slugifyLeague(league) }));
}

interface Props {
  params: Promise<{ league: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { league: leagueSlug } = await params;
  const tips = await getAllTips();
  const leagueName = findLeagueBySlug(tips.filter(isPubliclyRenderable), leagueSlug);

  if (!leagueName) {
    return { title: "League Not Found | ProTipsBet" };
  }

  const title = `${leagueName} Predictions & Tips`;
  const description = `Daily ${leagueName} football predictions, verified and public. See our upcoming picks and full track record for ${leagueName}.`;

  return {
    title,
    description,
    alternates: { canonical: `https://protipsbet.com/leagues/${leagueSlug}` },
    openGraph: { title: `${title} | ProTipsBet`, description, url: `https://protipsbet.com/leagues/${leagueSlug}` },
  };
}

function StatusIcon({ status }: { status: "pending" | "win" | "loss" }) {
  if (status === "win") return <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />;
  if (status === "loss") return <XCircle size={20} className="text-red-400 shrink-0" />;
  return <Clock size={20} className="text-amber-400 shrink-0" />;
}

export default async function LeaguePage({ params }: Props) {
  const { league: leagueSlug } = await params;
  const tips = await getAllTips();
  const publicTips = tips.filter(isPubliclyRenderable);
  const leagueName = findLeagueBySlug(publicTips, leagueSlug);

  if (!leagueName) notFound();

  const leagueTips = publicTips
    .filter((t) => slugifyLeague(t.league ?? "") === leagueSlug)
    .sort((a, b) => new Date(b.matchDate ?? 0).getTime() - new Date(a.matchDate ?? 0).getTime());

  const pendingTips = leagueTips.filter((t) => getTipStatus(t.result) === "pending");
  const completedTips = leagueTips.filter((t) => getTipStatus(t.result) !== "pending");
  const wins = completedTips.filter((t) => getTipStatus(t.result) === "win").length;
  const winRate = completedTips.length > 0 ? Math.round((wins / completedTips.length) * 100) : null;

  return (
    <div className="pb-24 px-4 pt-24 md:pt-32 max-w-3xl mx-auto">
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "https://protipsbet.com/" },
          { name: "Leagues", url: "https://protipsbet.com/leagues" },
          { name: leagueName, url: `https://protipsbet.com/leagues/${leagueSlug}` },
        ]}
      />

      <nav className="text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-emerald-400">Home</Link>
        {" / "}
        <Link href="/leagues" className="hover:text-emerald-400">Leagues</Link>
        {" / "}
        <span className="text-zinc-300">{leagueName}</span>
      </nav>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <Trophy className="text-emerald-500" size={28} />
          <h1 className="text-2xl md:text-4xl font-black text-white">{leagueName} Predictions</h1>
        </div>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Daily verified predictions for {leagueName}.
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
                    {formatDate(tip.matchDate)} • {formatMatchTime(tip.matchDate)}
                  </p>
                  <p className="text-white font-bold text-sm truncate">
                    {tip.homeTeam} vs {tip.awayTeam}
                  </p>
                </div>
                <span className="text-zinc-300 text-sm font-bold hidden sm:block">{tip.predictionType}</span>
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
          <p className="text-zinc-500 text-sm">No completed {leagueName} predictions yet.</p>
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
                  <span className="text-zinc-300 text-sm font-bold hidden sm:block">{tip.predictionType}</span>
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