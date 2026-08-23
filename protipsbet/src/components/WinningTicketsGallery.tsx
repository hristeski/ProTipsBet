import Link from "next/link";
import { Trophy, ExternalLink } from "lucide-react";
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
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-3 uppercase tracking-tight">
          <Trophy className="text-emerald-500" size={36} /> 
          Verified <span className="text-emerald-500">Wins</span>
        </h2>
        <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
          Real winning tickets, uploaded and publicly archived. Proof of our consistency.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {tickets.map((ticket) => (
          <Link
            key={ticket.id}
            href="/history"
            className="group relative bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-300 flex flex-col"
          >
            <div className="aspect-[3/4] relative bg-neutral-950 overflow-hidden flex items-center justify-center p-4">
              {/* eslint-disable-next-line */}
              <img
                src={`${API_BASE}${ticket.imageUrl}`}
                alt={`${ticket.description} - winning ticket @${ticket.totalOdds}`}
                className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              
              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center z-20">
                <div className="bg-emerald-500 text-neutral-950 px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  View Details <ExternalLink size={16} />
                </div>
              </div>

              {ticket.isVip && (
                <span className="absolute top-3 right-3 bg-amber-500 text-black text-[10px] font-black px-2.5 py-1 rounded shadow-lg uppercase tracking-wider z-30">
                  VIP
                </span>
              )}
            </div>
            
            <div className="p-4 border-t border-neutral-800 bg-neutral-900/80 mt-auto z-10 relative">
              <p className="text-white font-bold text-sm truncate mb-2">{ticket.description}</p>
              <div className="flex justify-between items-center">
                <p className="text-neutral-500 text-xs font-semibold">
                  {new Date(ticket.matchDate).toLocaleDateString('en-GB')}
                </p>
                <p className="text-emerald-400 font-black text-base">
                  @{Number(ticket.totalOdds).toFixed(2)}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/history"
          className="inline-flex items-center gap-2 bg-neutral-900 border border-neutral-700 text-white font-bold text-sm px-8 py-4 rounded-xl hover:bg-neutral-800 hover:border-neutral-500 transition-all shadow-lg hover:shadow-xl uppercase tracking-wide"
        >
          View Full History <ExternalLink size={16} />
        </Link>
      </div>
    </section>
  );
}