import type { Metadata } from "next";
import Link from "next/link";
import { CalendarDays, ChevronRight } from "lucide-react";
import { getAllTips } from "@/lib/predictions";
import { getTipStatus } from "@/lib/tip-format";
import { getISOWeekString, formatWeekLabel } from "@/lib/iso-week";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Weekly Results Archive",
  description: "Week-by-week breakdown of every verified prediction we've published, win or loss.",
  alternates: { canonical: "https://protipsbet.com/results" },
};

export default async function ResultsIndexPage() {
  const tips = await getAllTips();
  const completed = tips.filter((t) => {
    const status = getTipStatus(t.result);
    return (status === "win" || status === "loss") && t.matchDate;
  });

  const weekMap = new Map<string, { wins: number; total: number }>();
  for (const tip of completed) {
    const week = getISOWeekString(new Date(tip.matchDate!));
    const entry = weekMap.get(week) ?? { wins: 0, total: 0 };
    entry.total += 1;
    if (getTipStatus(tip.result) === "win") entry.wins += 1;
    weekMap.set(week, entry);
  }

  const weeks = Array.from(weekMap.entries())
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([week, stats]) => ({
      week,
      label: formatWeekLabel(week),
      winRate: Math.round((stats.wins / stats.total) * 100),
      total: stats.total,
    }));

  return (
    <div className="pb-24 px-4 pt-24 md:pt-32 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <CalendarDays className="text-emerald-500" size={28} />
          <h1 className="text-2xl md:text-4xl font-black text-white">Weekly Results Archive</h1>
        </div>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Every week, every result — win or loss, publicly archived.
        </p>
      </div>

      {weeks.length === 0 ? (
        <p className="text-center text-zinc-500 text-sm">No completed weeks yet — check back soon.</p>
      ) : (
        <div className="flex flex-col gap-3">
          {weeks.map(({ week, label, winRate, total }) => (
            <Link
              key={week}
              href={`/results/${week}`}
              className="flex items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-xl px-5 py-4 hover:bg-zinc-900/70 hover:border-emerald-500/30 transition-colors"
            >
              <div>
                <p className="text-white font-bold text-sm">{label}</p>
                <p className="text-zinc-500 text-xs">{total} prediction{total === 1 ? "" : "s"}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-emerald-400 font-black text-sm">{winRate}% Win Rate</span>
                <ChevronRight size={18} className="text-zinc-600 shrink-0" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}