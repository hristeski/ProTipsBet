"use client";

import { useEffect, useState } from "react";
import { X, Mail, Loader2, CheckCircle2 } from "lucide-react";

const DELAY_MS = 5000;
const DISMISS_KEY = "epx_subscribe_toast_dismissed_session";
const SUBSCRIBED_KEY = "epx_newsletter_subscribed";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.protipsbet.com";

export default function EmailSubscribeToast() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
    // Ако веќе е претплатен или веќе го затворил во оваа сесија, воопшто не се прикажува
    if (
      sessionStorage.getItem(DISMISS_KEY) === "1" ||
      localStorage.getItem(SUBSCRIBED_KEY) === "1"
    ) {
      return;
    }

    const t = setTimeout(() => setVisible(true), DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  if (!visible) return null;

  const handleDismiss = () => {
    setVisible(false);
    sessionStorage.setItem(DISMISS_KEY, "1");
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      setStatus("error");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch(`${API_URL}/api/newsletter/subscribe`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("failed");
      setStatus("success");
      localStorage.setItem(SUBSCRIBED_KEY, "1");
      setTimeout(() => setVisible(false), 2500);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed top-2/18 md:top-24 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm">
      <div className="toast-in flex items-center gap-3 rounded-2xl border px-4 py-3 backdrop-blur-xl bg-zinc-900/95 shadow-xl shadow-black/40 text-sky-400 bg-sky-500/10 border-sky-500/20">
        <span className="pulse-dot shrink-0 w-2 h-2 rounded-full bg-current" />
        <Mail size={18} className="shrink-0" />

        {status === "success" ? (
          <div className="flex-1 flex items-center gap-2 text-xs font-bold text-emerald-400">
            <CheckCircle2 size={16} /> You're subscribed! 🎉
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex-1 flex items-center gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status === "error") setStatus("idle");
              }}
              placeholder="Get free & VIP tip alerts"
              className={`min-w-0 flex-1 bg-zinc-800/80 text-white text-xs placeholder:text-zinc-500 rounded-lg px-2 py-1.5 border outline-none ${
                status === "error" ? "border-red-500/60" : "border-zinc-700"
              }`}
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 text-xs font-bold px-2.5 py-1.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-white transition-colors disabled:opacity-60"
            >
              {status === "loading" ? <Loader2 size={14} className="animate-spin" /> : "Notify me"}
            </button>
          </form>
        )}

        <button
          onClick={handleDismiss}
          aria-label="Dismiss notification"
          className="shrink-0 text-zinc-400 hover:text-white transition-colors p-1"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}