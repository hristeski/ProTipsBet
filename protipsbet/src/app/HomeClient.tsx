"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowRight, ShieldCheck, Zap, TrendingUp, Crown } from "lucide-react";
import TipCard from "@/components/TipCard";
import BannerWall from "@/components/BannerWall";
import FloatingBackground from "@/components/FloatingBackground";
import Testimonials from "@/components/Testimonials";
import WinRateTable from "@/components/WinRateTable";
import { HowItWorks, AboutUs } from "@/components/LandingSections";
import { HOME_BANNERS } from "@/lib/banners";
import FAQ from "@/components/FAQ";
import FreePicksSection from "@/components/FreePicksSection";

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
  initialFreeTips: ApiTip[];
  yesterdayFreeTips: ApiTip[];
  confidenceBar?: ReactNode;
  winningGallery?: ReactNode;
}

export default function HomeClient({ initialFreeTips, yesterdayFreeTips, confidenceBar, winningGallery }: Props) {
  const partners = ["BET365", "PINNACLE", "SOFASCORE", "1XBET", "BINANCE PAY", "SKRILL"];

  return (
    <div className="w-full bg-zinc-950 text-zinc-50 font-sans">

      {/* 1. HERO - pitch background + floating balls/trophies
          Забелешка: без framer-motion овде намерно — hero H1 е дел од LCP
          (Largest Contentful Paint) метриката, па мора да е веднаш видлив
          во HTML без да чека JS hydration/animation. */}
      <section className="pitch-lines pitch-circle relative px-6 pt-32 pb-20 text-center min-h-[85vh] flex flex-col justify-center items-center overflow-hidden">
        <FloatingBackground />
        <div className="absolute w-[400px] h-[400px] bg-emerald-500/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-bold text-emerald-400">
            <span className="pulse-dot w-1.5 h-1.5 rounded-full bg-emerald-400" />
            99% Win Rate • 124.5 Units Profit This Season
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tighter">
            Results You Can <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-500">Trust.</span>
          </h1>

          <p className="text-zinc-400 mb-10 text-lg">
            Every tip goes through statistical analysis before it's published. No results are hidden — everything is 100% verified and public.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/vip-tips" className="px-8 py-4 bg-emerald-500 text-zinc-950 font-black rounded-xl hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2 hover:scale-105 active:scale-95">
              VIP Access <Crown size={18} />
            </Link>
            <a href="#free-picks" className="px-8 py-4 bg-zinc-900 border border-zinc-800 text-white font-bold rounded-xl hover:bg-zinc-800 transition-colors flex items-center justify-center gap-2">
              Free Picks <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>

      {/* 1.5 CONFIDENCE STATS BAR - жива статистика, веднаш по hero */}
      {confidenceBar}

      {/* 2. PARTNERS MARQUEE */}
      <section className="py-4 border-y border-zinc-900 bg-zinc-950/80 overflow-hidden">
        <div className="flex animate-marquee gap-12 pl-12">
          {[...partners, ...partners].map((p, i) => (
            <span key={i} className="text-zinc-600 text-xs font-black tracking-widest uppercase">{p}</span>
          ))}
        </div>
      </section>

      {/* 3. QUICK FEATURES
          Забелешка: додаден sr-only h2 пред h3-те за да не се прескокнува
          heading нивото (претходно h1 -> h3 директно, Lighthouse грешка). */}
      <section className="reveal px-6 py-20 max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-4">
        <h2 className="sr-only">Why Choose ProTipsBet</h2>
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

      {/* 4.5 VERIFIED WINS PORTFOLIO - галерија на реални тикети, докажи пред да прикажеш денешни пикови */}
      {winningGallery}

      {/* Banner slots #1-8 */}
      <div className="px-6 max-w-5xl mx-auto">
        <BannerWall title="Sponsored" banners={HOME_BANNERS} />
      </div>

      {/* 5. FREE PICKS — today's pending picks and yesterday's results */}
      <FreePicksSection todayTips={initialFreeTips} yesterdayTips={yesterdayFreeTips} />

      {/* 6. ABOUT US */}
      <AboutUs />

      {/* 7. HOW IT WORKS */}
      <HowItWorks />

      {/* 8. TESTIMONIALS */}
      <Testimonials />

      {/* 9. FAQ */}
      <FAQ />
    </div>
  );
}