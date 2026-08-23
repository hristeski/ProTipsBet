import type { Metadata } from "next";
import Link from "next/link";
import { Trophy, ChevronRight } from "lucide-react";
import { getAllTips, isPubliclyRenderable } from "@/lib/predictions";
import { getDistinctLeagues, slugifyLeague } from "@/lib/league-slug";
import { getTipStatus } from "@/lib/tip-format";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Football Predictions by League",
  description: "Browse our verified football predictions organized by league — Premier League, Champions League, and more.",
  alternates: {
    canonical: "https://protipsbet.com/leagues",
  },
};

export default async function LeaguesIndexPage() {
  const tips = await getAllTips();
  const publicTips = tips.filter(isPubliclyRenderable);
  const leagues = getDistinctLeagues(publicTips);

  const leagueStats = leagues.map((league) => {
    const slug = slugifyLeague(league);
    const leagueTips = publicTips.filter((t) => slugifyLeague(t.league ?? "") === slug);
    const pendingCount = leagueTips.filter((t) => getTipStatus(t.result) === "pending").length;
    const totalCount = leagueTips.length;
    return { league, slug, pendingCount, totalCount };
  });

  return (
    <div className="pb-24 px-4 pt-24 md:pt-32 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3">Predictions by League</h1>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Browse our verified predictions organized by competition.
        </p>
      </div>

      {leagueStats.length === 0 ? (
        <p className="text-center text-zinc-500 text-sm">No leagues available yet — check back soon.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {leagueStats.map(({ league, slug, pendingCount, totalCount }) => (
            <Link
              key={slug}
              href={`/leagues/${slug}`}
              className="flex items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-xl px-5 py-4 hover:bg-zinc-900/70 hover:border-emerald-500/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="bg-zinc-950 p-2.5 rounded-lg border border-zinc-800">
                  <Trophy size={18} className="text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-bold text-sm">{league}</p>
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
      )}
    </div>
  );
}