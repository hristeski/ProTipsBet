export interface GlossaryTerm {
  slug: string;
  term: string;
  shortDefinition: string;
  longExplanation: string;
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
  {
    slug: "1x2",
    term: "1X2",
    shortDefinition: "A bet on the match outcome: Home win (1), Draw (X), or Away win (2).",
    longExplanation:
      "1X2 is the most common football betting market. You're picking one of three possible results at full time: the home team wins (1), the match ends level (X), or the away team wins (2). It only covers the 90 minutes plus stoppage time — extra time and penalties (if the match has them) don't count. Because there are only three outcomes, 1X2 odds tend to be lower than more specific markets, but it's the easiest market to understand and the one most sites, including ours, lead with.",
  },
  {
    slug: "btts",
    term: "BTTS (Both Teams to Score)",
    shortDefinition: "A bet on whether both teams will score at least one goal each during the match.",
    longExplanation:
      "BTTS is a yes/no market — you're not betting on who wins, just on whether both sides find the net at least once before full time. A 2-1 or 1-1 result means BTTS 'Yes' wins; a 3-0 or 0-0 result means BTTS 'No' wins. It's popular because it's independent of the final result: a team can lose 3-1 and BTTS still lands as 'Yes'. Teams with attacking styles but shaky defenses tend to produce more BTTS 'Yes' results, which is part of why we track it as a separate market on our Free Tips page.",
  },
  {
    slug: "over-under-2-5",
    term: "Over/Under 2.5 Goals",
    shortDefinition: "A bet on whether the total goals scored in a match will be more or fewer than 2.5.",
    longExplanation:
      "This market ignores who wins and focuses purely on the total goal count. 'Over 2.5' wins if the match finishes with 3 or more total goals combined (both teams added together); 'Under 2.5' wins if it finishes with 2 or fewer. The .5 exists specifically so there's never a tie — you can't score exactly 2.5 goals. You'll also see 1.5, 3.5, and other lines, but 2.5 is the standard reference point most bettors and sites use.",
  },
  {
    slug: "double-chance",
    term: "Double Chance",
    shortDefinition: "A safer version of 1X2 that covers two of the three possible outcomes in a single bet.",
    longExplanation:
      "Double Chance lets you cover two outcomes at once: Home-or-Draw (1X), Draw-or-Away (X2), or Home-or-Away (12, meaning 'no draw'). It only loses if the one outcome you didn't cover happens. Because you're covering more ground, the odds are lower than a straight 1X2 bet — it trades potential payout for a higher chance of winning. It's a common way to reduce risk on matches where you're fairly confident but not certain about the exact result.",
  },
  {
    slug: "correct-score",
    term: "Correct Score",
    shortDefinition: "A bet on the exact final scoreline of the match, e.g. 2-1 or 0-0.",
    longExplanation:
      "Correct Score is one of the highest-risk, highest-reward markets because you need to predict the precise final result — not just the winner, but the exact number of goals for each side. Even getting the winning team right isn't enough if the scoreline is off (predicting 2-0 when the actual result is 3-1 still loses). Because there are dozens of realistic scorelines for any given match, correct score odds are significantly higher than 1X2 or BTTS. We only publish correct score picks when we have strong conviction in both the result and the likely margin.",
  },
  {
    slug: "accumulator",
    term: "Accumulator (Combo Bet)",
    shortDefinition: "A single bet combining multiple selections, where all of them must win for the bet to pay out.",
    longExplanation:
      "An accumulator (also called a combo, parlay, or multi) bundles two or more individual predictions into one bet. The odds for each selection multiply together, so the potential payout grows fast — but so does the risk, since a single incorrect leg loses the entire bet, even if every other selection was correct. A 3-leg accumulator at odds of 1.80, 1.90, and 2.00 pays out at roughly 6.84 combined, for example. Our VIP tickets often include accumulators, and every one — win or loss — is archived publicly on our History page.",
  },
  {
    slug: "odds",
    term: "Odds (Decimal Format)",
    shortDefinition: "A number showing how much a winning bet pays out relative to your stake.",
    longExplanation:
      "We use decimal odds, the standard format across most of Europe, Africa, and Australia. To find your total payout (including your original stake), multiply your stake by the odds: a €10 bet at odds of 2.50 returns €25 total (€15 profit plus your €10 stake back). Odds under 2.00 mean the outcome is considered more likely (lower payout); odds above 2.00 mean it's considered less likely (higher payout). Every pick we publish shows its odds at the time it was posted.",
  },
  {
    slug: "value-bet",
    term: "Value Bet",
    shortDefinition: "A bet where the odds offered are higher than the true probability of the outcome would suggest.",
    longExplanation:
      "A value bet isn't necessarily about picking the 'safest' outcome — it's about finding cases where a bookmaker's odds underestimate how likely something actually is to happen. If you believe a team has roughly a 50% chance of winning, but the bookmaker's odds imply only a 40% chance (odds around 2.50), that's value: over the long run, taking that bet repeatedly should be profitable, even though any single bet can still lose. This is the core idea behind most professional betting analysis, including ours — we're not just picking favorites, we're looking for mismatches between the odds and the real likelihood.",
  },
];

export function findGlossaryTermBySlug(slug: string): GlossaryTerm | undefined {
  return GLOSSARY_TERMS.find((t) => t.slug === slug);
}