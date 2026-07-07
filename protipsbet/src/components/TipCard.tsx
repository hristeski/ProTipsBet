import { Lock } from "lucide-react";

interface TipCardProps {
  league: string;
  matchTime: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  odds: number;
  status: "pending" | "win" | "loss";
  isVip?: boolean;
  isUnlocked?: boolean;
}

export default function TipCard({
  league,
  matchTime,
  homeTeam,
  awayTeam,
  prediction,
  odds,
  status,
  isVip = false,
  isUnlocked = true,
}: TipCardProps) {
  return (
    <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-4 relative overflow-hidden flex flex-col mb-3 shadow-lg">
      
      <div className="flex justify-between items-center mb-4 border-b border-neutral-800 pb-2">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
          {league}
        </span>
        <span className="text-xs font-medium text-neutral-400">
          {matchTime}
        </span>
      </div>

      <div className="flex flex-col gap-1 mb-5">
        <div className="font-bold text-lg text-white">{homeTeam}</div>
        <div className="font-bold text-lg text-white">{awayTeam}</div>
      </div>

      <div className="flex justify-between items-end mt-auto">
        <div className="flex flex-col">
          <span className="text-xs text-neutral-500 mb-1">Our Pick:</span>
          
          {!isVip || isUnlocked ? (
            <span className="text-emerald-400 font-black text-xl bg-emerald-500/10 px-3 py-1 rounded-lg w-fit">
              {prediction}
            </span>
          ) : (
            <div className="flex items-center gap-2 bg-neutral-800 px-3 py-1 rounded-lg w-fit blur-sm relative group cursor-pointer">
              <span className="text-neutral-500 font-black text-xl">Hidden Pick</span>
            </div>
          )}
        </div>

        <div className="flex flex-col items-end">
          <span className="text-xs text-neutral-500 mb-1">Odds:</span>
          <span className="text-xl font-bold text-white">@ {odds.toFixed(2)}</span>
        </div>
      </div>

      {isVip && !isUnlocked && (
        <div className="absolute inset-0 bg-neutral-950/60 backdrop-blur-[2px] flex flex-col items-center justify-center z-10">
          <div className="bg-neutral-900 border border-neutral-700 p-3 rounded-full mb-2">
            <Lock size={20} className="text-amber-400" />
          </div>
          <span className="text-sm font-bold text-amber-400">Unlock VIP Pick</span>
        </div>
      )}
    </div>
  );
}