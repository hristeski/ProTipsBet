"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, CreditCard, ShieldCheck } from "lucide-react";
import { FAQ_CATEGORIES, type FaqCategory } from "@/lib/faq-data";

const ICON_MAP: Record<FaqCategory["iconKey"], typeof HelpCircle> = {
  help: HelpCircle,
  card: CreditCard,
  shield: ShieldCheck,
};

export default function FAQ() {
  const [openKey, setOpenKey] = useState<string | null>("Predictions-0");

  return (
    <section id="faq" className="px-6 py-20 max-w-4xl mx-auto scroll-mt-24">
      <div className="text-center mb-12">
        <span className="text-emerald-400 text-xs font-black uppercase tracking-widest">
          Support
        </span>
        <h2 className="text-3xl md:text-4xl font-black text-white mt-2 mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-zinc-400 text-sm">
          Everything you need to know before getting started.
        </p>
      </div>

      <div className="space-y-10">
        {FAQ_CATEGORIES.map((cat) => {
          const Icon = ICON_MAP[cat.iconKey];
          return (
            <div key={cat.category}>
              <div className="flex items-center gap-2 mb-4">
                <Icon size={16} className="text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-zinc-500">
                  {cat.category}
                </h3>
              </div>

              <div className="space-y-2">
                {cat.items.map((item, i) => {
                  const key = `${cat.category}-${i}`;
                  const isOpen = openKey === key;
                  return (
                    <div
                      key={key}
                      className={`rounded-2xl border transition-colors ${
                        isOpen
                          ? "bg-zinc-900/80 border-emerald-500/30"
                          : "bg-zinc-900/40 border-zinc-800 hover:border-zinc-700"
                      }`}
                    >
                      <button
                        onClick={() => setOpenKey(isOpen ? null : key)}
                        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                      >
                        <span className="font-bold text-white text-sm">
                          {item.q}
                        </span>
                        <ChevronDown
                          size={16}
                          className={`text-emerald-400 shrink-0 transition-transform duration-200 ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      <div
                        className={`grid transition-all duration-200 ease-in-out ${
                          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                        }`}
                      >
                        <div className="overflow-hidden">
                          <p className="px-5 pb-4 text-zinc-400 text-sm leading-relaxed">
                            {item.a}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}