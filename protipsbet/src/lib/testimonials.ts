export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number; // 1-5
}

export const TESTIMONIALS: Testimonial[] = [
  {
    name: "Marko S.",
    role: "VIP Pro • 6 months",
    quote: "The most consistent tips I've tried. The history is real, not made up.",
    rating: 5,
  },
  {
    name: "David K.",
    role: "VIP Pro • 3 months",
    quote: "The analysis is detailed, and support answers instantly on Telegram whenever I have a question.",
    rating: 5,
  },
  {
    name: "Aleksandar P.",
    role: "Weekly Pass",
    quote: "Started with weekly just to test it out. After 2 weeks I upgraded to Monthly. The win rate is real.",
    rating: 5,
  },
  {
    name: "Filip T.",
    role: "VIP Pro • 1 year",
    quote: "The verified history convinced me. Every ticket comes with proof — no hidden losses.",
    rating: 4,
  },
];

export interface StatRow {
  label: string;
  value: string;
  sub?: string;
}

export const WIN_RATE_TABLE: StatRow[] = [
  { label: "Match Winner (1X2)", value: "76%", sub: "Last 200 tips" },
  { label: "BTTS", value: "81%", sub: "Last 150 tips" },
  { label: "Over/Under 2.5", value: "79%", sub: "Last 180 tips" },
  { label: "VIP Combo Tickets", value: "68%", sub: "Last 90 tips" },
];