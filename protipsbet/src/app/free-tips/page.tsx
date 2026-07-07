"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Filter, Archive } from "lucide-react";
import TipCard from "@/components/TipCard";
import BannerWall from "@/components/BannerWall";
import { FREE_TIPS_BANNERS } from "@/lib/banners";
import { TODAY_FREE_TIPS, FREE_TIPS_ARCHIVE, MARKET_LABELS, type Market } from "@/lib/tips-data";

const FILTERS: { key: Market | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "1X2", label: MARKET_LABELS["1X2"] },
  { key: "BTTS", label: MARKET_LABELS.BTTS },
  { key: "OU25", label: MARKET_LABELS.OU25 },
];

export default function FreeTipsPage() {
  const [filter, setFilter] = useState<Market | "all">("all");

  const filteredTips = TODAY_FREE_TIPS.filter((t) => filter === "all" || t.market === filter);

  return (
    <div className="pb-24 px-4 pt-24 md:pt-32 max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3">Free Tips</h1>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Daily free picks, split by market. For higher-odds combos, check out VIP.
        </p>
      </div>

      {/* MARKET FILTERS */}
      <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
        <Filter size={16} className="text-zinc-500 shrink-0" />
        {FILTERS.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              filter === f.key
                ? "bg-emerald-500 text-zinc-950"
                : "bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* TODAY'S TIPS */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <AnimatePresence mode="popLayout">
          {filteredTips.map((tip) => (
            <motion.div key={tip.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <TipCard
                league={`${tip.league} • ${MARKET_LABELS[tip.market]}`}
                matchTime={tip.matchTime}
                homeTeam={tip.homeTeam}
                awayTeam={tip.awayTeam}
                prediction={tip.prediction}
                odds={tip.odds}
                status={tip.status}
                isVip={false}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredTips.length === 0 && (
        <div className="text-center py-16 text-zinc-500 text-sm">No tips for this market today.</div>
      )}

      <BannerWall title="Sponsored" banners={FREE_TIPS_BANNERS} size="small" />

      {/* ARCHIVE */}
      <div className="mt-16">
        <div className="flex items-center gap-2 mb-6">
          <Archive size={18} className="text-zinc-500" />
          <h2 className="text-xl font-black text-white">Archive of Past Tips</h2>
        </div>
        <div className="flex flex-col gap-3">
          {FREE_TIPS_ARCHIVE.map((tip) => (
            <div
              key={tip.id}
              className={`flex items-center justify-between gap-4 bg-zinc-900/40 border rounded-xl px-4 py-3 ${
                tip.status === "win" ? "border-emerald-500/20" : "border-red-500/20"
              }`}
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs text-zinc-500 mb-0.5">{tip.date} • {tip.league} • {MARKET_LABELS[tip.market]}</p>
                <p className="text-white font-bold text-sm truncate">{tip.homeTeam} vs {tip.awayTeam}</p>
              </div>
              <span className="text-zinc-300 text-sm font-bold hidden sm:block">{tip.prediction}</span>
              <span className="text-white font-bold text-sm shrink-0">@ {tip.odds.toFixed(2)}</span>
              {tip.status === "win" ? (
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              ) : (
                <XCircle size={20} className="text-red-400 shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}