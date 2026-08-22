import type { Metadata } from "next";
import HistoryClient from "./HistoryClient";
import { API_BASE } from "@/lib/api";

export const metadata: Metadata = {
  title: "Verified Betting History & Track Record",
  description: "100% transparent history of every prediction — wins and losses, publicly verified. See our full track record before subscribing.",
  alternates: {
    canonical: "https://protipsbet.com/history",
  },
  openGraph: {
    title: "Verified Betting History | ProTipsBet",
    description: "100% transparent history of every prediction — wins and losses, publicly verified.",
    url: "https://protipsbet.com/history",
  },
};

async function getTickets() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/archive`, {
      next: { revalidate: 60 },//osvezhi na sekoi 60 sekundi
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export default async function HistoryPage() {
  const tickets = await getTickets();
  return <HistoryClient initialTickets={tickets} />;
}