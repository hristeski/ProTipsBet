import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/lib/testimonials";

export default function Testimonials() {
  return (
    <section className="reveal px-6 py-20 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2">What Our Clients Say</h2>
        <p className="text-zinc-400 text-sm">Real feedback from VIP and Weekly subscribers.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {TESTIMONIALS.map((t, i) => (
          <div key={i} className="shine-hover bg-zinc-900/50 border border-zinc-800 rounded-2xl p-5 flex flex-col">
            <div className="flex gap-0.5 mb-3">
              {Array.from({ length: 5 }).map((_, s) => (
                <Star key={s} size={14} className={s < t.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"} />
              ))}
            </div>
            <p className="text-zinc-300 text-sm leading-relaxed mb-4 flex-grow">&ldquo;{t.quote}&rdquo;</p>
            <div>
              <p className="text-white font-bold text-sm">{t.name}</p>
              <p className="text-zinc-500 text-xs">{t.role}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}