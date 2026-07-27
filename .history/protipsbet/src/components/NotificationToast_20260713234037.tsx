"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Percent, Trophy, MessageCircle } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface ToastMessage {
  icon: LucideIcon;
  text: string;
  href: string;
  accent: string;
}

// Поагресивни и поубедливи маркетиншки пораки
const MESSAGES: ToastMessage[] = [
  {
    icon: Trophy,
    text: "🔥 Don't miss out! Today's VIP & Free tips are LIVE. Secure your profit!",
    href: "/vip-tips",
    accent: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  },
  {
    icon: Percent,
    text: "⚡ Flash Promo: Get 20% OFF the Monthly VIP pass today only!",
    href: "/vip-tips",
    accent: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  },
  {
    icon: MessageCircle,
    text: "💬 Want to win big? Join our Telegram group for exclusive live picks!",
    href: "/contact",
    accent: "text-sky-400 bg-sky-500/10 border-sky-500/20",
  },
];

const ROTATE_MS = 6000;
const DISMISS_KEY = "epx_toast_dismissed_session";

export default function NotificationToast() {
  const [index, setIndex] = useState(0);
  const [closed, setClosed] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (sessionStorage.getItem(DISMISS_KEY) === "1") setClosed(true);
  }, []);

  useEffect(() => {
    if (closed) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % MESSAGES.length), ROTATE_MS);
    return () => clearInterval(t);
  }, [closed]);

  if (!mounted || closed) return null;

  const msg = MESSAGES[index];
  const Icon = msg.icon;

  return (
    // ГЛАВНАТА ПРОМЕНА Е ТУКА ВО КЛАСИТЕ: bottom-6 за мобилен, md:bottom-auto md:top-24 за десктоп
    <div className="fixed bottom-6 md:bottom-auto md:top-10 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm">
      <div
        key={index}
        className={`toast-in flex items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-xl bg-zinc-900/95 shadow-xl shadow-black/40 ${msg.accent}`}
      >
        <span className="pulse-dot shrink-0 w-2 h-2 rounded-full bg-current" />
        <Icon size={18} className="shrink-0" />
        <Link href={msg.href} className="flex-1 text-xs font-bold text-white leading-snug">
          {msg.text}
        </Link>
        <button
          onClick={() => {
            setClosed(true);
            sessionStorage.setItem(DISMISS_KEY, "1");
          }}
          aria-label="Dismiss notification"
          className="shrink-0 text-zinc-400 hover:text-white transition-colors p-1"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}