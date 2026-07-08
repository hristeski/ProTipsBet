// FILE DESTINATION: src/lib/tips-data.ts

export type Market = "1X2" | "BTTS" | "OU25";

export const MARKET_LABELS: Record<Market, string> = {
  "1X2": "Match Winner",
  BTTS: "BTTS",
  OU25: "Over/Under 2.5",
};

export interface FreeTip {
  id: string;
  date: string;
  league: string;
  matchTime: string;
  homeTeam: string;
  awayTeam: string;
  prediction: string;
  market: Market;
  odds: number;
  status: "pending" | "win" | "loss";
}

// Today's free tips - each tagged with a market for filtering
export const TODAY_FREE_TIPS: FreeTip[] = [
  {
    id: "FT-101",
    date: "Today",
    league: "World Cup 2026",
    matchTime: "18:00",
    homeTeam: "Argentina",
    awayTeam: "France",
    prediction: "Over 2.5 Goals",
    market: "OU25",
    odds: 1.95,
    status: "pending",
  },
  {
    id: "FT-102",
    date: "Today",
    league: "Euro Qualifiers",
    matchTime: "21:00",
    homeTeam: "Portugal",
    awayTeam: "Croatia",
    prediction: "BTTS - Yes",
    market: "BTTS",
    odds: 1.80,
    status: "pending",
  },
  {
    id: "FT-103",
    date: "Today",
    league: "Serie A",
    matchTime: "20:45",
    homeTeam: "Inter",
    awayTeam: "Roma",
    prediction: "1 (Home Win)",
    market: "1X2",
    odds: 1.72,
    status: "pending",
  },
];

// Archive of past free tips (already played)
export const FREE_TIPS_ARCHIVE: FreeTip[] = [
  { id: "FT-097", date: "July 7, 2026", league: "La Liga", matchTime: "20:00", homeTeam: "Sevilla", awayTeam: "Betis", prediction: "Over 2.5 Goals", market: "OU25", odds: 1.85, status: "win" },
  { id: "FT-096", date: "July 6, 2026", league: "Bundesliga", matchTime: "18:30", homeTeam: "Dortmund", awayTeam: "Leipzig", prediction: "BTTS - Yes", market: "BTTS", odds: 1.75, status: "win" },
  { id: "FT-095", date: "July 5, 2026", league: "Premier League", matchTime: "17:00", homeTeam: "Arsenal", awayTeam: "Everton", prediction: "1 (Home Win)", market: "1X2", odds: 1.60, status: "win" },
  { id: "FT-094", date: "July 4, 2026", league: "Ligue 1", matchTime: "21:00", homeTeam: "Lyon", awayTeam: "Nice", prediction: "Under 2.5 Goals", market: "OU25", odds: 1.90, status: "loss" },
  { id: "FT-093", date: "July 2, 2026", league: "Eredivisie", matchTime: "19:45", homeTeam: "Ajax", awayTeam: "PSV", prediction: "BTTS - Yes", market: "BTTS", odds: 1.70, status: "win" },
];

export interface VipTip {
  id: string;
  date: string;
  type: string;
  matchesLabel: string;
  totalOdds: number;
  status: "win" | "loss";
}

// Archive of past VIP tickets - results are shown openly (for trust),
// but the exact pick stays hidden unless the user was subscribed at the time.
export const VIP_ARCHIVE: VipTip[] = [
  { id: "TKT-890", date: "July 7, 2026", type: "VIP Mega Accumulator", matchesLabel: "4 matches", totalOdds: 12.50, status: "win" },
  { id: "TKT-889", date: "July 6, 2026", type: "VIP Premium Single", matchesLabel: "1 match", totalOdds: 2.85, status: "win" },
  { id: "TKT-887", date: "July 4, 2026", type: "VIP Combo", matchesLabel: "2 matches", totalOdds: 3.40, status: "loss" },
  { id: "TKT-886", date: "July 2, 2026", type: "VIP Premium Single", matchesLabel: "1 match", totalOdds: 2.40, status: "win" },
  { id: "TKT-885", date: "June 29, 2026", type: "VIP Combo", matchesLabel: "2 matches", totalOdds: 4.15, status: "win" },
];