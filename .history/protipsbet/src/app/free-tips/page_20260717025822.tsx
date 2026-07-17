import type { Metadata } from "next";
import FreeTipsClient from "./FreeTipsClient";

export const metadata: Metadata = {
  title: "Free Football Predictions Today",
  description: "Daily free football tips, verified and public. Filter by market — 1X2, BTTS, Over/Under 2.5. No signup required.",
  alternates: {
    canonical: "https://protipsbet.com/free-tips",
  },
  openGraph: {
    title: "Free Football Predictions Today | ProTipsBet",
    description: "Daily free football tips, verified and public.",
    url: "https://protipsbet.com/free-tips",
  },
};

export default function FreeTipsPage() {
  return <FreeTipsClient />;
}