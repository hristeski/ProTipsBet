"use client";

import { useEffect, useState } from "react";
import { Plus, XCircle, CheckCircle2, Loader2, X, Trash2, Pencil } from "lucide-react";
import { API_BASE, authHeaders } from "@/lib/api";

type Tip = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league?: string;
  matchDate: string;
  predictionType: string;
  odds: number;
  result: string;
  isVip: boolean;
  isPublished: boolean;
  analysis?: string;
  tags?: string;
};

const emptyForm = () => ({
  homeTeam: "",
  awayTeam: "",
  league: "",
  matchDate: "",
  predictionType: "",
  odds: 1.5,
  isVip: false,
  isPublished: true,
  analysis: "",
  tags: "",
});

// datetime-local инпутот бара "YYYY-MM-DDTHH:mm" без timezone info
const toDateTimeLocal = (iso: string) => {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

export default function AdminTipsPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState(emptyForm());

  const isEditMode = editingId !== null;

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/tips`, { headers: authHeaders() });
      if (res.ok) setTips(await res.json());
    } catch (err) {
      console.error("Failed to fetch tips", err);
    } finally {
      setLoading(false);
    }
  };

  const updateResult = async (id: number, result: string) => {
    await fetch(`${API_BASE}/api/admin/tips/${id}/result`, {
      method: "PUT",
      headers: { ...authHeaders(), "Content-Type": "application/json" },
      body: JSON.stringify({ result }),
    });
    fetchTips();
  };

  const deleteTip = async (id: number) => {
    if (!confirm("Дали си сигурен дека сакаш да го избришеш овој натпревар?")) return;
    await fetch(`${API_BASE}/api/admin/tips/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    fetchTips();
  };

  const openCreateModal = () => {
    setEditingId(null);
    setForm(emptyForm());
    setIsModalOpen(true);
  };

 const openEditModal = (tip: Tip) => {
  setEditingId(tip.id);
  setForm({
    homeTeam: tip.homeTeam,
    awayTeam: tip.awayTeam,
    league: tip.league ?? "",
    matchDate: toDateTimeLocal(tip.matchDate),
    predictionType: tip.predictionType,
    odds: tip.odds,
    isVip: tip.isVip,
    isPublished: tip.isPublished,
    analysis: tip.analysis ?? "",
    tags: tip.tags ?? "",
  });
  setIsModalOpen(true);
};

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm(emptyForm());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...form,
      matchDate: new Date(form.matchDate).toISOString(),
    };

    try {
      const url = isEditMode
        ? `${API_BASE}/api/admin/tips/${editingId}`
        : `${API_BASE}/api/admin/tips`;
      const method = isEditMode ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { ...authHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        closeModal();
        fetchTips();
      } else {
        alert(isEditMode ? "Грешка при зачувување на измените." : "Грешка при зачувување на натпреварот.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center text-neutral-500"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-white">Tips Manager</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-emerald-500 text-neutral-950 px-4 py-2 rounded-lg font-bold hover:bg-emerald-400 transition-colors"
        >
          <Plus size={18} /> Add New Tip
        </button>
      </div>

      {/* ТАБЕЛА */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-950 text-neutral-400 uppercase text-xs border-b border-neutral-800">
            <tr>
              <th className="p-4">Match</th>
              <th className="p-4">Type</th>
              <th className="p-4">Status</th>
              <th className="p-4">Result</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {tips.length === 0 ? (
              <tr><td colSpan={5} className="p-8 text-center text-neutral-500">Нема внесено натпревари.</td></tr>
            ) : tips.map((tip) => (
              <tr key={tip.id} className="hover:bg-neutral-800/50">
                <td className="p-4">
                  <div className="font-bold text-white">{tip.homeTeam} vs {tip.awayTeam}</div>
                  <div className="text-xs text-neutral-500">{new Date(tip.matchDate).toLocaleString()}</div>
                </td>
                <td className="p-4 font-mono text-emerald-400 font-bold">{tip.predictionType} <span className="text-neutral-500">(@{tip.odds})</span></td>
                <td className="p-4">
                  {tip.isVip ? (
                    <span className="bg-amber-500/10 text-amber-400 px-2 py-1 rounded text-xs font-bold">VIP</span>
                  ) : (
                    <span className="bg-blue-500/10 text-blue-400 px-2 py-1 rounded text-xs font-bold">FREE</span>
                  )}
                  {!tip.isPublished && (
                    <span className="ml-2 bg-neutral-800 text-neutral-400 px-2 py-1 rounded text-xs font-bold">DRAFT</span>
                  )}
                </td>
                <td className="p-4 font-bold text-white">{tip.result}</td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => openEditModal(tip)} title="Измени" className="text-neutral-500 hover:text-blue-400 transition-colors"><Pencil size={20} /></button>
                  <button onClick={() => updateResult(tip.id, "Win")} title="Означи како Добитен" className="text-neutral-500 hover:text-emerald-400 transition-colors"><CheckCircle2 size={20} /></button>
                  <button onClick={() => updateResult(tip.id, "Loss")} title="Означи како Губитен" className="text-neutral-500 hover:text-red-400 transition-colors"><XCircle size={20} /></button>
                  <button onClick={() => deleteTip(tip.id)} title="Избриши" className="text-neutral-500 hover:text-red-500 transition-colors ml-2">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* МОДАЛ ЗА ДОДАВАЊЕ / ИЗМЕНА НА ТИП */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex justify-between items-center p-4 border-b border-neutral-800 bg-neutral-950">
              <h2 className="font-black text-white text-lg">{isEditMode ? "Edit Tip" : "Add New Tip"}</h2>
              <button onClick={closeModal} className="text-neutral-500 hover:text-white"><X size={20} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Home Team</label>
                  <input type="text" required value={form.homeTeam} onChange={e => setForm({ ...form, homeTeam: e.target.value })} className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Away Team</label>
                  <input type="text" required value={form.awayTeam} onChange={e => setForm({ ...form, awayTeam: e.target.value })} className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">League</label>
                <input type="text" value={form.league} onChange={e => setForm({ ...form, league: e.target.value })} placeholder="e.g. Premier League" className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Prediction (ex. 1, GG)</label>
                  <input type="text" required value={form.predictionType} onChange={e => setForm({ ...form, predictionType: e.target.value })} className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Odds</label>
                  <input type="number" step="0.01" required value={form.odds} onChange={e => setForm({ ...form, odds: parseFloat(e.target.value) })} className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Match Date & Time</label>
                <input type="datetime-local" required value={form.matchDate} onChange={e => setForm({ ...form, matchDate: e.target.value })} className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none [color-scheme:dark]" />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Analysis (опционално)</label>
                <textarea value={form.analysis} onChange={e => setForm({ ...form, analysis: e.target.value })} rows={3} className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none resize-none" />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={e => setForm({ ...form, tags: e.target.value })}
                  placeholder="e.g. Derby, High Odds, Weekend"
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex gap-6 py-2">
                <label className="flex items-center gap-2 text-sm text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={form.isVip} onChange={e => setForm({ ...form, isVip: e.target.checked })} className="w-4 h-4 accent-emerald-500" />
                  VIP Match
                </label>
                <label className="flex items-center gap-2 text-sm text-white font-bold cursor-pointer">
                  <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} className="w-4 h-4 accent-emerald-500" />
                  Publish Immediately
                </label>
              </div>

              <button type="submit" disabled={submitting} className="w-full flex justify-center items-center gap-2 py-3 bg-emerald-500 text-neutral-950 font-black rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 mt-4">
                {submitting ? <Loader2 size={18} className="animate-spin" /> : isEditMode ? "Save Changes" : "Save Match"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}