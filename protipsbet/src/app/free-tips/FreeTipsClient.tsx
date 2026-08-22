"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, XCircle, Filter, Archive, ChevronDown, ChevronUp } from "lucide-react";
import TipCard from "@/components/TipCard";
import BannerWall from "@/components/BannerWall";
import { FREE_TIPS_BANNERS } from "@/lib/banners";
import { MARKET_LABELS, type Market } from "@/lib/tips-data";
import { getTipStatus, formatMatchTime, formatDate } from "@/lib/tip-format";
import { buildSlug } from "@/lib/prediction-slug";
import { API_BASE } from "@/lib/api";

const FILTERS: { key: Market | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "1X2", label: MARKET_LABELS["1X2"] },
  { key: "BTTS", label: MARKET_LABELS.BTTS },
  { key: "OU25", label: MARKET_LABELS.OU25 },
];

const ARCHIVE_PREVIEW_COUNT = 8;

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

export default function FreeTipsClient({ initialTips }: { initialTips: ApiTip[] }) {
  const [tips, setTips] = useState<ApiTip[]>(initialTips);
  const [filter, setFilter] = useState<Market | "all">("all");
  const [showAllArchive, setShowAllArchive] = useState(false);

  const refetchTips = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/tips`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setTips(data);
    } catch {
      // тивко fail
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(refetchTips, 60000);
    const onFocus = () => refetchTips();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [refetchTips]);

  const allFreeTips = tips.filter((t) => !t.isVip);
  const activeTips = allFreeTips.filter((t) => getTipStatus(t.result) === "pending");

  const filteredActiveTips = activeTips.filter((t) => {
    if (filter === "all") return true;
    const predictionType = String(t.predictionType ?? "").toUpperCase();
    return predictionType.includes(filter);
  });

  const archiveTips = allFreeTips.filter((t) => getTipStatus(t.result) !== "pending");
  const visibleArchiveTips = showAllArchive ? archiveTips : archiveTips.slice(0, ARCHIVE_PREVIEW_COUNT);
  const hiddenArchiveCount = archiveTips.length - ARCHIVE_PREVIEW_COUNT;

  return (
    <div className="pb-24 px-4 pt-24 md:pt-32 max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-5xl font-black text-white mb-3">Free Tips</h1>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Daily free picks, split by market. For higher-odds combos, check out VIP.
        </p>
      </div>

      <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
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

      <motion.div layout className="flex flex-wrap justify-center gap-4 mb-6">
        <AnimatePresence mode="popLayout">
          {filteredActiveTips.map((tip) => (
            <motion.div
              key={tip.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="w-full md:w-[calc(50%-1rem)] max-w-md"
            >
              <Link href={`/predictions/${buildSlug(tip)}`} className="block">
                <TipCard
                  league={tip.league && tip.league !== "Unknown" ? tip.league : "Football"}
                  matchTime={formatMatchTime(tip.matchDate)}
                  homeTeam={tip.homeTeam || "Unknown"}
                  awayTeam={tip.awayTeam || "Unknown"}
                  prediction={tip.predictionType || "No prediction"}
                  odds={Number(tip.odds) || 0}
                  status={getTipStatus(tip.result)}
                  isVip={false}
                />
              </Link>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredActiveTips.length === 0 && (
        <div className="text-center py-16 text-zinc-500 text-sm">No pending tips for this market right now.</div>
      )}

      <BannerWall title="Sponsored" banners={FREE_TIPS_BANNERS} size="small" />

      <div className="mt-16">
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2">
            <Archive size={18} className="text-zinc-500" />
            <h2 className="text-xl font-black text-white">Archive of Past Tips</h2>
          </div>
          {archiveTips.length > 0 && (
            <span className="text-zinc-500 text-xs font-bold">{archiveTips.length} total</span>
          )}
        </div>

        {archiveTips.length === 0 ? (
          <p className="text-zinc-500 text-sm">No completed matches yet.</p>
        ) : (
          <>
            <motion.div layout className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {visibleArchiveTips.map((tip) => (
                  <motion.div
                    key={tip.id}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                  >
                    <Link
                      href={`/predictions/${buildSlug(tip)}`}
                      className={`flex items-center justify-between gap-4 bg-zinc-900/40 border rounded-xl px-4 py-3 hover:bg-zinc-900/70 transition-colors ${
                        getTipStatus(tip.result) === "win" ? "border-emerald-500/20" : "border-red-500/20"
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
                      <span className="text-white font-bold text-sm shrink-0">@ {tip.odds.toFixed(2)}</span>
                      {getTipStatus(tip.result) === "win" ? (
                        <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle size={20} className="text-red-400 shrink-0" />
                      )}
                    </Link>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {archiveTips.length > ARCHIVE_PREVIEW_COUNT && (
              <div className="text-center mt-6">
                <button
                  onClick={() => setShowAllArchive((prev) => !prev)}
                  className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-800 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors"
                >
                  {showAllArchive ? (
                    <>
                      Show Less <ChevronUp size={16} />
                    </>
                  ) : (
                    <>
                      Show {hiddenArchiveCount} More <ChevronDown size={16} />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}