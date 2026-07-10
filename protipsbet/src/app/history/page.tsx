"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, TrendingUp, Filter, Calendar, Camera, Trophy, Zap, X, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BannerWall from "@/components/BannerWall";
import { HISTORY_BANNERS } from "@/lib/banners";
import { API_BASE } from "@/lib/api";

interface Leg {
  id: number;
  league?: string;
  matchDate: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  odds: number;
}

interface HistoryTicket {
  id: number;
  description: string;
  totalOdds: number;
  matchDate: string;
  isVip: boolean;
  imageUrl: string;
  legs: Leg[];
}

const formatDate = (value: string) =>
  new Date(value).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

const formatTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "TBD";
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

export default function HistoryPage() {
  const [tickets, setTickets] = useState<HistoryTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "vip" | "free">("all");
  const [openImage, setOpenImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/tips/tickets`);
        if (res.ok) {
          const data = await res.json();
          setTickets(Array.isArray(data) ? data : []);
        }
      } catch {
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filteredTickets = tickets.filter((t) => {
    if (filter === "vip") return t.isVip;
    if (filter === "free") return !t.isVip;
    return true;
  });

  const totalProfit = tickets.reduce((acc, t) => acc + (t.totalOdds > 0 ? t.totalOdds - 1 : 0), 0).toFixed(1);

  return (
    <div className="pb-24 px-6 pt-24 md:pt-32 max-w-7xl mx-auto min-h-screen relative">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Verified History</h1>
          <p className="text-zinc-400 text-base md:text-lg">
            100% transparent tracking of every winning ticket — full match breakdown, not just a screenshot.
          </p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-center md:justify-end">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 md:p-6 min-w-[140px] text-left">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp size={16} className="text-emerald-400" /> Total Profit
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">+{totalProfit} U</div>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 md:p-6 min-w-[140px] text-left">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 size={16} className="text-emerald-400" /> Tickets Won
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">{tickets.length}</div>
          </div>
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-2 text-zinc-500 mr-2">
          <Filter size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Filter:</span>
        </div>
        {(["all", "vip", "free"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap capitalize ${
              filter === f ? "bg-white text-zinc-950 shadow-md" : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
            }`}
          >
            {f === "all" ? "All Tickets" : f}
          </button>
        ))}
      </motion.div>

      {loading ? (
        <div className="py-24 flex justify-center items-center">
          <Loader2 className="animate-spin text-emerald-500" size={48} />
        </div>
      ) : filteredTickets.length === 0 ? (
        <div className="text-center py-24 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed text-zinc-500 font-medium max-w-2xl mx-auto">
          <Filter size={48} className="mx-auto mb-4 opacity-50 text-zinc-600" />
          <h3 className="text-xl text-white font-bold mb-2">No tickets found</h3>
          <p>Try a different filter, or check back after the next winning slip is posted.</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <AnimatePresence mode="popLayout">
            {filteredTickets.map((ticket, index) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                key={ticket.id}
                className="flex flex-col h-full bg-zinc-900/40 border border-emerald-500/30 rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:bg-zinc-900/70 transition-all"
              >
                <div className="flex justify-between items-start border-b border-zinc-800 pb-5 mb-5">
                  <div className="flex gap-4 items-center">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400">
                      {ticket.isVip ? <Trophy size={24} /> : <Zap size={24} />}
                    </div>
                    <div>
                      <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">
                        {ticket.isVip ? "VIP" : "Free"} · {ticket.description}
                      </span>
                      <p className="text-lg font-bold text-white mt-1 flex items-center gap-1.5">
                        <Calendar size={14} className="text-zinc-500" /> {formatDate(ticket.matchDate)}
                      </p>
                    </div>
                  </div>
                  <div className="px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    <CheckCircle2 size={16} /> Win
                  </div>
                </div>

                {/* MATCH LEGS — league, time, teams, prediction, odds */}
                <div className="space-y-2.5 mb-6 flex-grow">
                  {ticket.legs && ticket.legs.length > 0 ? (
                    ticket.legs.map((leg) => (
                      <div key={leg.id} className="bg-zinc-950/50 p-4 rounded-2xl border border-zinc-900">
                        <div className="flex justify-between items-center mb-1.5">
                          <span className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
                            {leg.league || "Football"} · {formatTime(leg.matchDate)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-zinc-200 font-bold text-sm">
                            {leg.homeTeam} vs {leg.awayTeam}
                          </span>
                          <div className="flex items-center gap-2">
                            <span className="text-emerald-400 font-bold text-sm">{leg.prediction}</span>
                            <span className="text-white font-black text-sm">@{leg.odds.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-zinc-500 text-sm text-center py-4">No match breakdown available for this ticket.</p>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-5 border-t border-zinc-800 gap-4 mt-auto">
                  <button
                    onClick={() => setOpenImage(`${API_BASE}${ticket.imageUrl}`)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-colors text-sm font-bold text-white group w-full sm:w-auto justify-center"
                  >
                    <Camera size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                    View Winning Slip
                  </button>

                  <div className="flex flex-col items-center sm:items-end">
                    <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Odds</span>
                    <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                      @ {ticket.totalOdds.toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      <BannerWall title="Sponsored" banners={HISTORY_BANNERS} />

      <AnimatePresence>
        {openImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpenImage(null)}
            className="fixed inset-0 z-[100] bg-zinc-950/90 backdrop-blur-lg flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", bounce: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl"
            >
              <button
                onClick={() => setOpenImage(null)}
                aria-label="Close"
                className="absolute -top-12 right-0 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={openImage}
                alt="Winning Ticket Proof"
                className="w-full max-h-[80vh] rounded-3xl border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
