import type { Metadata } from "next";
import VipTipsClient from "./VipTipsClient";
import { API_BASE } from "@/lib/api";

export const metadata: Metadata = {
  title: "VIP Football Predictions Today",
  description: "Premium VIP football predictions with verified win rate. Daily high-confidence picks, correct scores & accumulators.",
  alternates: {
    canonical: "https://protipsbet.com/vip-tips",
  },
  openGraph: {
    title: "VIP Football Predictions Today | ProTipsBet",
    description: "Premium VIP football predictions with verified win rate.",
    url: "https://protipsbet.com/vip-tips",
  },
};

async function getAllTips() {
  try {
    const res = await fetch(`${API_BASE}/api/tips`, { next: { revalidate: 60 } }); //osvezhi na sekoi 60 sekundi
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function getTicketsArchive() {
  try {
    const res = await fetch(`${API_BASE}/api/tips/tickets`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data.filter((t: any) => t.isVip) : [];
  } catch {
    return [];
  }
}

export default async function VipTipsPage() {
  const [allTips, ticketsArchive] = await Promise.all([getAllTips(), getTicketsArchive()]);

  const vips = allTips.filter((t: any) => t.isVip);
  const vipMatches = vips.filter((t: any) => String(t.result).toLowerCase() === "pending");
  // Исто како архивата на Free Tips - сите VIP типови што веќе имаат резултат
  const vipTipsArchive = vips.filter((t: any) => String(t.result).toLowerCase() !== "pending");

  return (
    <VipTipsClient
      initialVipMatches={vipMatches}
      initialVipTipsArchive={vipTipsArchive}
      initialVipTicketsArchive={ticketsArchive}
    />
  );
}