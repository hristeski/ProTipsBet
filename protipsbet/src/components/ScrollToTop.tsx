"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Back to top"
      className="
        fixed right-4 md:right-8 z-40
        bottom-28 md:bottom-8
        w-12 h-12 rounded-full
        bg-zinc-900/90 border border-emerald-500/40
        backdrop-blur-xl shadow-lg shadow-black/40
        flex items-center justify-center
        text-emerald-400 hover:text-zinc-950 hover:bg-emerald-400
        transition-all duration-300 hover:scale-110 active:scale-95
        toast-in
      "
    >
      <ArrowUp size={20} strokeWidth={2.5} />
    </button>
  );
}