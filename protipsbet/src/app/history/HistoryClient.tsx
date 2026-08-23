"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  CheckCircle, TrendingUp, ImageIcon, Trophy, 
  Calendar, X, Search, ArrowUpDown, FilterX 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BannerWall from "@/components/BannerWall";
import { HISTORY_BANNERS } from "@/lib/banners";
import { API_BASE } from "@/lib/api";

export default function HistoryClient({ initialTickets }: { initialTickets: any[] }) {
  const [tickets, setTickets] = useState<any[]>(initialTickets);
  const [filter, setFilter] = useState<"all" | "vip" | "premium" | "correct score">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "highest_odds">("newest");
  const [openImage, setOpenImage] = useState<string | null>(null);

  const refetchTickets = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/archive`, { cache: "no-store" });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data)) setTickets(data);
    } catch {
      // Silent fail
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(refetchTickets, 60000);
    const onFocus = () => refetchTickets();
    window.addEventListener("focus", onFocus);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", onFocus);
    };
  }, [refetchTickets]);

  // Филтрирање, Пребарување и Сортирање (UseMemo за подобри перформанси)
  const processedTickets = useMemo(() => {
    let result = tickets.filter((t) => {
      const desc = (t.description || "").toLowerCase();
      
      // 1. Категорија филтер
      let matchesFilter = true;
      if (filter === "vip") matchesFilter = desc.includes("vip") || t.isVip;
      if (filter === "premium") matchesFilter = desc.includes("premium");
      if (filter === "correct score") matchesFilter = desc.includes("correct score") || desc.includes("cs");

      // 2. Search филтер (пребарува во опис и во тимови)
      const search = searchQuery.toLowerCase();
      const matchesSearch = search === "" || 
        desc.includes(search) || 
        t.legs?.some((leg: any) => 
          leg.homeTeam.toLowerCase().includes(search) || 
          leg.awayTeam.toLowerCase().includes(search)
        );

      return matchesFilter && matchesSearch;
    });

    // 3. Сортирање
    return result.sort((a, b) => {
      const dateA = new Date(a.matchDate).getTime();
      const dateB = new Date(b.matchDate).getTime();
      
      if (sortBy === "newest") return dateB - dateA;
      if (sortBy === "oldest") return dateA - dateB;
      if (sortBy === "highest_odds") return b.totalOdds - a.totalOdds;
      return 0;
    });
  }, [tickets, filter, searchQuery, sortBy]);

  const totalProfit = tickets.reduce((acc, t) => acc + (t.totalOdds > 0 ? t.totalOdds - 1 : 0), 0).toFixed(2);

  const getBadge = (desc: string, isVip: boolean) => {
    const d = (desc || "").toLowerCase();
    if (d.includes("correct score") || d.includes("cs")) return { label: "CORRECT SCORE", color: "bg-purple-500 text-white" };
    if (d.includes("premium")) return { label: "PREMIUM", color: "bg-blue-500 text-white" };
    if (isVip || d.includes("vip")) return { label: "VIP", color: "bg-amber-500 text-black" };
    return { label: "WINNER", color: "bg-emerald-500 text-black" };
  };

  return (
    <div className="pb-24 px-4 sm:px-6 pt-24 md:pt-32 max-w-7xl mx-auto min-h-screen relative">
      {/* Header Stats */}
      <div className="mb-10 text-center md:text-left flex flex-col lg:flex-row justify-between gap-8 items-end border-b border-neutral-800 pb-10">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 uppercase tracking-tight">
            Verified <span className="text-emerald-500">History</span>
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed">
            100% transparent track record. Every single match, tip, and odd is publicly verified. We let our results speak for us.
          </p>
        </div>

        <div className="flex gap-4 w-full lg:w-auto">
          <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-5 flex-1 md:w-48 shadow-lg hover:border-emerald-500/30 transition-colors">
            <p className="text-neutral-500 text-xs font-bold uppercase mb-2 flex items-center justify-center lg:justify-start gap-1.5">
              <TrendingUp size={16} className="text-emerald-500" /> Units Profit
            </p>
            <p className="text-3xl font-black text-white text-center lg:text-left">+{totalProfit}</p>
          </div>
          <div className="bg-neutral-900/80 backdrop-blur-sm border border-neutral-800 rounded-2xl p-5 flex-1 md:w-48 shadow-lg hover:border-emerald-500/30 transition-colors">
            <p className="text-neutral-500 text-xs font-bold uppercase mb-2 flex items-center justify-center lg:justify-start gap-1.5">
              <CheckCircle size={16} className="text-emerald-500" /> Win Rate
            </p>
            <p className="text-3xl font-black text-white text-center lg:text-left">100%</p>
          </div>
        </div>
      </div>

      {/* Control Panel (Filters, Search, Sort) */}
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-10 bg-neutral-900/50 p-4 rounded-2xl border border-neutral-800/50">
        <div className="flex gap-2 flex-wrap">
          {(["all", "vip", "premium", "correct score"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold transition-all uppercase tracking-wide ${
                filter === f
                  ? "bg-emerald-500 text-neutral-950 shadow-[0_0_20px_rgba(16,185,129,0.3)] scale-105"
                  : "bg-neutral-950 text-neutral-400 hover:bg-neutral-800 hover:text-white border border-neutral-800"
              }`}
            >
              {f === "all" ? "All" : f}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          <div className="relative group flex-1 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" size={18} />
            <input
              type="text"
              placeholder="Search teams or tips..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl py-2.5 pl-10 pr-4 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all placeholder:text-neutral-600"
            />
          </div>

          {/* Sort Dropdown */}
          <div className="relative group">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" size={18} />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-neutral-950 border border-neutral-800 text-white rounded-xl py-2.5 pl-10 pr-8 appearance-none focus:outline-none focus:border-emerald-500 transition-all cursor-pointer"
            >
              <option value="newest">Newest First</option>
              <option value="highest_odds">Highest Odds</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid на тикети */}
      {processedTickets.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {processedTickets.map((ticket) => {
              const badge = getBadge(ticket.description, ticket.isVip);

              return (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  key={ticket.id}
                  className="bg-neutral-950/80 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden flex flex-col relative shadow-2xl hover:border-neutral-700 transition-colors"
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[10rem] font-black text-emerald-500/5 rotate-[-15deg] pointer-events-none select-none">
                    WON
                  </div>

                  <div className="p-6 border-b border-neutral-800 bg-neutral-900/30 flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 relative z-10">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-3">
                        <span className={`${badge.color} px-2.5 py-1 rounded text-[11px] font-black uppercase flex items-center gap-1.5 shadow-sm`}>
                          <Trophy size={12}/> {badge.label}
                        </span>
                        <span className="bg-neutral-900 border border-neutral-800 text-neutral-400 px-2.5 py-1 rounded text-[11px] font-bold flex items-center gap-1.5">
                          <Calendar size={12}/> {new Date(ticket.matchDate).toLocaleDateString('en-GB')}
                        </span>
                      </div>
                      <h3 className="text-xl font-black text-white leading-snug">{ticket.description}</h3>
                    </div>
                    
                    <div className="flex flex-col items-start sm:items-end bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-5 py-3 self-start sm:self-auto min-w-[120px]">
                      <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest mb-1">Total Odds</p>
                      <p className="text-3xl font-black text-white">@{ticket.totalOdds}</p>
                    </div>
                  </div>

                  <div className="p-6 flex-grow relative z-10">
                    {ticket.legs && ticket.legs.length > 0 ? (
                      <div className="w-full">
                        <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 pb-2 border-b border-neutral-800/50">
                          <div className="col-span-6">Match</div>
                          <div className="col-span-3 text-center">Tip</div>
                          <div className="col-span-3 text-right">Odds</div>
                        </div>

                        <div className="space-y-2">
                          {ticket.legs.map((leg: any, i: number) => (
                            <div key={i} className="grid grid-cols-12 gap-2 items-center bg-neutral-900/40 p-3 rounded-xl border border-neutral-800/50 hover:bg-neutral-800/60 transition-colors">
                              <div className="col-span-6">
                                <p className="text-white font-bold text-sm truncate">{leg.homeTeam}</p>
                                <p className="text-neutral-400 font-medium text-xs mt-0.5 truncate">{leg.awayTeam}</p>
                              </div>
                              <div className="col-span-3 flex justify-center">
                                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-black text-xs px-2 py-1.5 rounded w-full text-center truncate">
                                  {leg.prediction}
                                </span>
                              </div>
                              <div className="col-span-3 text-right">
                                <span className="text-white font-bold text-sm">@{leg.odds}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="py-10 flex flex-col items-center justify-center text-neutral-600 gap-2">
                        <div className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center mb-2">
                          <Trophy size={20} className="text-neutral-700" />
                        </div>
                        <p className="font-medium text-sm">Single match or no breakdown available.</p>
                      </div>
                    )}
                  </div>

                  <div className="p-4 border-t border-neutral-800 bg-neutral-950 relative z-10 mt-auto">
                    <button
                      onClick={() => setOpenImage(`${API_BASE}${ticket.imageUrl}`)}
                      className="w-full group flex items-center justify-center gap-2 text-sm font-bold text-neutral-400 hover:text-white py-3 hover:bg-neutral-900 rounded-xl transition-all uppercase"
                    >
                      <ImageIcon size={18} className="text-neutral-600 group-hover:text-emerald-500 transition-colors"/>
                      View Original Ticket
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      ) : (
        /* Empty State */
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="py-20 flex flex-col items-center justify-center text-center bg-neutral-900/20 rounded-3xl border border-neutral-800/50 border-dashed"
        >
          <div className="w-20 h-20 bg-neutral-900 rounded-full flex items-center justify-center mb-6">
            <FilterX size={32} className="text-neutral-600" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No tickets found</h3>
          <p className="text-neutral-500 max-w-sm">
            We couldn't find any tickets matching your current filters or search query.
          </p>
          <button 
            onClick={() => { setFilter("all"); setSearchQuery(""); }}
            className="mt-6 px-6 py-2.5 bg-neutral-800 text-white font-bold rounded-xl hover:bg-neutral-700 transition-colors"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {/* Image Modal */}
      <AnimatePresence>
        {openImage && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }} 
            animate={{ opacity: 1, backdropFilter: "blur(8px)" }} 
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }} 
            onClick={() => setOpenImage(null)} 
            className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4 sm:p-8"
          >
            <motion.button 
              initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
              className="absolute top-6 right-6 z-[101] text-white bg-neutral-800/80 hover:bg-neutral-700 p-3 rounded-full backdrop-blur-sm transition-colors"
            >
              <X size={24}/>
            </motion.button>
            <motion.img 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0 }}
              src={openImage} 
              className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-[0_0_50px_rgba(16,185,129,0.15)] border border-neutral-800" 
              alt="Winning Ticket Proof" 
              onClick={(e) => e.stopPropagation()} // Спречува затворање при клик на самата слика
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-20">
        <BannerWall title="Sponsored" banners={HISTORY_BANNERS} />
      </div>
    </div>
  );
}