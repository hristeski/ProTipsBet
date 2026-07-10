"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, X, Power, Tag } from "lucide-react";

const API_BASE = "http://localhost:5103";

type Discount = {
  id: number;
  code: string;
  percentOff: number | null;
  amountOff: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
  createdAt: string;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("protipsbet_token");
}

export default function AdminDiscountsPage() {
  const [codes, setCodes] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    code: "",
    discountType: "percent" as "percent" | "amount",
    value: 10,
    maxUses: "",
    expiresAt: "",
  });

  const fetchCodes = async () => {
    const token = getToken();
    try {
      const res = await fetch(`${API_BASE}/api/admin/discounts`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) setCodes(await res.json());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCodes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    const token = getToken();

    try {
      const res = await fetch(`${API_BASE}/api/admin/discounts`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: form.code,
          percentOff: form.discountType === "percent" ? form.value : null,
          amountOff: form.discountType === "amount" ? form.value : null,
          maxUses: form.maxUses ? parseInt(form.maxUses) : null,
          expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setForm({ code: "", discountType: "percent", value: 10, maxUses: "", expiresAt: "" });
        fetchCodes();
      } else {
        const data = await res.json();
        setError(data.message ?? "Couldn't create the discount code.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const toggleActive = async (id: number) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/admin/discounts/${id}/toggle`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) fetchCodes();
  };

  const deleteCode = async (id: number) => {
    if (!confirm("Delete this discount code?")) return;
    const token = getToken();
    await fetch(`${API_BASE}/api/admin/discounts/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchCodes();
  };

  if (loading)
    return (
      <div className="p-8 text-center text-neutral-500">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-white">Discount Codes</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 text-neutral-950 px-4 py-2 rounded-lg font-bold hover:bg-emerald-400 transition-colors"
        >
          <Plus size={18} /> New Code
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-950 text-neutral-400 uppercase text-xs border-b border-neutral-800">
            <tr>
              <th className="p-4">Code</th>
              <th className="p-4">Discount</th>
              <th className="p-4">Usage</th>
              <th className="p-4">Expires</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {codes.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-neutral-500">
                  No discount codes yet.
                </td>
              </tr>
            ) : (
              codes.map((c) => (
                <tr key={c.id} className="hover:bg-neutral-800/50">
                  <td className="p-4 font-mono font-bold text-white flex items-center gap-2">
                    <Tag size={14} className="text-emerald-400" /> {c.code}
                  </td>
                  <td className="p-4 text-emerald-400 font-bold">
                    {c.percentOff ? `${c.percentOff}% off` : `€${c.amountOff} off`}
                  </td>
                  <td className="p-4 text-neutral-400">
                    {c.usedCount}
                    {c.maxUses ? ` / ${c.maxUses}` : " / ∞"}
                  </td>
                  <td className="p-4 text-neutral-500 text-xs">
                    {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : "Never"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded text-xs font-bold ${
                        c.isActive ? "bg-emerald-500/10 text-emerald-400" : "bg-neutral-800 text-neutral-500"
                      }`}
                    >
                      {c.isActive ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="p-4 flex justify-end gap-3">
                    <button
                      onClick={() => toggleActive(c.id)}
                      title={c.isActive ? "Disable" : "Enable"}
                      className="text-neutral-500 hover:text-white transition-colors"
                    >
                      <Power size={16} />
                    </button>
                    <button
                      onClick={() => deleteCode(c.id)}
                      title="Delete"
                      className="text-neutral-500 hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-neutral-800 bg-neutral-950">
              <h2 className="font-black text-white text-lg">New Discount Code</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreate} className="p-5 space-y-4">
              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-lg p-3 text-xs">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Code</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. WELCOME10"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Type</label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value as "percent" | "amount" })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  >
                    <option value="percent">Percent off</option>
                    <option value="amount">Fixed amount off (€)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">
                    {form.discountType === "percent" ? "Percent (%)" : "Amount (€)"}
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={form.discountType === "percent" ? 100 : undefined}
                    value={form.value}
                    onChange={(e) => setForm({ ...form, value: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Max Uses</label>
                  <input
                    type="number"
                    placeholder="Unlimited"
                    value={form.maxUses}
                    onChange={(e) => setForm({ ...form, maxUses: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Expires</label>
                  <input
                    type="date"
                    value={form.expiresAt}
                    onChange={(e) => setForm({ ...form, expiresAt: e.target.value })}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full flex justify-center items-center gap-2 py-3 bg-emerald-500 text-neutral-950 font-black rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 mt-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : "Create Code"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
