"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle, CreditCard, ShieldCheck } from "lucide-react";

const FAQ_CATEGORIES = [
  {
    category: "Predictions",
    icon: HelpCircle,
    items: [
      {
        q: "How are your predictions made?",
        a: "Every tip goes through statistical analysis — team form, head-to-head history, injuries, and market odds movement — before it's published. We never publish a tip based on gut feeling alone.",
      },
      {
        q: "What's the difference between Free and VIP tips?",
        a: "Free tips are a sample of our work, published daily so you can verify our accuracy yourself. VIP tips include higher-confidence picks, exact staking plans, and access to premium combos with better value odds.",
      },
      {
        q: "How do I know your win rate is real?",
        a: "Every published tip — win or loss — stays visible in our public archive. Nothing is hidden or deleted after the fact, so you can verify our track record yourself.",
      },
    ],
  },
  {
    category: "Payments",
    icon: CreditCard,
    items: [
      {
        q: "How do I pay for VIP access?",
        a: "We accept manual payment confirmation via bank transfer and crypto (Binance Pay). After payment, your VIP access is activated once we confirm the transaction — usually within a few hours.",
      },
      {
        q: "Can I cancel my VIP subscription anytime?",
        a: "VIP access runs for the duration you purchased (e.g. weekly or monthly) and does not auto-renew unless stated otherwise. You're never locked into a recurring charge.",
      },
    ],
  },
  {
    category: "Policy",
    icon: ShieldCheck,
    items: [
      {
        q: "Is there a refund policy?",
        a: "Due to the nature of digital predictions, all VIP purchases are final once access is granted. We recommend reviewing our free tips and win-rate history before upgrading.",
      },
    ],
  },
];

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
        {FAQ_CATEGORIES.map((cat) => (
          <div key={cat.category}>
            <div className="flex items-center gap-2 mb-4">
              <cat.icon size={16} className="text-emerald-400" />
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
        ))}
      </div>
    </section>
  );
}