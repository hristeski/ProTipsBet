"use client";

import { useEffect, useState } from "react";
import { Plus, Trophy, XCircle, CheckCircle2, Loader2 } from "lucide-react";

const API_BASE = "http://localhost:5103";

type Tip = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  predictionType: string;
  odds: number;
  result: string;
  isVip: boolean;
  isPublished: boolean;
};

export default function AdminTipsPage() {
  const [tips, setTips] = useState<Tip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTips();
  }, []);

  const fetchTips = async () => {
    const token = localStorage.getItem("protipsbet_token");
    const res = await fetch(`${API_BASE}/api/admin/tips`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) setTips(await res.json());
    setLoading(false);
  };

  const updateResult = async (id: number, result: string) => {
    const token = localStorage.getItem("protipsbet_token");
    await fetch(`${API_BASE}/api/admin/tips/${id}/result`, {
      method: "PUT",
      headers: { 
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json" 
      },
      // ПОПРАВЕНО: Сега праќаме JSON објект што C# може лесно да го прочита
      body: JSON.stringify({ result }) 
    });
    fetchTips();
  };

  if (loading) return <div className="p-8 text-center text-neutral-500"><Loader2 className="animate-spin mx-auto" /></div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-white">Tips Manager</h1>
        <button className="flex items-center gap-2 bg-emerald-500 text-neutral-950 px-4 py-2 rounded-lg font-bold hover:bg-emerald-400">
          <Plus size={18} /> Add New Tip
        </button>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-950 text-neutral-400 uppercase text-xs">
            <tr>
              <th className="p-4">Match</th>
              <th className="p-4">Type</th>
              <th className="p-4">Result</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {tips.map((tip) => (
              <tr key={tip.id} className="hover:bg-neutral-800/50">
                <td className="p-4">
                  <div className="font-bold text-white">{tip.homeTeam} vs {tip.awayTeam}</div>
                  <div className="text-xs text-neutral-500">{new Date(tip.matchDate).toLocaleDateString()}</div>
                </td>
                <td className="p-4 font-mono text-emerald-400">{tip.predictionType} (@{tip.odds})</td>
                <td className="p-4 font-bold text-white">{tip.result}</td>
                <td className="p-4 flex justify-end gap-2">
                  <button onClick={() => updateResult(tip.id, "Win")} className="text-emerald-500 hover:text-emerald-400"><CheckCircle2 size={20} /></button>
                  <button onClick={() => updateResult(tip.id, "Loss")} className="text-red-500 hover:text-red-400"><XCircle size={20} /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}