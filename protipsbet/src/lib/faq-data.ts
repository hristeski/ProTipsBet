export interface FaqItem {
  q: string;
  a: string;
}

export interface FaqCategory {
  category: string;
  iconKey: "help" | "card" | "shield";
  items: FaqItem[];
}

export const FAQ_CATEGORIES: FaqCategory[] = [
  {
    category: "Predictions",
    iconKey: "help",
    items: [
      {
        q: "How are your predictions made?",
        a: "Every tip goes through statistical analysis — team form, head-to-head history, injuries, and market odds movement — before it's published. We never publish a tip based on gut feeling alone.",
      },
      {
        q: "What's the difference between Free and VIP tips?",
        a: "Free tips are a sample of our work, published daily so you can verify our accuracy yourself. VIP tips include higher-confidence picks, exact staking plans, and access to premium combos with better value odds.",
      },
      {
        q: "How do I know your win rate is real?",
        a: "Every published tip — win or loss — stays visible in our public archive. Nothing is hidden or deleted after the fact, so you can verify our track record yourself.",
      },
      {
        q: "Can predictions ever be 100% guaranteed?",
        a: "No — sports outcomes always carry risk, and any source claiming a guaranteed win should be treated with caution. What we do guarantee is transparent, data-driven analysis and a fully public track record.",
      },
      {
        q: "Which leagues and sports do you cover?",
        a: "We focus primarily on football (soccer) across major and regional leagues worldwide, publishing daily picks across markets like Match Winner, BTTS, and Over/Under.",
      },
    ],
  },
  {
    category: "Payments",
    iconKey: "card",
    items: [
      {
        q: "How do I pay for VIP access?",
        a: "We accept manual payment confirmation via bank transfer and crypto (Binance Pay). After payment, your VIP access is activated once we confirm the transaction — usually within a few hours.",
      },
      {
        q: "Can I cancel my VIP subscription anytime?",
        a: "VIP access runs for the duration you purchased (e.g. weekly or monthly) and does not auto-renew unless stated otherwise. You're never locked into a recurring charge.",
      },
    ],
  },
  {
    category: "Policy",
    iconKey: "shield",
    items: [
      {
        q: "Is there a refund policy?",
        a: "Due to the nature of digital predictions, all VIP purchases are final once access is granted. We recommend reviewing our free tips and win-rate history before upgrading.",
      },
      {
        q: "Is ProTipsBet a betting site?",
        a: "No. ProTipsBet provides sports analytics and predictions for informational purposes only. We do not accept bets or hold betting balances — you place any bets through your own licensed bookmaker.",
      },
    ],
  },
];