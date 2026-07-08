// FILE DESTINATION: src/app/history/page.tsx

"use client";

import { useState } from "react";
import { CheckCircle2, XCircle, TrendingUp, Filter, Calendar, Camera, PlayCircle, Trophy, Target, Zap, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BannerWall from "@/components/BannerWall";
import { HISTORY_BANNERS } from "@/lib/banners";

type Proof = { type: "image"; src: string } | { type: "video"; youtubeId: string } | null;

interface HistoryTicket {
  id: string;
  date: string;
  type: string;
  totalOdds: number;
  status: "win" | "loss";
  proof: Proof;
  icon: typeof Trophy;
  matches: { name: string; pick: string; status: "win" | "loss" }[];
}

export default function HistoryPage() {
  const [filter, setFilter] = useState<"all" | "win" | "loss">("all");
  const [openProof, setOpenProof] = useState<Proof>(null);

  const historyTickets: HistoryTicket[] = [
    {
      id: "TKT-890",
      date: "July 7, 2026",
      type: "VIP Mega Accumulator",
      totalOdds: 12.50,
      status: "win",
      proof: { type: "video", youtubeId: "dQw4w9WgXcQ" },
      icon: Trophy,
      matches: [
        { name: "Argentina vs France", pick: "BTTS - Yes", status: "win" },
        { name: "Brazil vs Croatia", pick: "1 & Over 2.5", status: "win" },
        { name: "Spain vs Portugal", pick: "Over 2.5 Goals", status: "win" },
        { name: "England vs Germany", pick: "1X & Under 3.5", status: "win" },
      ],
    },
    {
      id: "TKT-889",
      date: "July 6, 2026",
      type: "VIP Premium Single",
      totalOdds: 2.85,
      status: "win",
      proof: { type: "image", src: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?q=80&w=800&auto=format&fit=crop" },
      icon: Target,
      matches: [{ name: "Netherlands vs Italy", pick: "Netherlands (Asian Handicap -1)", status: "win" }],
    },
    {
      id: "TKT-888",
      date: "July 5, 2026",
      type: "Free Pick",
      totalOdds: 1.85,
      status: "win",
      proof: null,
      icon: Zap,
      matches: [{ name: "Belgium vs Denmark", pick: "Over 2.5 Goals", status: "win" }],
    },
    {
      id: "TKT-887",
      date: "July 4, 2026",
      type: "VIP Combo",
      totalOdds: 3.40,
      status: "loss",
      proof: null,
      icon: Target,
      matches: [
        { name: "Uruguay vs Colombia", pick: "1X & Under 3.5", status: "win" },
        { name: "USA vs Mexico", pick: "BTTS - Yes", status: "loss" },
      ],
    },
    {
      id: "TKT-886",
      date: "July 2, 2026",
      type: "VIP Premium Single",
      totalOdds: 2.40,
      status: "win",
      proof: { type: "image", src: "https://images.unsplash.com/photo-1518605368461-1e12522231ce?q=80&w=800&auto=format&fit=crop" },
      icon: Target,
      matches: [{ name: "Japan vs South Korea", pick: "Draw (X)", status: "win" }],
    },
    {
      id: "TKT-885",
      date: "June 29, 2026",
      type: "VIP Combo",
      totalOdds: 4.15,
      status: "win",
      proof: null,
      icon: Trophy,
      matches: [
        { name: "Morocco vs Egypt", pick: "Under 2.5", status: "win" },
        { name: "Senegal vs Nigeria", pick: "1 & BTTS - Yes", status: "win" },
      ],
    },
  ];

  const filteredTickets = historyTickets.filter((ticket) => filter === "all" || ticket.status === filter);

  return (
    <div className="pb-24 px-6 pt-24 md:pt-32 max-w-7xl mx-auto min-h-screen relative">

      {/* 1. HEADER & STATS */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center md:text-left flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Verified History</h1>
          <p className="text-zinc-400 text-base md:text-lg">
            100% transparent tracking of all our VIP and Free picks. We log every single win and loss so you can calculate your exact expected ROI.
          </p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-4 justify-center md:justify-end">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 md:p-6 min-w-[140px] text-left">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
              <TrendingUp size={16} className="text-emerald-400" /> Total Profit
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">+124.5 U</div>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 md:p-6 min-w-[140px] text-left">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
              <CheckCircle2 size={16} className="text-emerald-400" /> Win Rate
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">78.5%</div>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 md:p-6 min-w-[140px] text-left hidden sm:block">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">
              <Calendar size={16} className="text-emerald-400" /> Tracked Since
            </div>
            <div className="text-2xl md:text-3xl font-black text-white">Jan &apos;26</div>
          </div>
        </div>
      </motion.div>

      {/* 2. FILTERS */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="flex items-center gap-3 mb-10 overflow-x-auto pb-4 border-b border-zinc-800/50">
        <div className="flex items-center gap-2 text-zinc-500 mr-2">
          <Filter size={18} /> <span className="text-sm font-bold uppercase tracking-wider">Filter Results:</span>
        </div>
        <button
          onClick={() => setFilter("all")}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
            filter === "all" ? "bg-white text-zinc-950 shadow-md" : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
          }`}
        >
          All Tickets
        </button>
        <button
          onClick={() => setFilter("win")}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            filter === "win" ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.1)]" : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
          }`}
        >
          Wins Only
        </button>
        <button
          onClick={() => setFilter("loss")}
          className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex items-center gap-2 ${
            filter === "loss" ? "bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]" : "bg-zinc-900/50 text-zinc-400 hover:bg-zinc-800 border border-zinc-800"
          }`}
        >
          Losses Only
        </button>
      </motion.div>

      {/* 3. TICKET LIST */}
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
              className={`flex flex-col h-full bg-zinc-900/40 border rounded-3xl p-6 md:p-8 backdrop-blur-sm hover:bg-zinc-900/70 transition-all ${
                ticket.status === "win" ? "border-emerald-500/30 hover:shadow-[0_0_30px_rgba(16,185,129,0.05)]" : "border-red-500/20 hover:shadow-[0_0_30px_rgba(239,68,68,0.05)]"
              }`}
            >
              <div className="flex justify-between items-start border-b border-zinc-800 pb-5 mb-5">
                <div className="flex gap-4 items-center">
                  <div className={`p-3 rounded-2xl ${ticket.status === "win" ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-400"}`}>
                    <ticket.icon size={24} />
                  </div>
                  <div>
                    <span className="text-xs font-black text-zinc-500 uppercase tracking-widest">{ticket.id} • {ticket.type}</span>
                    <p className="text-lg font-bold text-white mt-1">{ticket.date}</p>
                  </div>
                </div>
                <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-2 ${
                  ticket.status === "win" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}>
                  {ticket.status === "win" ? <CheckCircle2 size={16} /> : <XCircle size={16} />}
                  {ticket.status}
                </div>
              </div>

              <div className="space-y-3 mb-6 flex-grow">
                {ticket.matches.map((match, idx) => (
                  <div key={idx} className="flex flex-col sm:flex-row sm:justify-between sm:items-center text-sm bg-zinc-950/50 p-4 rounded-2xl border border-zinc-900 gap-3 group">
                    <span className="text-zinc-300 font-medium group-hover:text-white transition-colors">{match.name}</span>
                    <div className="flex items-center justify-between sm:justify-end gap-4 min-w-[200px]">
                      <span className="font-bold text-white">{match.pick}</span>
                      {match.status === "win" ? (
                        <CheckCircle2 size={18} className="text-emerald-400" />
                      ) : (
                        <XCircle size={18} className="text-red-400" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center pt-5 border-t border-zinc-800 gap-4 mt-auto">
                <div className="flex-1">
                  {ticket.proof ? (
                    <button
                      onClick={() => setOpenProof(ticket.proof)}
                      className="flex items-center gap-2 px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-xl transition-colors text-sm font-bold text-white group w-full sm:w-auto justify-center"
                    >
                      {ticket.proof.type === "video" ? (
                        <PlayCircle size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                      ) : (
                        <Camera size={18} className="text-emerald-400 group-hover:scale-110 transition-transform" />
                      )}
                      {ticket.proof.type === "video" ? "Watch Proof" : "View Winning Slip"}
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-zinc-600 uppercase tracking-widest flex items-center justify-center sm:justify-start h-full">System Verified</span>
                  )}
                </div>

                <div className="flex flex-col items-center sm:items-end bg-zinc-950/50 sm:bg-transparent p-3 sm:p-0 rounded-xl border sm:border-none border-zinc-900">
                  <span className="text-xs font-bold text-zinc-500 uppercase tracking-widest">Total Odds</span>
                  <span className={`text-3xl font-black ${ticket.status === "win" ? "text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400" : "text-white"}`}>
                    @ {ticket.totalOdds.toFixed(2)}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredTickets.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-24 bg-zinc-900/30 rounded-3xl border border-zinc-800 border-dashed text-zinc-500 font-medium max-w-2xl mx-auto">
          <Filter size={48} className="mx-auto mb-4 opacity-50 text-zinc-600" />
          <h3 className="text-xl text-white font-bold mb-2">No tickets found</h3>
          <p>Try changing the filter to see results.</p>
        </motion.div>
      )}

      <BannerWall title="Sponsored" banners={HISTORY_BANNERS} />

      {/* PROOF MODAL - image or YouTube video */}
      <AnimatePresence>
        {openProof && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            onClick={() => setOpenProof(null)}
            className="fixed inset-0 z-[100] bg-zinc-950/90 flex items-center justify-center p-4 md:p-10 cursor-zoom-out"
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
                onClick={() => setOpenProof(null)}
                aria-label="Close"
                className="absolute -top-12 right-0 text-zinc-400 hover:text-white transition-colors"
              >
                <X size={28} />
              </button>

              {openProof.type === "image" ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={openProof.src}
                  alt="Winning Ticket Proof"
                  className="w-full max-h-[80vh] rounded-3xl border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)] object-contain"
                />
              ) : (
                <div className="aspect-video w-full rounded-3xl overflow-hidden border border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,0.8)]">
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${openProof.youtubeId}?autoplay=1&rel=0`}
                    title="Winning Ticket Proof Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}