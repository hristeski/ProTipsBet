import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, XCircle, CalendarDays } from "lucide-react";
import { getAllTips, buildSlug } from "@/lib/predictions";
import { getTipStatus, formatDate } from "@/lib/tip-format";
import { getISOWeekString, formatWeekLabel } from "@/lib/iso-week";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";

export const revalidate = 3600;

export async function generateStaticParams() {
  const tips = await getAllTips();
  const weeks = new Set<string>();

  for (const tip of tips) {
    const status = getTipStatus(tip.result);
    if ((status === "win" || status === "loss") && tip.matchDate) {
      weeks.add(getISOWeekString(new Date(tip.matchDate)));
    }
  }

  return Array.from(weeks).map((week) => ({ week }));
}

interface Props {
  params: Promise<{ week: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { week } = await params;
  const label = formatWeekLabel(week);

  return {
    title: `Results: ${label}`,
    description: `Every prediction we published for the week of ${label} — win or loss, fully verified.`,
    alternates: { canonical: `https://protipsbet.com/results/${week}` },
  };
}

export default async function WeeklyResultsPage({ params }: Props) {
  const { week } = await params;
  const tips = await getAllTips();

  const weekTips = tips.filter((t) => {
    const status = getTipStatus(t.result);
    if (!(status === "win" || status === "loss") || !t.matchDate) return false;
    return getISOWeekString(new Date(t.matchDate)) === week;
  });

  if (weekTips.length === 0) notFound();

  const wins = weekTips.filter((t) => getTipStatus(t.result) === "win").length;
  const winRate = Math.round((wins / weekTips.length) * 100);
  const label = formatWeekLabel(week);
  const pageUrl = `https://protipsbet.com/results/${week}`;

  return (
    <div className="pb-24 px-4 pt-24 md:pt-32 max-w-2xl mx-auto">
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "https://protipsbet.com/" },
          { name: "Results", url: "https://protipsbet.com/results" },
          { name: label, url: pageUrl },
        ]}
      />

      <nav className="text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-emerald-400">Home</Link>
        {" / "}
        <Link href="/results" className="hover:text-emerald-400">Results</Link>
        {" / "}
        <span className="text-zinc-300">{label}</span>
      </nav>

      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <CalendarDays className="text-emerald-500" size={28} />
          <h1 className="text-2xl md:text-3xl font-black text-white">Results: {label}</h1>
        </div>
        <p className="text-zinc-400 text-sm">
          <span className="text-emerald-400 font-bold">{wins}/{weekTips.length}</span> correct — {winRate}% win rate this week
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {weekTips.map((tip) => {
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
                <p className="text-xs text-zinc-500 mb-0.5">
                  {formatDate(tip.matchDate)} • {tip.league && tip.league !== "Unknown" ? tip.league : "Football"}
                </p>
                <p className="text-white font-bold text-sm truncate">
                  {tip.homeTeam} vs {tip.awayTeam}
                </p>
              </div>
              <span className="text-zinc-300 text-sm font-bold hidden sm:block">{tip.predictionType}</span>
              <span className="text-white font-bold text-sm shrink-0">@ {Number(tip.odds).toFixed(2)}</span>
              {status === "win" ? (
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              ) : (
                <XCircle size={20} className="text-red-400 shrink-0" />
              )}
            </Link>
          );
        })}
      </div>

      <div className="text-center mt-10">
        <Link href="/results" className="text-emerald-400 text-sm font-bold hover:underline">
          ← All weekly results
        </Link>
      </div>
    </div>
  );
}