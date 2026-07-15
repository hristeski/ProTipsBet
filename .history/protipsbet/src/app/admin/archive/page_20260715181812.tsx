"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Loader2, X, Image as ImageIcon, ListPlus, Calculator } from "lucide-react";
import { API_BASE, authHeaders } from "@/lib/api";

interface Leg {
  league: string;
  matchDate: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  odds: number | string;
}

interface Ticket {
  id: number;
  imageUrl: string;
  description: string;
  totalOdds: number;
  matchDate: string;
  isVip: boolean;
  legs: any[];
}

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("protipsbet_token");
}

const emptyLeg = (): Leg => ({ league: "", matchDate: "", homeTeam: "", awayTeam: "", prediction: "", odds: "" });

export default function AdminArchivePage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState("");
  const [matchDate, setMatchDate] = useState("");
  const [isVip, setIsVip] = useState(false);
  const [legs, setLegs] = useState<Leg[]>([emptyLeg()]);

  // Auto-calculate odds
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
    if (!confirm("Are you sure you want to delete this ticket?")) return;
    await fetch(`${API_BASE}/api/admin/archive/${id}`, { method: "DELETE", headers: authHeaders() });
    fetchTickets();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
      setPreviewUrl(URL.createObjectURL(selected)); // Create image preview
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select an image!");

    // SAFE DATE HANDLING: Default to today if empty
    const finalDate = matchDate ? new Date(matchDate).toISOString() : new Date().toISOString();

    setSubmitting(true);
    const formData = new FormData();
    formData.append("image", file);
    formData.append("description", description || "Winning Ticket");
    formData.append("totalOdds", totalOdds.toFixed(2));
    formData.append("matchDate", finalDate);
    formData.append("isVip", isVip.toString());

    // Filter valid legs
    const validLegs = legs
      .filter((l) => l.homeTeam && l.awayTeam && l.prediction)
      .map((l) => ({
        league: l.league || "Custom",
        matchDate: l.matchDate ? new Date(l.matchDate).toISOString() : finalDate,
        homeTeam: l.homeTeam,
        awayTeam: l.awayTeam,
        prediction: l.prediction,
        odds: Number(l.odds) || 1.0,
      }));

    formData.append("legsJson", JSON.stringify(validLegs));

    try {
      const res = await fetch(`${API_BASE}/api/admin/archive`, {
        method: "POST",
        headers: { Authorization: `Bearer ${getToken()}` },
        body: formData,
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFile(null);
        setPreviewUrl(null);
        setLegs([emptyLeg()]);
        setDescription("");
        fetchTickets();
      } else {
        const data = await res.json().catch(() => null);
        alert(data?.message ?? "Upload failed!");
      }
    } catch (err) {
      alert("Network error occurred.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8 text-center"><Loader2 className="animate-spin mx-auto text-emerald-500" /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Tickets Archive</h1>
          <p className="text-neutral-400">Manage history and winning slips</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-emerald-500 text-neutral-950 px-5 py-2.5 rounded-xl font-bold hover:bg-emerald-400 transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)]"
        >
          <Plus size={20} /> Upload New Ticket
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {tickets.map((ticket) => (
          <div key={ticket.id} className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition-colors flex flex-col">
            <div className="h-48 relative bg-neutral-950 p-2">
              {/* eslint-disable-next-line */}
              <img src={`${API_BASE}${ticket.imageUrl}`} className="w-full h-full object-contain rounded-lg" alt="Ticket" />
              {ticket.isVip && <span className="absolute top-4 right-4 bg-amber-500 text-black text-xs font-black px-2 py-1 rounded shadow-lg">VIP</span>}
            </div>
            <div className="p-4 flex flex-col flex-grow">
              <h3 className="font-bold text-white text-lg">{ticket.description}</h3>
              <p className="text-emerald-400 font-black mb-4">Total Odds: @{ticket.totalOdds}</p>
              <button
                onClick={() => deleteTicket(ticket.id)}
                className="mt-auto w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all text-sm font-bold"
              >
                <Trash2 size={16} /> Delete Ticket
              </button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-5 border-b border-neutral-800 bg-neutral-950">
              <h2 className="font-black text-white text-xl">Upload Winning Ticket</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-500 hover:text-white"><X size={24} /></button>
            </div>

            <form onSubmit={handleUpload} className="p-6 overflow-y-auto space-y-6">
              {/* Image Upload Area */}
              <div className="flex flex-col items-center justify-center w-full h-48 border-2 border-neutral-800 border-dashed rounded-2xl hover:border-emerald-500/50 transition-colors relative overflow-hidden bg-neutral-950/50">
                <input type="file" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" accept="image/*" onChange={handleFileChange} />
                {previewUrl ? (
                   // eslint-disable-next-line
                  <img src={previewUrl} className="h-full w-full object-contain p-2" alt="Preview" />
                ) : (
                  <div className="text-center text-neutral-500">
                    <ImageIcon size={40} className="mx-auto mb-2 opacity-50" />
                    <p className="font-bold text-sm">Click or Drag image here</p>
                  </div>
                )}
              </div>

              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">TITLE</label>
                  <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="e.g. VIP Combo" className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:border-emerald-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-neutral-400 mb-1">DATE</label>
                  <input type="date" value={matchDate} onChange={(e) => setMatchDate(e.target.value)} className="w-full bg-neutral-950 border border-neutral-800 rounded-lg p-2.5 text-white focus:border-emerald-500 outline-none [color-scheme:dark]" />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer p-3 border border-neutral-800 rounded-lg bg-neutral-950/50 w-max">
                <input type="checkbox" checked={isVip} onChange={(e) => setIsVip(e.target.checked)} className="w-4 h-4 accent-emerald-500" />
                <span className="text-white font-bold text-sm">Mark as VIP Ticket</span>
              </label>

              {/* Matches (Legs) */}
              <div className="border-t border-neutral-800 pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-bold text-white flex items-center gap-2"><ListPlus size={18} className="text-emerald-500"/> Match Breakdown</h3>
                  <div className="bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-lg font-black text-sm border border-emerald-500/20 flex items-center gap-2">
                    <Calculator size={14}/> Total Odds: @{totalOdds.toFixed(2)}
                  </div>
                </div>

                <div className="space-y-3">
                  {legs.map((leg, i) => (
                    <div key={i} className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl relative group">
                      {legs.length > 1 && (
                        <button type="button" onClick={() => setLegs(legs.filter((_, idx) => idx !== i))} className="absolute -top-2 -right-2 bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"><X size={12}/></button>
                      )}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        <input placeholder="Home Team" value={leg.homeTeam} onChange={(e) => { const newLegs = [...legs]; newLegs[i].homeTeam = e.target.value; setLegs(newLegs); }} className="bg-neutral-900 border border-neutral-800 p-2 rounded text-sm text-white" />
                        <input placeholder="Away Team" value={leg.awayTeam} onChange={(e) => { const newLegs = [...legs]; newLegs[i].awayTeam = e.target.value; setLegs(newLegs); }} className="bg-neutral-900 border border-neutral-800 p-2 rounded text-sm text-white" />
                        <input placeholder="Tip (e.g. 1)" value={leg.prediction} onChange={(e) => { const newLegs = [...legs]; newLegs[i].prediction = e.target.value; setLegs(newLegs); }} className="bg-neutral-900 border border-neutral-800 p-2 rounded text-sm text-white" />
                        <input type="number" step="0.01" placeholder="Odds (e.g. 1.85)" value={leg.odds} onChange={(e) => { const newLegs = [...legs]; newLegs[i].odds = e.target.value; setLegs(newLegs); }} className="bg-neutral-900 border border-neutral-800 p-2 rounded text-sm text-white" />
                      </div>
                    </div>
                  ))}
                </div>

                <button type="button" onClick={() => setLegs([...legs, emptyLeg()])} className="mt-3 text-emerald-500 hover:text-emerald-400 text-sm font-bold flex items-center gap-1"><Plus size={16}/> Add Match</button>
              </div>

              <div className="pt-4 border-t border-neutral-800">
                <button type="submit" disabled={submitting} className="w-full bg-emerald-500 text-neutral-950 font-black py-3 rounded-xl hover:bg-emerald-400 disabled:opacity-50 transition-all flex justify-center items-center">
                  {submitting ? <Loader2 className="animate-spin" /> : "Save to Archive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}