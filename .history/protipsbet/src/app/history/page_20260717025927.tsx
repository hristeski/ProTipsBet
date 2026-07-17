import type { Metadata } from "next";
import HistoryClient from "./HistoryClient";

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

export default function HistoryPage() {
  return <HistoryClient />;
}