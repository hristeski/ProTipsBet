"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Crown, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import TipCard from "@/components/TipCard";
import BannerWall from "@/components/BannerWall";
import FloatingBackground from "@/components/FloatingBackground";
import Testimonials from "@/components/Testimonials";
import WinRateTable from "@/components/WinRateTable";
import { HowItWorks, AboutUs } from "@/components/LandingSections";
import { HOME_BANNERS } from "@/lib/banners";
import { API_BASE, authHeaders } from "@/lib/api";
import { getTipStatus, formatMatchTime } from "@/lib/tip-format";

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

export default function Home() {
  const partners = ["BET365", "PINNACLE", "SOFASCORE", "1XBET", "BINANCE PAY", "SKRILL"];

  const [freeTips, setFreeTips] = useState<ApiTip[]>([]);
  const [loadingTips, setLoadingTips] = useState(true);

  useEffect(() => {
    const fetchFreeTips = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/tips`, { headers: authHeaders() });
        const data = await res.json();
        const tips: ApiTip[] = Array.isArray(data) ? data : [];

        // Only free, currently pending tips on the homepage — cap at 4 for layout.
        const pendingFree = tips
          .filter((t) => !t.isVip && getTipStatus(t.result) === "pending")
          .slice(0, 4);

        setFreeTips(pendingFree);
      } catch {
        setFreeTips([]);
      } finally {
        setLoadingTips(false);
      }
    };

    fetchFreeTips();
  }, []);

  return (
    <div className="w-full bg-zinc-950 text-zinc-50 font-sans">

      {/* 1. HERO - pitch background + floating balls/trophies */}
      <section className="pitch-lines pitch-circle relative px-6 pt-32 pb-20 text-center min-h-[85vh] flex flex-col justify-center items-center overflow-hidden">
        <FloatingBackground />
        <div className="absolute w-[400px] h-[400px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-emerald-400">
            <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
            99% Win Rate • 124.5 Units Profit This Season
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
      
            Results You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Trust.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-zinc-400 mb-10 text-lg">
            Every tip goes through statistical analysis before it's published. No results are hidden — everything is 100% verified and public.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vip-tips" className="px-8 py-4 bg-emerald-500 text-zinc-950 font-black rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
              VIP Access <Crown size={18} />
            </Link>
            <a href="#free-picks" className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
              Free Picks <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* 2. PARTNERS MARQUEE */}
      <section className="py-4 border-y border-zinc-900 bg-zinc-950/80 overflow-hidden">
        <div className="flex animate-marquee gap-12 pl-12">
          {[...partners, ...partners].map((p, i) => (
            <span key={i} className="text-zinc-600 text-xs font-black tracking-widest uppercase">{p}</span>
          ))}
        </div>
      </section>

      {/* 3. QUICK FEATURES */}
      <section className="reveal px-6 py-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Deep Statistical Edge", desc: "Stop relying on luck. Our analytics process thousands of data points to find genuine value bets against the bookmakers.", icon: TrendingUp },
          { title: "Verified Slips", desc: "100% transparent history. We track every win and loss.", icon: ShieldCheck },
          { title: "Instant Access", desc: "Get immediate access to our premium dashboard. See exact unit sizes, high-value odds, and transparent staking plans.", icon: Zap }
        ].map((feat, i) => (
          <div key={i} className="shine-hover bg-zinc-900/50 border border-zinc-800 p-6 rounded-2xl flex items-start gap-4">
            <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800"><feat.icon size={20} className="text-emerald-400" /></div>
            <div>
              <h3 className="font-bold text-white mb-1">{feat.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </section>

      {/* 4. WIN RATE TABLE */}
      <WinRateTable />

      {/* Banner slots #1-8 */}
      <div className="px-6 max-w-5xl mx-auto">
        <BannerWall title="Sponsored" banners={HOME_BANNERS} />
      </div>

      {/* 5. TODAY'S FREE PICKS — now live from the backend */}
      <section id="free-picks" className="px-6 pb-24 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-black text-white mb-2">Today's Free Picks</h2>
          <p className="text-zinc-400 text-sm">Test our accuracy. For high-confidence combos, upgrade to VIP.</p>
        </div>

        {loadingTips ? (
          <div className="flex justify-center py-10">
            <Loader2 className="animate-spin text-emerald-500" size={32} />
          </div>
        ) : freeTips.length === 0 ? (
          <div className="text-center py-12 border border-zinc-800 border-dashed rounded-2xl text-zinc-500 text-sm">
            No free picks published yet today — check back soon.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {freeTips.map((tip) => (
              <TipCard
                key={tip.id}
                league={tip.league && tip.league !== "Unknown" ? tip.league : "Football"}
                matchTime={formatMatchTime(tip.matchDate)}
                homeTeam={tip.homeTeam}
                awayTeam={tip.awayTeam}
                prediction={tip.predictionType || "No prediction"}
                odds={Number(tip.odds) || 0}
                status={getTipStatus(tip.result)}
                isVip={false}
              />
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/free-tips" className="text-emerald-400 text-sm font-bold hover:underline inline-flex items-center gap-1">
            All free picks + archive <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* 6. ABOUT US */}
      <AboutUs />

      {/* 7. HOW IT WORKS */}
      <HowItWorks />

      {/* 8. TESTIMONIALS */}
      <Testimonials />

    </div>
  );
}