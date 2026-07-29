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

async function getMatches() {
  try {
    const res = await fetch(`${API_BASE}/api/tips`, { next: { revalidate: 300 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function getArchive() {
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
  const [allTips, vipArchive] = await Promise.all([getMatches(), getArchive()]);
  const vipMatches = allTips.filter((t: any) => t.isVip && String(t.result).toLowerCase() === "pending");

  return <VipTipsClient initialVipMatches={vipMatches} initialVipArchive={vipArchive} />;
}