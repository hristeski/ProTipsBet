import { WIN_RATE_TABLE } from "@/lib/testimonials";

export default function WinRateTable() {
  return (
    <section className="reveal px-6 py-16 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2">Accuracy by Market</h2>
        <p className="text-zinc-400 text-sm">Updated weekly. Full history is available on the History page.</p>
      </div>
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden">
        {WIN_RATE_TABLE.map((row, i) => (
          <div
            key={row.label}
            className={`flex items-center justify-between px-6 py-4 ${i !== WIN_RATE_TABLE.length - 1 ? "border-b border-zinc-800" : ""}`}
          >
            <div>
              <p className="text-white font-bold text-sm">{row.label}</p>
              {row.sub && <p className="text-zinc-500 text-xs">{row.sub}</p>}
            </div>
            <span className="text-2xl font-black text-emerald-400">{row.value}</span>
          </div>
        ))}
      </div>
    </section>
  );
}