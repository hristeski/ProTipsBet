"use client";

import { useState } from "react";
import { CheckCircle, TrendingUp, ImageIcon, Trophy, Calendar, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BannerWall from "@/components/BannerWall";
import { HISTORY_BANNERS } from "@/lib/banners";
import { API_BASE } from "@/lib/api";

export default function HistoryClient({ initialTickets }: { initialTickets: any[] }) {
  const [tickets] = useState<any[]>(initialTickets);
  const [filter, setFilter] = useState<"all" | "vip" | "premium" | "correct score">("all");
  const [openImage, setOpenImage] = useState<string | null>(null);

  const filtered = tickets.filter((t) => {
    if (filter === "all") return true;

    const desc = (t.description || "").toLowerCase();

    if (filter === "vip") return desc.includes("vip") || t.isVip;
    if (filter === "premium") return desc.includes("premium");
    if (filter === "correct score") return desc.includes("correct score") || desc.includes("cs");

    return true;
  });

  const totalProfit = tickets.reduce((acc, t) => acc + (t.totalOdds > 0 ? t.totalOdds - 1 : 0), 0).toFixed(2);

  const getBadge = (desc: string, isVip: boolean) => {
    const d = (desc || "").toLowerCase();
    if (d.includes("correct score") || d.includes("cs")) return { label: "CORRECT SCORE", color: "bg-purple-500" };
    if (d.includes("premium")) return { label: "PREMIUM", color: "bg-blue-500" };
    if (isVip || d.includes("vip")) return { label: "VIP", color: "bg-amber-500" };
    return { label: "WINNER", color: "bg-emerald-500" };
  };

  return (
    <div className="pb-24 px-4 sm:px-6 pt-24 md:pt-32 max-w-7xl mx-auto min-h-screen relative">
      <div className="mb-10 text-center md:text-left flex flex-col md:flex-row justify-between gap-8 items-end border-b border-neutral-800 pb-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
            Verified <span className="text-emerald-500">History</span>
          </h1>
          <p className="text-neutral-400 text-lg">
            100% transparent track record. Every single match, tip, and odd is publicly verified. We let our results speak for us.
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex-1 md:w-48 text-center md:text-left shadow-lg">
            <p className="text-neutral-500 text-xs font-bold uppercase mb-1 flex items-center justify-center md:justify-start gap-1">
              <TrendingUp size={14} className="text-emerald-500" /> Units Profit
            </p>
            <p className="text-3xl font-black text-white">+{totalProfit}</p>
          </div>
          <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex-1 md:w-48 text-center md:text-left shadow-lg">
            <p className="text-neutral-500 text-xs font-bold uppercase mb-1 flex items-center justify-center md:justify-start gap-1">
              <CheckCircle size={14} className="text-emerald-500" /> Win Rate
            </p>
            <p className="text-3xl font-black text-white">100%</p>
          </div>
        </div>
      </div>

      <div className="flex justify-center md:justify-start gap-2 md:gap-3 mb-10 flex-wrap">
        {(["all", "vip", "premium", "correct score"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-5 py-2.5 rounded-lg text-sm font-black transition-all uppercase tracking-wide ${
              filter === f
                ? "bg-emerald-500 text-neutral-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
                : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800"
            }`}
          >
            {f === "all" ? "All Tickets" : f}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <AnimatePresence>
          {filtered.map((ticket) => {
            const badge = getBadge(ticket.description, ticket.isVip);

            return (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                key={ticket.id}
                className="bg-[#0a0a0a] border border-neutral-800 rounded-2xl overflow-hidden flex flex-col relative shadow-xl"
              >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-emerald-500/5 rotate-[-15deg] pointer-events-none select-none">
                  WON
                </div>

                <div className="p-5 border-b border-neutral-800 bg-neutral-900/50 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 relative z-10">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span className={`${badge.color} text-black px-2.5 py-1 rounded text-xs font-black uppercase flex items-center gap-1.5`}>
                        <Trophy size={12}/> {badge.label}
                      </span>
                      <span className="text-neutral-500 text-xs font-bold flex items-center gap-1.5">
                        <Calendar size={12}/> {new Date(ticket.matchDate).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-white leading-snug">{ticket.description}</h3>
                  </div>
                  <div className="text-left sm:text-right bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-4 py-2.5 self-start sm:self-auto">
                    <p className="text-emerald-500 text-xs font-black uppercase tracking-wider mb-1">Total Odds</p>
                    <p className="text-2xl font-black text-white">@{ticket.totalOdds}</p>
                  </div>
                </div>

                <div className="p-5 flex-grow relative z-10">
                  {ticket.legs && ticket.legs.length > 0 ? (
                    <div className="w-full">
                      <div className="grid grid-cols-12 gap-2 text-xs font-bold text-neutral-500 uppercase tracking-wider mb-3 pb-2 border-b border-neutral-800/50">
                        <div className="col-span-6">Match</div>
                        <div className="col-span-3 text-center">Tip</div>
                        <div className="col-span-3 text-right">Odds</div>
                      </div>

                      <div className="space-y-3">
                        {ticket.legs.map((leg: any, i: number) => (
                          <div key={i} className="grid grid-cols-12 gap-2 items-center bg-neutral-900/30 p-2.5 rounded-lg border border-neutral-800/50 hover:bg-neutral-900 transition-colors">
                            <div className="col-span-6">
                              <p className="text-white font-bold text-sm truncate">{leg.homeTeam}</p>
                              <p className="text-neutral-400 font-medium text-sm truncate">{leg.awayTeam}</p>
                            </div>
                            <div className="col-span-3 flex justify-center">
                              <span className="bg-emerald-500/20 text-emerald-400 font-black text-sm px-3 py-1 rounded w-full text-center">
                                {leg.prediction}
                              </span>
                            </div>
                            <div className="col-span-3 text-right">
                              <span className="text-white font-bold">@{leg.odds}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-neutral-600 font-medium">
                      No match breakdown available.
                    </div>
                  )}
                </div>

                <div className="p-4 border-t border-neutral-800 bg-neutral-950/50 relative z-10">
                  <button
                    onClick={() => setOpenImage(`${API_BASE}${ticket.imageUrl}`)}
                    className="w-full flex items-center justify-center gap-2 text-sm font-bold text-neutral-400 hover:text-white py-2 hover:bg-neutral-900 rounded-lg transition-all uppercase"
                  >
                    <ImageIcon size={16} className="text-emerald-500"/>
                    VIEW TICKET
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {openImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenImage(null)} className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <button className="absolute top-6 right-6 text-white bg-neutral-800 p-2 rounded-full hover:bg-neutral-700 transition-colors"><X size={24}/></button>
            {/* eslint-disable-next-line */}
            <img src={openImage} className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-neutral-800" alt="Winning Ticket Proof" />
          </motion.div>
        )}
      </AnimatePresence>

      <BannerWall title="Sponsored" banners={HISTORY_BANNERS} />
    </div>
  );
}