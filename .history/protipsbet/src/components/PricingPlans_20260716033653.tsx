    // FILE DESTINATION: src/components/PricingPlans.tsx

import Link from "next/link";
import { Check, Zap } from "lucide-react";
import { PRICING_PLANS } from "@/lib/pricing";

export default function PricingPlans() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {PRICING_PLANS.map((plan) => (
        <div
          key={plan.id}
          className={`relative rounded-2xl p-6 flex flex-col ${
            plan.highlighted
              ? "shine-hover bg-gradient-to-b from-neutral-900 to-neutral-950 border border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.1)] md:scale-[1.03]"
              : "bg-neutral-900 border border-neutral-800"
          }`}
        >
          {plan.badge && (
            <div
              className={`absolute -top-0 left-1/2 -translate-x-1/2 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 ${
                plan.highlighted
                  ? "bg-emerald-500 text-neutral-950"
                  : "bg-neutral-800 text-zinc-300 border border-neutral-700"
              }`}
            >
              {plan.highlighted && <Zap size={12} />}
              {plan.badge}
            </div>
          )}

          <h3 className="text-xl font-bold text-white mb-1 mt-2">{plan.name}</h3>
          <p className="text-neutral-500 text-sm mb-4">
            ~€{plan.perDay.toFixed(2)} / day
          </p>

          <div className={`font-black mb-6 ${plan.highlighted ? "text-4xl text-emerald-400" : "text-3xl text-white"}`}>
            €{plan.price} <span className="text-sm font-medium text-neutral-500">{plan.period}</span>
          </div>

          <ul className="space-y-3 mb-8 flex-grow">
            {plan.benefits.map((b) => (
              <li key={b} className="flex items-start gap-3 text-sm text-neutral-300">
                <div className={`p-1 rounded-full mt-0.5 shrink-0 ${plan.highlighted ? "bg-emerald-500/20 text-emerald-400" : "bg-neutral-800 text-neutral-400"}`}>
                  <Check size={12} strokeWidth={3} />
                </div>
                {b}
              </li>
            ))}
          </ul>

          <Link
            href={`/checkout?plan=${plan.id}`}
            className={`block text-center w-full py-3.5 rounded-xl font-black transition-all ${
              plan.highlighted
                ? "bg-emerald-500 text-neutral-950 hover:scale-[1.02] shadow-lg shadow-emerald-500/20"
                : "bg-neutral-800 text-white hover:bg-neutral-700"
            }`}
          >
            {plan.highlighted ? "Get Instant Access" : `Select ${plan.name}`}
          </Link>
        </div>
      ))}
    </div>
  );
}