"use client";

import { useEffect, useState, useCallback } from "react";
import { CheckCircle2, XCircle, Clock, ImageOff, RefreshCw, ShieldAlert } from "lucide-react";

const API_BASE = "http://localhost:5103";

type PendingPayment = {
  id: number;
  userId: number;
  userEmail: string;
  subscriptionId: number | null;
  planType: string | null;
  method: string;
  amount: number;
  currency: string;
  receiptUrl: string | null;
  createdAt: string;
};

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("protipsbet_token");
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<PendingPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<number | null>(null);
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getToken();

    if (!token) {
      setError("You're not logged in as an admin.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/payments`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401 || res.status === 403) {
        setError("Your session doesn't have admin access.");
        setPayments([]);
        return;
      }

      if (!res.ok) throw new Error("Failed to load payments.");

      const data: PendingPayment[] = await res.json();
      setPayments(data);
    } catch {
      setError("Couldn't reach the server. Is the backend running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const handleApprove = async (id: number) => {
    const token = getToken();
    if (!token) return;

    setActioningId(id);
    try {
      const res = await fetch(`${API_BASE}/api/admin/payments/${id}/approve`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      setPayments((prev) => prev.filter((p) => p.id !== id));
    } catch {
      alert("Couldn't approve this payment. Try again.");
    } finally {
      setActioningId(null);
    }
  };

  const handleReject = async (id: number) => {
    const token = getToken();
    if (!token) return;

    setActioningId(id);
    try {
      const res = await fetch(`${API_BASE}/api/admin/payments/${id}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reason: rejectReason || null }),
      });
      if (!res.ok) throw new Error();
      setPayments((prev) => prev.filter((p) => p.id !== id));
      setRejectingId(null);
      setRejectReason("");
    } catch {
      alert("Couldn't reject this payment. Try again.");
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white px-4 py-8 pb-24">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-black">Pending Payments</h1>
            <p className="text-sm text-neutral-500">
              {loading ? "Loading…" : `${payments.length} awaiting review`}
            </p>
          </div>
          <button
            onClick={fetchPayments}
            className="p-2 rounded-lg border border-neutral-800 bg-neutral-900 hover:bg-neutral-800 transition-colors"
            title="Refresh"
          >
            <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
          </button>
        </div>

        {error && (
          <div className="flex items-center gap-3 bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4 mb-6 text-sm">
            <ShieldAlert size={20} className="shrink-0" />
            {error}
          </div>
        )}

        {!loading && !error && payments.length === 0 && (
          <div className="text-center py-20 text-neutral-500">
            <CheckCircle2 size={40} className="mx-auto mb-3 text-neutral-700" />
            Nothing to review right now.
          </div>
        )}

        <div className="space-y-4">
          {payments.map((p) => (
            <div
              key={p.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-5"
            >
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="font-bold text-white">{p.userEmail}</p>
                  <p className="text-xs text-neutral-500 flex items-center gap-1.5 mt-1">
                    <Clock size={12} /> {formatDate(p.createdAt)}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-lg font-black text-emerald-400">
                    {p.amount} {p.currency}
                  </p>
                  <p className="text-xs text-neutral-500">
                    {p.planType ?? "—"} · {p.method}
                  </p>
                </div>
              </div>

              {p.receiptUrl ? (
                <a
                  href={`${API_BASE}${p.receiptUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block mb-4"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`${API_BASE}${p.receiptUrl}`}
                    alt="Payment proof"
                    className="max-h-64 rounded-xl border border-neutral-800 hover:opacity-90 transition-opacity"
                  />
                </a>
              ) : (
                <div className="flex items-center gap-2 text-neutral-600 text-sm mb-4 py-6 justify-center border border-dashed border-neutral-800 rounded-xl">
                  <ImageOff size={16} /> No receipt attached
                </div>
              )}

              {rejectingId === p.id ? (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Reason (optional, sent to the user)"
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-sm focus:outline-none focus:border-red-500"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleReject(p.id)}
                      disabled={actioningId === p.id}
                      className="flex-1 py-2.5 bg-red-500 text-white font-bold rounded-lg text-sm hover:bg-red-600 transition-colors disabled:opacity-60"
                    >
                      Confirm Reject
                    </button>
                    <button
                      onClick={() => {
                        setRejectingId(null);
                        setRejectReason("");
                      }}
                      className="px-4 py-2.5 bg-neutral-800 text-neutral-300 font-bold rounded-lg text-sm hover:bg-neutral-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleApprove(p.id)}
                    disabled={actioningId === p.id}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 text-neutral-950 font-black rounded-lg text-sm hover:bg-emerald-400 transition-colors disabled:opacity-60"
                  >
                    <CheckCircle2 size={16} /> Approve
                  </button>
                  <button
                    onClick={() => setRejectingId(p.id)}
                    disabled={actioningId === p.id}
                    className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-neutral-800 text-neutral-300 font-black rounded-lg text-sm hover:bg-neutral-700 transition-colors disabled:opacity-60"
                  >
                    <XCircle size={16} /> Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}