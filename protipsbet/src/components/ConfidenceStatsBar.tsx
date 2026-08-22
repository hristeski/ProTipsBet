import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface ApiTip {
  result?: string;
}

async function getStats() {
  try {
    const res = await fetch(`${API_BASE}/api/tips`, { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data: ApiTip[] = await res.json();
    if (!Array.isArray(data)) return null;

    const completed = data.filter((t) => {
      const r = String(t.result ?? "").toLowerCase();
      return r === "win" || r === "loss";
    });
    const wins = completed.filter((t) => String(t.result).toLowerCase() === "win");

    if (completed.length === 0) return null;

    const winRate = Math.round((wins.length / completed.length) * 100);
    return { winRate, total: completed.length };
  } catch {
    return null;
  }
}

export default async function ConfidenceStatsBar() {
  const stats = await getStats();
  if (!stats) return null;

  return (
    <section className="px-6 py-6">
      <Link
        href="/history"
        className="max-w-4xl mx-auto flex items-center justify-center gap-3 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl px-6 py-4 hover:bg-emerald-500/10 transition-colors"
      >
        <ShieldCheck className="text-emerald-400 shrink-0" size={22} />
        <p className="text-sm md:text-base font-bold text-white text-center">
          <span className="text-emerald-400">{stats.winRate}% Win Rate</span> across{" "}
          <span className="text-emerald-400">{stats.total} verified predictions</span> — see the full public track record
        </p>
      </Link>
    </section>
  );
}