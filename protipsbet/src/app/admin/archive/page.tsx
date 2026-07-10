"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, X, Image as ImageIcon, ListPlus } from "lucide-react";
import { API_BASE, authHeaders } from "@/lib/api";

interface Leg {
  league: string;
  matchDate: string; // datetime-local string
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  odds: number;
}

interface TicketLeg {
  id: number;
  league?: string;
  matchDate: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  odds: number;
}

interface Ticket {
  id: number;
  imageUrl: string;
  description: string;
  totalOdds: number;
  matchDate: string;
  isVip: boolean;
  legs: TicketLeg[];
}

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("protipsbet_token");
}

const emptyLeg = (): Leg => ({
  league: "",
  matchDate: "",
  homeTeam: "",
  awayTeam: "",
  prediction: "",
  odds: 1.5,
});

export default function AdminArchivePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const [description, setDescription] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [isVip, setIsVip] = useState(false);
  const [legs, setLegs] = useState<Leg[]>([emptyLeg()]);

  const totalOdds = legs.reduce((acc, l) => acc * (Number(l.odds) || 1), 1);

  useEffect(() => {
    fetchTickets();
  }, []);

  const fetchTickets = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/archive`, { headers: authHeaders() });
      if (res.ok) setTickets(await res.json());
    } finally {
      setLoading(false);
    }
  };

  const deleteTicket = async (id: number) => {
    if (!confirm("Delete this ticket? The image will be permanently removed.")) return;
    await fetch(`${API_BASE}/api/admin/archive/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    });
    fetchTickets();
  };

  const updateLeg = (index: number, field: keyof Leg, value: string | number) => {
    setLegs((prev) => prev.map((l, i) => (i === index ? { ...l, [field]: value } : l)));
  };

  const addLeg = () => setLegs((prev) => [...prev, emptyLeg()]);
  const removeLeg = (index: number) => setLegs((prev) => prev.filter((_, i) => i !== index));

  const resetForm = () => {
    setFile(null);
    setDescription("");
    setMatchDate("");
    setIsVip(false);
    setLegs([emptyLeg()]);
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      alert("Please select an image.");
      return;
    }

    setSubmitting(true);
    const token = getToken();

    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description);
    formData.append("totalOdds", totalOdds.toFixed(2));
    formData.append("matchDate", new Date(matchDate).toISOString());
    formData.append("isVip", isVip.toString());

    const validLegs = legs
      .filter((l) => l.homeTeam && l.awayTeam && l.prediction)
      .map((l) => ({
        league: l.league,
        matchDate: l.matchDate ? new Date(l.matchDate).toISOString() : new Date(matchDate).toISOString(),
        homeTeam: l.homeTeam,
        awayTeam: l.awayTeam,
        prediction: l.prediction,
        odds: Number(l.odds),
      }));
    formData.append("legsJson", JSON.stringify(validLegs));

    try {
      const res = await fetch(`${API_BASE}/api/admin/archive`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }, // no Content-Type — browser sets multipart boundary
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchTickets();
        resetForm();
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.message ?? "Couldn't upload the ticket.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading)
    return (
      <div className="p-8 text-center text-neutral-500">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-white">Tickets Archive</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 text-neutral-950 px-4 py-2 rounded-lg font-bold hover:bg-emerald-400 transition-colors"
        >
          <Plus size={18} /> Upload Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tickets.length === 0 ? (
          <div className="col-span-full py-12 text-center text-neutral-500 border border-neutral-800 border-dashed rounded-2xl">
            No tickets uploaded yet.
          </div>
        ) : (
          tickets.map((ticket) => (
            <div key={ticket.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-lg flex flex-col">
              <div className="relative h-48 bg-neutral-950 flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={`${API_BASE}${ticket.imageUrl}`} alt="Winning Ticket" className="w-full h-full object-contain" />
                {ticket.isVip && (
                  <span className="absolute top-2 right-2 bg-amber-500 text-neutral-950 text-xs font-black px-2 py-1 rounded">VIP</span>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-white truncate pr-2">{ticket.description}</h3>
                  <span className="text-emerald-400 font-black">@{ticket.totalOdds}</span>
                </div>
                <p className="text-xs text-neutral-500 mb-3">{new Date(ticket.matchDate).toLocaleDateString()}</p>

                {ticket.legs?.length > 0 && (
                  <div className="space-y-1.5 mb-4 flex-1">
                    {ticket.legs.map((leg) => (
                      <div key={leg.id} className="text-xs bg-neutral-950 rounded-lg px-2.5 py-1.5 flex justify-between gap-2">
                        <span className="text-neutral-400 truncate">
                          {leg.homeTeam} vs {leg.awayTeam}
                        </span>
                        <span className="text-emerald-400 font-bold shrink-0">{leg.prediction} @{leg.odds}</span>
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={() => deleteTicket(ticket.id)}
                  className="mt-auto w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors text-sm font-bold"
                >
                  <Trash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl my-8">
            <div className="flex justify-between items-center p-4 border-b border-neutral-800 bg-neutral-950 sticky top-0">
              <h2 className="font-black text-white text-lg">Upload Winning Ticket</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleUpload} className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              <div>
                <label className="block text-xs font-bold text-neutral-400 mb-2 uppercase">Ticket Screenshot</label>
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-neutral-800 border-dashed rounded-xl cursor-pointer bg-neutral-950 hover:bg-neutral-900/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <ImageIcon className="w-8 h-8 mb-2 text-neutral-500" />
                    <p className="text-sm text-neutral-400">
                      {file ? <span className="text-emerald-400 font-bold">{file.name}</span> : "Click to upload image"}
                    </p>
                  </div>
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] || null)} />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Weekend Combo"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1 uppercase">Ticket Date</label>
                  <input
                    type="date"
                    required
                    value={matchDate}
                    onChange={(e) => setMatchDate(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-lg text-white focus:border-emerald-500 focus:outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm text-white font-bold cursor-pointer w-fit">
                <input type="checkbox" checked={isVip} onChange={(e) => setIsVip(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
                VIP Ticket
              </label>

              {/* ---------- MATCH LEGS ---------- */}
              <div className="border-t border-neutral-800 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold text-neutral-400 uppercase flex items-center gap-2">
                    <ListPlus size={14} /> Matches in this ticket
                  </label>
                  <span className="text-xs text-neutral-500">
                    Combined odds: <span className="text-emerald-400 font-bold">@{totalOdds.toFixed(2)}</span>
                  </span>
                </div>

                <div className="space-y-3">
                  {legs.map((leg, i) => (
                    <div key={i} className="bg-neutral-950 border border-neutral-800 rounded-xl p-3 space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-bold text-neutral-500">Match {i + 1}</span>
                        {legs.length > 1 && (
                          <button type="button" onClick={() => removeLeg(i)} className="text-neutral-600 hover:text-red-400">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="League (e.g. Serie A)"
                          value={leg.league}
                          onChange={(e) => updateLeg(i, "league", e.target.value)}
                          className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                        <input
                          type="datetime-local"
                          value={leg.matchDate}
                          onChange={(e) => updateLeg(i, "matchDate", e.target.value)}
                          className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none [color-scheme:dark]"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Home team"
                          value={leg.homeTeam}
                          onChange={(e) => updateLeg(i, "homeTeam", e.target.value)}
                          className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                        <input
                          type="text"
                          required
                          placeholder="Away team"
                          value={leg.awayTeam}
                          onChange={(e) => updateLeg(i, "awayTeam", e.target.value)}
                          className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          required
                          placeholder="Prediction (e.g. Over 2.5)"
                          value={leg.prediction}
                          onChange={(e) => updateLeg(i, "prediction", e.target.value)}
                          className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                        <input
                          type="number"
                          step="0.01"
                          required
                          placeholder="Odds"
                          value={leg.odds}
                          onChange={(e) => updateLeg(i, "odds", parseFloat(e.target.value))}
                          className="px-2.5 py-1.5 bg-neutral-900 border border-neutral-800 rounded-lg text-white text-sm focus:border-emerald-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={addLeg}
                  className="mt-3 flex items-center gap-2 text-emerald-400 text-sm font-bold hover:text-emerald-300 transition-colors"
                >
                  <Plus size={16} /> Add another match
                </button>
              </div>

              <button
                type="submit"
                disabled={submitting || !file}
                className="w-full flex justify-center items-center gap-2 py-3 bg-emerald-500 text-neutral-950 font-black rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 mt-2"
              >
                {submitting ? <Loader2 size={18} className="animate-spin" /> : "Upload Ticket"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
