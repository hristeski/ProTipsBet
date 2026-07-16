"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "How are your predictions made?",
    a: "Every tip goes through statistical analysis — team form, head-to-head history, injuries, and market odds movement — before it's published. We never publish a tip based on gut feeling alone.",
  },
  {
    q: "What's the difference between Free and VIP tips?",
    a: "Free tips are a sample of our work, published daily so you can verify our accuracy yourself. VIP tips include higher-confidence picks, exact staking plans, and access to premium combos with better value odds.",
  },
  {
    q: "How do I pay for VIP access?",
    a: "We accept manual payment confirmation via bank transfer and crypto (Binance Pay). After payment, your VIP access is activated once we confirm the transaction — usually within a few hours.",
  },
  {
    q: "Is there a refund policy?",
    a: "Due to the nature of digital predictions, all VIP purchases are final once access is granted. We recommend reviewing our free tips and win-rate history before upgrading.",
  },
  {
    q: "How do I know your win rate is real?",
    a: "Every published tip — win or loss — stays visible in our public archive. Nothing is hidden or deleted after the fact, so you can verify our track record yourself.",
  },
  {
    q: "Can I cancel my VIP subscription anytime?",
    a: "VIP access runs for the duration you purchased (e.g. weekly or monthly) and does not auto-renew unless stated otherwise. You're never locked into a recurring charge.",
  },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="px-6 py-20 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-black text-white mb-2">
          Frequently Asked Questions
        </h2>
        <p className="text-zinc-400 text-sm">
          Everything you need to know before getting started.
        </p>
      </div>

      <div className="space-y-3">
        {FAQS.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div
              key={i}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : i)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
              >
                <span className="font-bold text-white text-sm md:text-base">
                  {item.q}
                </span>
                <ChevronDown
                  size={18}
                  className={`text-emerald-400 shrink-0 transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isOpen && (
                <div className="px-6 pb-5 text-zinc-400 text-sm leading-relaxed">
                  {item.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}