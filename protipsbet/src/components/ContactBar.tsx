// components/ContactBar.tsx
import { MessageCircle } from "lucide-react";

export default function ContactBar() {
  return (
    <a
      href="https://wa.me/5493815694938"
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/30 hover:border-[#25D366]/60 rounded-full pl-3 pr-5 py-2.5 transition-colors group"
    >
      <div className="bg-[#25D366] rounded-full p-2 shrink-0">
        <MessageCircle size={16} className="text-zinc-950" />
      </div>
      <div className="text-left">
        <p className="text-[#25D366] font-black text-sm leading-tight">+54 9 3815 69-4938</p>
        <p className="text-zinc-500 text-[10px] font-medium">Tap to chat on WhatsApp</p>
      </div>
    </a>
  );
}