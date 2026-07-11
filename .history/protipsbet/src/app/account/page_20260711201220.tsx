"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Crown, LogOut, Loader2, Calendar, Receipt, ShieldCheck, ArrowRight, AlertTriangle } from "lucide-react";
import { API_BASE, authHeaders } from "@/lib/api";

interface UserProfile {
  id: number;
  email: string;
  fullName: string | null;
  role: string;
  isVip: boolean;
  vipExpiresAt: string | null;
}

interface Subscription {
  id: number;
  planType: string;
  price: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: string;
  createdAt: string;
}

export default function AccountPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [debugError, setDebugError] = useState<string | null>(null);

  useEffect(() => {
    const token = window.localStorage.getItem("protipsbet_token");
    if (!token) {
      router.replace("/login");
      return;
    }

    const fetchData = async () => {
      // --- /api/auth/me ---
      let meRes: Response;
      try {
        meRes = await fetch(`${API_BASE}/api/auth/me`, { headers: authHeaders() });
      } catch (err) {
        setDebugError(
          `Could not reach ${API_BASE}/api/auth/me at all (network/CORS error). ` +
          `Is the backend running? Is NEXT_PUBLIC_API_URL set correctly? Raw error: ${String(err)}`
        );
        setLoading(false);
        return;
      }

      if (meRes.status === 401) {
        // Genuinely invalid/expired token - this is the only case we auto-redirect for.
        window.localStorage.removeItem("protipsbet_token");
        router.replace("/login");
        return;
      }

      if (!meRes.ok) {
        const body = await meRes.text().catch(() => "");
        setDebugError(`GET /api/auth/me returned ${meRes.status}. Response body: ${body || "(empty)"}`);
        setLoading(false);
        return;
      }

      const meData = await meRes.json();
      setProfile(meData);

      // --- /api/subscriptions/my (non-fatal if it fails) ---
      try {
        const subsRes = await fetch(`${API_BASE}/api/subscriptions/my`, { headers: authHeaders() });
        if (subsRes.ok) {
          setSubscriptions(await subsRes.json());
        } else {
          const body = await subsRes.text().catch(() => "");
          console.error(`GET /api/subscriptions/my returned ${subsRes.status}: ${body}`);
        }
      } catch (err) {
        console.error("Could not reach /api/subscriptions/my:", err);
      }

      setLoading(false);
    };

    fetchData();
  }, [router]);

  const handleLogout = () => {
    window.localStorage.removeItem("protipsbet_token");
    router.push("/");
  };

  const statusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-emerald-500/10 text-emerald-400";
      case "PendingPayment":
        return "bg-amber-500/10 text-amber-400";
      case "Cancelled":
        return "bg-red-500/10 text-red-400";
      default:
        return "bg-neutral-800 text-neutral-400";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <Loader2 className="animate-spin text-emerald-500" size={32} />
      </div>
    );
  }

  // Instead of a silent blank page or an infinite redirect loop, show exactly
  // what went wrong. Copy this text back to Claude for a precise fix.
  if (debugError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4">
        <div className="max-w-lg w-full bg-neutral-900 border border-red-500/30 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertTriangle className="text-red-400" size={24} />
            <h1 className="font-black text-white text-lg">Couldn&apos;t load your account</h1>
          </div>
          <p className="text-xs text-neutral-400 mb-2">Debug details (copy this if you need help):</p>
          <pre className="text-xs text-red-300 bg-neutral-950 border border-neutral-800 rounded-xl p-3 whitespace-pre-wrap break-words mb-4">
            {debugError}
          </pre>
          <p className="text-xs text-neutral-500 mb-4">
            API_BASE currently resolves to: <code className="text-white">{API_BASE}</code>
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-neutral-800 text-white font-bold rounded-lg text-sm hover:bg-neutral-700 transition-colors"
            >
              Retry
            </button>
            <Link href="/login" className="px-4 py-2 bg-emerald-500 text-neutral-950 font-bold rounded-lg text-sm hover:bg-emerald-400 transition-colors">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) return null;

  const isVipActive = profile.isVip && (!profile.vipExpiresAt || new Date(profile.vipExpiresAt) > new Date());

  return (
    <div className="min-h-screen bg-zinc-950 px-4 pt-24 pb-24 md:pt-32">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-white">My Account</h1>
            <p className="text-neutral-500 text-sm">{profile.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-red-400 hover:border-red-500/30 rounded-lg text-sm font-bold transition-colors"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>

        {isVipActive ? (
          <div className="bg-gradient-to-br from-amber-500/10 to-transparent border border-amber-500/30 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-amber-500/20 rounded-xl">
                <Crown size={22} className="text-amber-400" />
              </div>
              <div>
                <p className="font-black text-white">VIP Active</p>
                <p className="text-xs text-neutral-400 flex items-center gap-1.5">
                  <Calendar size={12} /> Renews / expires {new Date(profile.vipExpiresAt!).toLocaleDateString()}
                </p>
              </div>
            </div>
            <Link
              href="/vip-tips"
              className="inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors"
            >
              View today's VIP picks <ArrowRight size={14} />
            </Link>
          </div>
        ) : (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2.5 bg-neutral-800 rounded-xl">
                <ShieldCheck size={22} className="text-neutral-500" />
              </div>
              <div>
                <p className="font-black text-white">No Active VIP Subscription</p>
                <p className="text-xs text-neutral-500">Unlock premium picks with a VIP plan.</p>
              </div>
            </div>
            <Link
              href="/vip-tips"
              className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 text-neutral-950 font-bold rounded-lg text-sm hover:bg-emerald-400 transition-colors"
            >
              <Crown size={14} /> Get VIP Access
            </Link>
          </div>
        )}

        <div>
          <h2 className="font-bold text-white mb-4 flex items-center gap-2">
            <Receipt size={16} className="text-neutral-500" /> Subscription History
          </h2>

          {subscriptions.length === 0 ? (
            <div className="text-center py-10 border border-neutral-800 border-dashed rounded-2xl text-neutral-500 text-sm">
              No subscriptions yet.
            </div>
          ) : (
            <div className="space-y-3">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-bold text-white text-sm">{sub.planType} Plan</p>
                    <p className="text-xs text-neutral-500">
                      {new Date(sub.startDate).toLocaleDateString()} — {new Date(sub.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-400 text-sm">
                      {sub.price} {sub.currency}
                    </p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${statusColor(sub.status)}`}>
                      {sub.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}