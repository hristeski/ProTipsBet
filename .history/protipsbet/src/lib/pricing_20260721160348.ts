// FILE DESTINATION: src/lib/pricing.ts

export interface PricingPlan {
  id: "daily" | "weekly" | "monthly";
  name: string;
  price: number; // EUR
  period: string;
  perDay: number; // EUR, computed for the "value" messaging
  badge?: string;
  highlighted?: boolean;
  benefits: string[];
}

// Note: minimum crypto payment on most processors is ~$15. Every plan
// below sits comfortably above that floor (even Daily), so crypto stays
// a valid option for all three tiers - no plan needs to be blocked from
// the instant-payment flow.
export const PRICING_PLANS: PricingPlan[] = [
  {
    id: "daily",
    name: "Daily Pass",
    price: 19,
    period: "/day",
    perDay: 19,
    badge: "Quick Test",
    benefits: [
      "Full VIP access for 24 hours",
      "All VIP picks unlocked today",
      "Great for a single big matchday",
    ],
  },
  {
    id: "weekly",
    name: "Weekly Pass",
    price: 25,
    period: "/week",
    perDay: 3.57,
    badge: "Popular",
    benefits: [
      "7 days of full VIP access",
      "Daily VIP predictions (2-3 matches)",
            "Average odds: 2.50 - 5.00",
      "Detailed match analytics",
    ],
  },
  {
    id: "monthly",
    name: "Monthly Pro",
    price: 60,
    period: "/month",
    perDay: 2.0,
    badge: "Best Value",
    highlighted: true,
    benefits: [
      "Daily VIP predictions (2-3 matches)",
      "Average odds: 5.00 - 10.00",
      "Detailed match analytics",
      "Bankroll management guide",
      "24/7 priority support",
    ],
  },
];

export const CRYPTO_MIN_NOTE = "Minimum crypto payment: $15 — all plans qualify for instant crypto checkout.";