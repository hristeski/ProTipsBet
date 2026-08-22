import Link from "next/link";
import { Trophy } from "lucide-react";
import { API_BASE } from "@/lib/api";

interface Ticket {
  id: number;
  imageUrl: string;
  description: string;
  totalOdds: number;
  matchDate: string;
  isVip: boolean;
}

async function getRecentTickets(): Promise<Ticket[]> {
  try {
    const res = await fetch(`${API_BASE}/api/tips/tickets`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.slice(0, 8) : [];
  } catch {
    return [];
  }
}

export default async function WinningTicketsGallery() {
  const tickets = await getRecentTickets();
  if (tickets.length === 0) return null;

  return (
    <section className="reveal px-6 py-16 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-black text-white mb-2 flex items-center justify-center gap-2">
          <Trophy className="text-emerald-500" size={28} /> Verified Wins
        </h2>
        <p className="text-zinc-400 text-sm">Real winning tickets, uploaded and publicly archived.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href="/history"
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-colors"
          >
            <div className="aspect-[3/4] relative bg-zinc-950">
              {/* eslint-disable-next-line */}
              <img
                src={`${API_BASE}${ticket.imageUrl}`}
                alt={`${ticket.description} - winning ticket @${ticket.totalOdds}`}
                className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform"
                loading="lazy"
              />
              {ticket.isVip && (
                <span className="absolute top-2 right-2 bg-amber-500 text-black text-[10px] font-black px-2 py-0.5 rounded">
                  VIP
                </span>
              )}
            </div>
            <div className="p-3">
              <p className="text-white font-bold text-xs truncate">{ticket.description}</p>
              <p className="text-emerald-400 font-black text-sm">@{Number(ticket.totalOdds).toFixed(2)}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-8">
        <Link
          href="/history"
          className="inline-block bg-zinc-900 border border-zinc-800 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors"
        >
          View Full History
        </Link>
      </div>
    </section>
  );
}