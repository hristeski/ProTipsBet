import Link from "next/link";
import { Check, Zap, ShieldCheck, Archive, CheckCircle2, XCircle } from "lucide-react";
import TipCard from "@/components/TipCard";
import BannerWall from "@/components/BannerWall";
import { VIP_BANNERS } from "@/lib/banners";
import { VIP_ARCHIVE } from "@/lib/tips-data";

export default function VipTipsPage() {
  const isUserVip = false;

  const vipMatches = [
    {
      id: 1,
      league: "Champions League",
      matchTime: "Today, 21:00",
      homeTeam: "Real Madrid",
      awayTeam: "Bayern Munich",
      prediction: "BTTS & Over 2.5",
      odds: 3.45,
      status: "pending" as const,
    },
    {
      id: 2,
      league: "Premier League",
      matchTime: "Today, 18:30",
      homeTeam: "Chelsea",
      awayTeam: "Man United",
      prediction: "1 & Under 3.5",
      odds: 2.80,
      status: "pending" as const,
    }
  ];

  const benefits = [
    "Daily VIP Predictions (2-3 matches)",
    "Average Odds: 2.50 - 5.00",
    "Detailed Match Analytics",
    "Bankroll Management Guide",
    "24/7 Priority Support",
  ];

  return (
    <div className="pb-24 px-4 pt-8">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black mb-2 text-white flex items-center justify-center gap-2">
          <span className="text-amber-400">👑</span> VIP Analytics
        </h1>
        <p className="text-neutral-400 text-sm max-w-sm mx-auto">
          High-confidence predictions with premium odds. Unlock today's picks below.
        </p>
      </div>

      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg text-white">Today's Premium Picks</h2>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
            2 Matches Available
          </span>
        </div>

        <div className="flex flex-col gap-2">
          {vipMatches.map((match) => (
            <TipCard
              key={match.id}
              league={match.league}
              matchTime={match.matchTime}
              homeTeam={match.homeTeam}
              awayTeam={match.awayTeam}
              prediction={match.prediction}
              odds={match.odds}
              status={match.status}
              isVip={true}
              isUnlocked={isUserVip}
            />
          ))}
        </div>
      </div>

      {!isUserVip && (
        <div className="border-t border-neutral-900 pt-10">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-black mb-2 text-white">
              Choose Your Plan
            </h2>
            <p className="text-neutral-500 text-sm">
              Get instant access to all hidden picks.
            </p>
          </div>

          <div className="flex flex-col gap-6 mb-12">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 relative">
              <h3 className="text-xl font-bold text-white mb-1">Weekly Pass</h3>
              <p className="text-neutral-500 text-sm mb-4">Perfect to test the waters</p>
              <div className="text-3xl font-black text-white mb-6">
                €25 <span className="text-sm font-medium text-neutral-500">/week</span>
              </div>
              <Link href="/checkout" className="block text-center w-full py-3 bg-neutral-800 text-white font-bold rounded-xl hover:bg-neutral-700 transition-colors">
                Select Weekly
              </Link>
            </div>

            <div className="shine-hover bg-gradient-to-b from-neutral-900 to-neutral-950 border border-emerald-500/50 rounded-2xl p-6 relative shadow-[0_0_30px_rgba(16,185,129,0.1)] transform scale-[1.02]">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-500 text-neutral-950 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1">
                <Zap size={14} /> Best Value
              </div>

              <h3 className="text-xl font-bold text-white mb-1">Monthly Pro</h3>
              <p className="text-neutral-500 text-sm mb-4">Maximize your ROI</p>
              <div className="text-4xl font-black text-emerald-400 mb-6">
                €60 <span className="text-sm font-medium text-neutral-500">/month</span>
              </div>

              <ul className="space-y-3 mb-8">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3 text-sm text-neutral-300">
                    <div className="bg-emerald-500/20 p-1 rounded-full text-emerald-400">
                      <Check size={14} strokeWidth={3} />
                    </div>
                    {benefit}
                  </li>
                ))}
              </ul>

              <Link href="/checkout" className="block text-center w-full py-4 bg-emerald-500 text-neutral-950 font-black rounded-xl hover:scale-[1.02] transition-transform shadow-lg shadow-emerald-500/20">
                Get Instant Access
              </Link>
            </div>
          </div>

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 text-center mb-10">
            <ShieldCheck size={32} className="text-neutral-500 mx-auto mb-3" />
            <h4 className="text-white font-bold mb-2">Secure Global Payments</h4>
            <p className="text-neutral-400 text-xs mb-4">
              We support automated instant access via Crypto, and manual processing for global e-wallets.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Binance Pay", "Skrill", "Neteller", "PayPal", "MPesa", "Card"].map((method) => (
                <span key={method} className="text-[10px] font-bold text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-md">
                  {method}
                </span>
              ))}
            </div>
          </div>

          {/* ARCHIVE - past VIP tickets, results public for trust */}
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-6">
              <Archive size={18} className="text-zinc-500" />
              <h2 className="text-xl font-black text-white">Past VIP Tickets</h2>
            </div>
            <div className="flex flex-col gap-3">
              {VIP_ARCHIVE.map((tk) => (
                <div
                  key={tk.id}
                  className={`flex items-center justify-between gap-4 bg-zinc-900/40 border rounded-xl px-4 py-3 ${
                    tk.status === "win" ? "border-emerald-500/20" : "border-red-500/20"
                  }`}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-500 mb-0.5">{tk.date} • {tk.matchesLabel}</p>
                    <p className="text-white font-bold text-sm truncate">{tk.type}</p>
                  </div>
                  <span className="text-white font-bold text-sm shrink-0">@ {tk.totalOdds.toFixed(2)}</span>
                  {tk.status === "win" ? (
                    <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle size={20} className="text-red-400 shrink-0" />
                  )}
                </div>
              ))}
            </div>
            <p className="text-zinc-500 text-xs mt-4 text-center">
              Full picks (market/prediction) are revealed to VIP subscribers only. All results are 100% public on the <Link href="/history" className="text-emerald-400 hover:underline">History</Link> page.
            </p>
          </div>

          <BannerWall title="Sponsored" banners={VIP_BANNERS} />
        </div>
      )}
    </div>
  );
}