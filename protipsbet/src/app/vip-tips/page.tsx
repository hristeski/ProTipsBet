import Link from "next/link";
import { ShieldCheck, Archive, CheckCircle2, XCircle, Crown } from "lucide-react";
import TipCard from "@/components/TipCard";
import BannerWall from "@/components/BannerWall";
import PricingPlans from "@/components/PricingPlans";
import { VIP_BANNERS } from "@/lib/banners";
import { VIP_ARCHIVE } from "@/lib/tips-data";
import { CRYPTO_MIN_NOTE } from "@/lib/pricing";

export default function VipTipsPage() {
  const isUserVip = false;

  const vipMatches = [
    {
      id: 1,
      date: "Today",
      league: "Champions League",
      matchTime: "21:00",
      homeTeam: "Real Madrid",
      awayTeam: "Bayern Munich",
      prediction: "BTTS & Over 2.5",
      odds: 3.45,
      status: "pending" as const,
    },
    {
      id: 2,
      date: "Today",
      league: "Premier League",
      matchTime: "18:30",
      homeTeam: "Chelsea",
      awayTeam: "Man United",
      prediction: "1 & Under 3.5",
      odds: 2.80,
      status: "pending" as const,
    }
  ];

  return (
    <div className="pb-24 px-4 md:px-8 pt-8 md:pt-28 max-w-6xl mx-auto">

      {/* HEADER */}
      <div className="text-center md:text-left mb-8 md:mb-12 md:flex md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl md:text-5xl font-black mb-2 text-white flex items-center justify-center md:justify-start gap-2">
            <Crown className="text-amber-400" size={32} /> VIP Analytics
          </h1>
          <p className="text-neutral-400 text-sm md:text-base max-w-sm md:max-w-md mx-auto md:mx-0">
            High-confidence predictions with premium odds. Unlock today's picks below.
          </p>
        </div>
        <span className="hidden md:inline-flex text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-md">
          2 Matches Available Today
        </span>
      </div>

      {/* TODAY'S PICKS */}
      <div className="mb-12 md:mb-16">
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="font-bold text-lg text-white">Today's Premium Picks</h2>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
            2 Matches Available
          </span>
        </div>
        <h2 className="hidden md:block font-bold text-xl text-white mb-4">Today's Premium Picks</h2>

        <div className="flex flex-col md:grid md:grid-cols-2 gap-2 md:gap-4">
          {vipMatches.map((match) => (
            <TipCard
              key={match.id}
              date={match.date}
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
        <div className="border-t border-neutral-900 pt-10 md:pt-14">
          <div className="text-center mb-8 md:mb-10">
            <h2 className="text-2xl md:text-4xl font-black mb-2 text-white">
              Choose Your Plan
            </h2>
            <p className="text-neutral-500 text-sm md:text-base">
              Daily, Weekly, or Monthly — pick the access that fits how you bet.
            </p>
          </div>

          <PricingPlans />

          <div className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-6 md:p-8 text-center mb-10 md:max-w-2xl md:mx-auto">
            <ShieldCheck size={32} className="text-neutral-500 mx-auto mb-3" />
            <h4 className="text-white font-bold mb-2">Secure Global Payments</h4>
            <p className="text-neutral-400 text-xs mb-2">
              We support automated instant access via Crypto, and manual processing for global e-wallets and transfer services.
            </p>
            <p className="text-amber-400/80 text-[11px] font-semibold mb-4">{CRYPTO_MIN_NOTE}</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Binance Pay", "Western Union", "Ria", "Skrill", "Neteller", "PayPal", "MPesa Global"].map((m) => (
                <span key={m} className="text-[10px] font-bold text-neutral-500 bg-neutral-900 border border-neutral-800 px-2 py-1 rounded-md">
                  {m}
                </span>
              ))}
            </div>
          </div>

          {/* ARCHIVE */}
          <div className="mb-10 md:max-w-3xl md:mx-auto">
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