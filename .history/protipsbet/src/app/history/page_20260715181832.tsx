"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, TrendingUp, Calendar, Camera, Trophy, Zap, Loader2, X, ChevronDown, ChevronUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BannerWall from "@/components/BannerWall";
import { HISTORY_BANNERS } from "@/lib/banners";
import { API_BASE } from "@/lib/api";

export default function HistoryPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "vip" | "free">("all");
  const [openImage, setOpenImage] = useState<string | null>(null);
  const [expandedTicket, setExpandedTicket] = useState<number | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        // ОВДЕ: Ако имаш посебна патека за History, смени ја овде!
        const res = await fetch(`${API_BASE}/api/admin/archive`); 
        if (res.ok) setTickets(await res.json());
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  const filtered = tickets.filter((t) => filter === "all" || (filter === "vip" ? t.isVip : !t.isVip));
  const totalProfit = tickets.reduce((acc, t) => acc + (t.totalOdds > 0 ? t.totalOdds - 1 : 0), 0).toFixed(1);
  const winRate = tickets.length > 0 ? "100%" : "0%"; // Archive is usually only winning tickets

  return (
    <div className="pb-24 px-6 pt-24 md:pt-32 max-w-7xl mx-auto min-h-screen relative">
      <div className="mb-12 text-center md:text-left flex flex-col md:flex-row justify-between gap-8 items-end">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">Verified Archive</h1>
          <p className="text-zinc-400 text-lg">Full transparency. Check our latest winning slips and match breakdowns.</p>
        </div>

        {/* Stats Bento Box */}
        <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase mb-2"><TrendingUp size={16} className="text-emerald-400" /> Units Won</div>
            <div className="text-3xl font-black text-white">+{totalProfit}</div>
          </div>
          <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center gap-2 text-zinc-500 text-xs font-bold uppercase mb-2"><CheckCircle2 size={16} className="text-emerald-400" /> Win Rate</div>
            <div className="text-3xl font-black text-white">{winRate}</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-3 mb-10 overflow-x-auto pb-4 border-b border-zinc-800/50">
        {(["all", "vip", "free"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all capitalize ${filter === f ? "bg-emerald-500 text-zinc-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]" : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"}`}
          >
            {f === "all" ? "All History" : `${f} Tickets`}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-24 flex justify-center"><Loader2 className="animate-spin text-emerald-500" size={48} /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence>
            {filtered.map((ticket, index) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9 }}
                key={ticket.id}
                className="bg-zinc-900/50 border border-zinc-800 hover:border-emerald-500/30 rounded-3xl overflow-hidden transition-all flex flex-col group shadow-lg backdrop-blur-sm"
              >
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/80 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${ticket.isVip ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                      {ticket.isVip ? <Trophy size={20} /> : <Zap size={20} />}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{ticket.description}</h3>
                      <p className="text-xs text-zinc-500 flex items-center gap-1"><Calendar size={12}/> {new Date(ticket.matchDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-zinc-500 uppercase">Odds</p>
                    <p className="text-xl font-black text-emerald-400">@{ticket.totalOdds}</p>
                  </div>
                </div>

                {/* Match Legs Accordion */}
                {ticket.legs && ticket.legs.length > 0 && (
                  <div className="p-4 bg-zinc-950/30 flex-grow">
                    <button onClick={() => setExpandedTicket(expandedTicket === ticket.id ? null : ticket.id)} className="w-full flex justify-between items-center text-sm font-bold text-zinc-400 hover:text-white transition-colors">
                      View {ticket.legs.length} Matches {expandedTicket === ticket.id ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                    </button>
                    
                    <AnimatePresence>
                      {expandedTicket === ticket.id && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="mt-4 space-y-2">
                            {ticket.legs.map((leg: any, i: number) => (
                              <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-3 flex justify-between items-center">
                                <div>
                                  <p className="text-xs text-zinc-500 mb-0.5">{leg.league || "Match"}</p>
                                  <p className="text-sm font-bold text-zinc-200">{leg.homeTeam} - {leg.awayTeam}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-emerald-400 font-bold text-sm">{leg.prediction}</p>
                                  <p className="text-zinc-400 text-xs font-bold">@{leg.odds}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}

                {/* Action Footer */}
                <div className="p-4 border-t border-zinc-800 mt-auto">
                  <button onClick={() => setOpenImage(`${API_BASE}${ticket.imageUrl}`)} className="w-full py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors">
                    <Camera size={18} className="text-emerald-400"/> View Original Slip
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Image Lightbox */}
      <AnimatePresence>
        {openImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpenImage(null)} className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
            <button className="absolute top-6 right-6 text-white bg-zinc-800 p-2 rounded-full hover:bg-zinc-700"><X size={24}/></button>
            {/* eslint-disable-next-line */}
            <img src={openImage} className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl border border-zinc-800" alt="Slip" />
          </motion.div>
        )}
      </AnimatePresence>
      
      <BannerWall title="Sponsored" banners={HISTORY_BANNERS} />
    </div>
  );
}