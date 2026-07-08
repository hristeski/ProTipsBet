import { Search, CreditCard, Unlock } from "lucide-react";

const STEPS = [
  { icon: Search, title: "Pick a Plan", desc: "Weekly to test it out, or Monthly Pro for full access." },
  { icon: CreditCard, title: "Pay Securely", desc: "Crypto (instant) or Skrill/MPesa (manual verification)." },
  { icon: Unlock, title: "Unlock VIP", desc: "Access to every hidden pick right after confirmation." },
];

export function HowItWorks() {
  return (
    <section className="reveal px-6 py-16 max-w-4xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2">How Do I Subscribe?</h2>
        <p className="text-zinc-400 text-sm">Three steps, under 2 minutes.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {STEPS.map((s, i) => (
          <div key={s.title} className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 text-center">
            <span className="absolute top-4 right-4 text-xs font-black text-zinc-700">0{i + 1}</span>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <s.icon size={22} />
            </div>
            <h3 className="text-white font-bold mb-1">{s.title}</h3>
            <p className="text-zinc-400 text-sm">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function AboutUs() {
  return (
    <section className="reveal px-6 py-16 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl md:text-4xl font-black text-white mb-4">About ProTipsBet</h2>
      <p className="text-zinc-400 text-sm md:text-base leading-relaxed">
       Driven by data. Proven by transparency. Our statisticians process thousands of metrics daily to find your betting edge. We hold ourselves to 100% accountability—every result is verified publicly, with zero exceptions
      </p>
    </section>
  );
}