"use client";

import Link from "next/link";
import { ArrowRight, Lock, Crown, Clock, Zap, TrendingUp, Sparkles } from "lucide-react";
import TipCard from "@/components/TipCard";
import { getTipStatus, formatMatchTime, formatDate } from "@/lib/tip-format";

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

interface Props {
  todayTips: ApiTip[];
  yesterdayTips: ApiTip[];
}

export default function FreePicksSection({ todayTips, yesterdayTips }: Props) {
  const todayLabel = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" });

  return (
    <section id="free-picks" className="px-6 pb-24 max-w-4xl mx-auto">
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 mb-3">
          <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <p className="text-emerald-400 text-xs font-black uppercase tracking-widest">
            Today · {todayLabel}
          </p>
        </div>
        <h2 className="text-3xl font-black text-white mb-2">Today's Free Picks</h2>
        <p className="text-zinc-400 text-sm mb-3">Test our accuracy. For high-confidence combos, upgrade to VIP.</p>
        {todayTips.length > 0 && (
          <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
            <Zap size={12} /> {todayTips.length} {todayTips.length === 1 ? "Pick" : "Picks"} Live Now
          </span>
        )}
      </div>

      {todayTips.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-4 mb-4">
          {todayTips.map((tip) => (
            <div key={tip.id} className="w-full md:w-[calc(50%-0.5rem)]">
              <TipCard
                league={tip.league && tip.league !== "Unknown" ? tip.league : "Football"}
                matchTime={formatMatchTime(tip.matchDate)}
                homeTeam={tip.homeTeam}
                awayTeam={tip.awayTeam}
                prediction={tip.predictionType || "No prediction"}
                odds={Number(tip.odds) || 0}
                status={getTipStatus(tip.result)}
                isVip={false}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 border border-zinc-800 border-dashed rounded-2xl text-zinc-400 text-sm mb-4 flex flex-col items-center gap-3">
          <Clock size={24} className="text-emerald-400" />
          <p className="font-bold text-white">Today's matches are being set up</p>
          <p className="text-zinc-500 text-xs max-w-xs">
            We usually publish new picks around midday. Check back soon, or browse yesterday's results below.
          </p>
        </div>
      )}

      <div className="text-center mb-16">
        <Link href="/free-tips" className="text-emerald-400 text-sm font-bold hover:underline inline-flex items-center gap-1">
          All free picks + archive <ArrowRight size={14} />
        </Link>
      </div>

      {yesterdayTips.length > 0 && (
        <div className="mb-10">
          <h3 className="text-lg font-black text-white mb-4 text-center">Yesterday's Free Picks</h3>
          <div className="flex flex-col gap-3">
            {yesterdayTips.map((tip) => (
              <div
                key={tip.id}
                className={`flex items-center justify-between gap-4 bg-zinc-900/40 border rounded-xl px-4 py-3 ${
                  getTipStatus(tip.result) === "win" ? "border-emerald-500/20" : "border-red-500/20"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-500 mb-0.5">
                    {formatDate(tip.matchDate)} • {tip.league && tip.league !== "Unknown" ? tip.league : "Football"}
                  </p>
                  <p className="text-white font-bold text-sm truncate">{tip.homeTeam} vs {tip.awayTeam}</p>
                </div>
                <span className="text-zinc-300 text-sm font-bold hidden sm:block">{tip.predictionType}</span>
                <span className="text-white font-bold text-sm shrink-0">@ {Number(tip.odds).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/15 via-zinc-900 to-zinc-900 border border-amber-500/30 rounded-3xl p-6 md:p-8">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 blur-[80px] rounded-full pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-amber-500 text-zinc-950 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
              <Crown size={12} /> VIP Only
            </span>
          </div>

          <h3 className="text-2xl md:text-3xl font-black text-white text-center mb-2">
            Unlock Today's Premium Matches
          </h3>
          <p className="text-zinc-400 text-sm text-center max-w-md mx-auto mb-6">
            While others get 1-2 free tips, VIP members unlock our full daily lineup — higher odds, deeper analysis, bigger profit.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6 max-w-xl mx-auto">
            {[
              { icon: TrendingUp, text: "Higher-odds combos" },
              { icon: Sparkles, text: "Deep match analysis" },
              { icon: Lock, text: "Exclusive daily access" },
            ].map((f, i) => (
              <div key={i} className="flex flex-col items-center text-center gap-2 bg-zinc-950/50 border border-zinc-800 rounded-xl p-3">
                <f.icon size={18} className="text-amber-400" />
                <span className="text-zinc-300 text-xs font-bold">{f.text}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3">
            <Link
              href="/vip-tips"
              className="inline-flex items-center gap-2 px-8 py-4 bg-amber-500 text-zinc-950 font-black text-base rounded-xl hover:bg-amber-400 transition-all hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(245,158,11,0.3)]"
            >
              <Crown size={20} /> Unlock VIP Access
            </Link>
            <p className="text-zinc-500 text-xs">Daily, Weekly & Monthly plans available</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
        <Link href="/vip-tips" className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors text-center">
          Previous VIP Tickets
        </Link>
        <Link href="/history" className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 text-white text-sm font-bold rounded-xl hover:bg-zinc-800 transition-colors text-center">
          Previous Free Tickets
        </Link>
      </div>
    </section>
  );
}