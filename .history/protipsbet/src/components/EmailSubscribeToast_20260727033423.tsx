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
    <div className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm px-2 sm:px-0">
      <div className="toast-in flex flex-col gap-2 rounded-2xl border border-sky-500/20 bg-zinc-900/95 backdrop-blur-xl shadow-xl shadow-black/40 p-4">
        <div className="flex items-start gap-3">
          <div className="shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-sky-500/10 text-sky-400">
            <Mail size={16} />
          </div>

          <div className="flex-1 min-w-0">
            {status === "success" ? (
              <div className="flex items-center gap-2 text-sm font-semibold text-emerald-400 py-1">
                <CheckCircle2 size={16} className="shrink-0" />
                You&apos;re subscribed! 🎉
              </div>
            ) : (
              <>
                <p className="text-xs font-bold text-white leading-snug mb-2">
                  Never miss a tip — get Free &amp; VIP alerts by email
                </p>
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
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
                    className={`min-w-0 flex-1 bg-zinc-800/80 text-white text-xs placeholder:text-zinc-500 rounded-lg px-3 py-2 border outline-none transition-colors focus:border-sky-500/60 ${
                      status === "error" ? "border-red-500/60" : "border-zinc-700"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="shrink-0 text-xs font-bold px-3 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 active:bg-sky-600 text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {status === "loading" ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      "Notify me"
                    )}
                  </button>
                </form>
                {status === "error" && (
                  <p className="text-[11px] text-red-400 mt-1">
                    Please enter a valid email address.
                  </p>
                )}
              </>
            )}
          </div>

          <button
            onClick={handleDismiss}
            aria-label="Dismiss notification"
            className="shrink-0 text-zinc-500 hover:text-white transition-colors p-1 -mt-1 -mr-1"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}