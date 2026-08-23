"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import { API_BASE } from "@/lib/api";
import TicketLightbox, { LightboxTicket } from "@/components/TicketLightbox";

export default function TicketGalleryGrid({ tickets }: { tickets: LightboxTicket[] }) {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {tickets.map((ticket, i) => (
          <button
            key={ticket.id}
            onClick={() => setSelectedIndex(i)}
            className="group relative bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden hover:border-emerald-500/40 transition-colors text-left"
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
          </button>
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

      <AnimatePresence>
        {selectedIndex !== null && (
          <TicketLightbox
            tickets={tickets}
            index={selectedIndex}
            onIndexChange={setSelectedIndex}
            onClose={() => setSelectedIndex(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}