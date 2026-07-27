"use client";

import { useEffect, useState } from "react";
import { X, Loader2, CheckCircle2, BellRing } from "lucide-react";

const DELAY_MS = 5000;
const DISMISS_KEY = "epx_subscribe_toast_dismissed_session";
const SUBSCRIBED_KEY = "epx_newsletter_subscribed";
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.protipsbet.com";

export default function EmailSubscribeToast() {
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  useEffect(() => {
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
      setTimeout(() => setVisible(false), 2000);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="relative w-full max-w-sm rounded-3xl border border-zinc-800 bg-zinc-900 shadow-2xl shadow-black/60 overflow-hidden toast-in">
        <button
          onClick={handleDismiss}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="p-6 pt-8">
          <div className="flex items-center gap-2 mb-3">
            <span className="flex items-center justify-center w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400">
              <BellRing size={18} />
            </span>
            <span className="text-[11px] font-bold tracking-wider text-emerald-400 uppercase">
              Free Alerts
            </span>
          </div>

          <h2 className="text-2xl font-extrabold text-white leading-tight mb-1">
            Never Miss
            <br />
            <span className="text-emerald-400">A Winning Tip</span>
          </h2>

          <p className="text-sm text-zinc-400 mt-3 mb-5 leading-relaxed">
            Get an email the moment new Free &amp; VIP tips go live — before
            the odds move.
          </p>

          {status === "success" ? (
            <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 py-3">
              <CheckCircle2 size={18} className="shrink-0" />
              You&apos;re subscribed! Check your inbox 🎉
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="your@email.com"
                className={`w-full bg-zinc-800/80 text-white text-sm placeholder:text-zinc-500 rounded-xl px-4 py-3 border outline-none transition-colors focus:border-emerald-500/60 ${
                  status === "error" ? "border-red-500/60" : "border-zinc-700"
                }`}
              />
              {status === "error" && (
                <p className="text-[11px] text-red-400 -mt-1">
                  Please enter a valid email address.
                </p>
              )}
              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full flex items-center justify-center gap-2 text-sm font-bold px-4 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 active:bg-emerald-600 text-black transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {status === "loading" ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  "Get Free Alerts"
                )}
              </button>
            </form>
          )}

          {status !== "success" && (
            <button
              onClick={handleDismiss}
              className="w-full text-center text-[11px] font-semibold tracking-wide text-zinc-500 hover:text-zinc-300 transition-colors mt-4"
            >
              NO THANKS, I&apos;LL SKIP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}