"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ShieldCheck, Archive, CheckCircle2, XCircle, Crown, Loader2 } from "lucide-react";
import TipCard from "@/components/TipCard";
import BannerWall from "@/components/BannerWall";
import PricingPlans from "@/components/PricingPlans";
import { VIP_BANNERS } from "@/lib/banners";
import { CRYPTO_MIN_NOTE } from "@/lib/pricing";
import { getTipStatus, formatDate } from "@/lib/tip-format";
import { API_BASE, authHeaders } from "@/lib/api";

interface Props {
  initialVipMatches: any[];
  initialVipTipsArchive: any[]; // завршени VIP типови (Win/Loss) - серверски вчитано
  initialVipTicketsArchive: any[]; // upload-нати winning ticket слики - серверски вчитано
}

export default function VipTipsClient({
  initialVipMatches,
  initialVipTipsArchive,
  initialVipTicketsArchive,
}: Props) {
  const [vipMatches, setVipMatches] = useState<any[]>(initialVipMatches);
  const [vipTipsArchive] = useState<any[]>(initialVipTipsArchive);
  const [vipTicketsArchive] = useState<any[]>(initialVipTicketsArchive);
  const [checkingVip, setCheckingVip] = useState(true);
  const [isUserVip, setIsUserVip] = useState(false);

  // Server-делот секогаш враќа заклучена верзија (безбедно за SEO/анонимни).
  // Тука, ако постои токен, повторно fetch-ame со Authorization за да ги
  // "отклучиме" вистинските мечеви за платениот корисник.
  useEffect(() => {
    const token = localStorage.getItem("protipsbet_token");
    if (!token) {
      setCheckingVip(false);
      return;
    }

    const unlockIfVip = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/tips`, { headers: authHeaders() });
        if (res.ok) {
          const data = await res.json();
          const vips = data.filter((t: any) => t.isVip);
          const pendingVips = vips.filter((t: any) => getTipStatus(t.result) === "pending");

          if (vips.length > 0 && vips[0].homeTeam !== "Locked VIP Match") {
            setIsUserVip(true);
            setVipMatches(pendingVips);
          }
        }
      } catch (err) {
        console.error("Грешка при отклучување на VIP:", err);
      } finally {
        setCheckingVip(false);
      }
    };

    unlockIfVip();
  }, []);

  const formatMatchTime = (value?: string) => {
    if (!value) return "TBD";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "TBD";
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="pb-24 px-4 md:px-8 pt-8 md:pt-28 max-w-6xl mx-auto">

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
          {vipMatches.length} Matches Available Today
        </span>
      </div>

      {/* ДЕНЕШНИ VIP ПИКОВИ (pending) */}
      <div className="mb-12 md:mb-16">
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="font-bold text-lg text-white">Today's Premium Picks</h2>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md">
            {vipMatches.length} Available
          </span>
        </div>
        <h2 className="hidden md:block font-bold text-xl text-white mb-4">Today's Premium Picks</h2>

        {vipMatches.length === 0 ? (
          <div className="text-center py-12 border border-neutral-800 border-dashed rounded-2xl text-neutral-500">
            No VIP matches available at the moment, check back later.
          </div>
        ) : (
          <div className="flex flex-col md:flex-row md:flex-wrap md:justify-center gap-2 md:gap-4">
            {vipMatches.map((match) => (
              <div key={match.id} className="md:w-[calc(50%-0.5rem)]">
                <TipCard
                  date={new Date(match.matchDate).toLocaleDateString()}
                  league={match.league && match.league !== "VIP Only" ? match.league : "VIP Match"}
                  matchTime={formatMatchTime(match.matchDate)}
                  homeTeam={match.homeTeam}
                  awayTeam={match.awayTeam}
                  prediction={match.predictionType}
                  odds={match.odds}
                  status={String(match.result).toLowerCase() as any}
                  isVip={true}
                  isUnlocked={match.homeTeam !== "Locked VIP Match"}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PRICING - само за не-VIP посетители, откако е потврдено статусот */}
      {checkingVip ? (
        <div className="flex justify-center py-6">
          <Loader2 className="animate-spin text-neutral-600" size={20} />
        </div>
      ) : !isUserVip ? (
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
        </div>
      ) : null}

      {/* АРХИВА НА ЗАВРШЕНИ VIP ПИКОВИ - исто како Free Tips архивата (Win/Loss листа) */}
      <div className="mb-10 md:max-w-3xl md:mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Archive size={18} className="text-zinc-500" />
          <h2 className="text-xl font-black text-white">Archive of Past VIP Picks</h2>
        </div>

        {vipTipsArchive.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-5">No completed VIP matches yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {vipTipsArchive.map((tip) => (
              <div
                key={tip.id}
                className={`flex items-center justify-between gap-4 bg-zinc-900/40 border rounded-xl px-4 py-3 ${
                  getTipStatus(tip.result) === "win" ? "border-emerald-500/20" : "border-red-500/20"
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-500 mb-0.5">
                    {formatDate(tip.matchDate)} • {tip.league && tip.league !== "VIP Only" ? tip.league : "VIP Match"}
                  </p>
                  <p className="text-white font-bold text-sm truncate">
                    {tip.homeTeam} vs {tip.awayTeam}
                  </p>
                </div>
                <span className="text-zinc-300 text-sm font-bold hidden sm:block">{tip.predictionType}</span>
                <span className="text-white font-bold text-sm shrink-0">@ {Number(tip.odds).toFixed(2)}</span>
                {getTipStatus(tip.result) === "win" ? (
                  <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
                ) : (
                  <XCircle size={20} className="text-red-400 shrink-0" />
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* АРХИВА НА UPLOAD-НАТИ WINNING TICKET СЛИКИ */}
      <div className="mb-10 md:max-w-3xl md:mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <Archive size={18} className="text-zinc-500" />
          <h2 className="text-xl font-black text-white">Past VIP Tickets</h2>
        </div>

        {vipTicketsArchive.length === 0 ? (
          <p className="text-center text-neutral-600 text-sm py-5">There are no archived tickets available.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {vipTicketsArchive.map((tk) => (
              <div
                key={tk.id}
                className="flex items-center justify-between gap-4 bg-zinc-900/40 border border-emerald-500/20 rounded-xl px-4 py-3"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-zinc-500 mb-0.5">
                    {new Date(tk.matchDate).toLocaleDateString()} • Verified Win
                  </p>
                  <p className="text-white font-bold text-sm truncate">{tk.description}</p>
                </div>
                <span className="text-white font-bold text-sm shrink-0">@ {tk.totalOdds.toFixed(2)}</span>
                <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
              </div>
            ))}
          </div>
        )}

        <p className="text-zinc-500 text-xs mt-4 text-center">
          Full picks (market/prediction) are revealed to VIP subscribers only. All results are 100% public on the{" "}
          <Link href="/history" className="text-emerald-400 hover:underline">History</Link> page.
        </p>
      </div>

      {!isUserVip && <BannerWall title="Sponsored" banners={VIP_BANNERS} />}
    </div>
  );
}