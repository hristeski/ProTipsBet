"use client";

import { useState } from "react";
import { MessageCircle, Mail, Send, X } from "lucide-react";
import { SUPPORT_WHATSAPP_LINK, SUPPORT_TELEGRAM, SUPPORT_EMAIL } from "@/lib/support";

export default function HelpButton() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed left-4 md:left-8 z-40 bottom-28 md:bottom-8">
      {open && (
        <div className="toast-in mb-3 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl p-4 shadow-2xl shadow-black/40">
          <div className="flex items-center justify-between mb-3">
            <p className="text-white font-bold text-sm">Need help?</p>
            <button onClick={() => setOpen(false)} className="text-zinc-500 hover:text-white">
              <X size={16} />
            </button>
          </div>
          <p className="text-zinc-500 text-xs mb-4">
            Stuck on payment, or already paid and want to speed things up? Message us.
          </p>
          <div className="flex flex-col gap-2">
            <a
              href={SUPPORT_WHATSAPP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 bg-[#25D366] text-zinc-950 font-bold rounded-xl text-sm hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={16} /> WhatsApp
            </a>
            <a
              href={SUPPORT_TELEGRAM}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-2.5 bg-zinc-800 text-white font-bold rounded-xl text-sm hover:bg-zinc-700 transition-colors"
            >
              <Send size={16} /> Telegram
            </a>
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className="flex items-center gap-2 px-3 py-2.5 bg-zinc-800 text-white font-bold rounded-xl text-sm hover:bg-zinc-700 transition-colors"
            >
              <Mail size={16} /> Email
            </a>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Need help?"
        className="w-14 h-14 rounded-full bg-[#25D366] text-zinc-950 shadow-lg shadow-black/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
}
