import type { Metadata } from "next";
import VipTipsClient from "./VipTipsClient";

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

export default function VipTipsPage() {
  return <VipTipsClient />;
}