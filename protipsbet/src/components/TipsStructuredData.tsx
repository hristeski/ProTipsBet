interface ApiTip {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league?: string;
  matchDate?: string;
  predictionType?: string;
  odds?: number;
  result?: string;
  isVip?: boolean;
}

function estimateEndDate(startDate?: string): string | undefined {
  if (!startDate) return undefined;
  const start = new Date(startDate);
  if (Number.isNaN(start.getTime())) return undefined;
  return new Date(start.getTime() + 2 * 60 * 60 * 1000).toISOString();
}

export default function TipsStructuredData({ tips }: { tips: ApiTip[] }) {
  const validTips = tips.filter((t) => t.matchDate);
  if (validTips.length === 0) return null;

  const data = validTips.map((tip) => {
    const slugSafeLeague = tip.league && tip.league !== "Unknown" && tip.league !== "VIP Only" ? tip.league : "Football";

    return {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name: `${tip.homeTeam} vs ${tip.awayTeam}`,
      startDate: tip.matchDate,
      endDate: estimateEndDate(tip.matchDate),
      eventStatus: "https://schema.org/EventScheduled",
      sport: "Football",
      description: `${tip.homeTeam} vs ${tip.awayTeam} - ${slugSafeLeague} match prediction and betting tip from ProTipsBet.${
        tip.predictionType ? ` Our pick: ${tip.predictionType}.` : ""
      }`,
      image: ["https://protipsbet.com/opengraph-image"],
      location: {
        "@type": "Place",
        name: slugSafeLeague,
      },
      competitor: [
        { "@type": "SportsTeam", name: tip.homeTeam },
        { "@type": "SportsTeam", name: tip.awayTeam },
      ],
      performer: [
        { "@type": "SportsTeam", name: tip.homeTeam },
        { "@type": "SportsTeam", name: tip.awayTeam },
      ],
      organizer: {
        "@type": "Organization",
        name: "ProTipsBet",
        url: "https://protipsbet.com",
      },
      offers: {
        "@type": "Offer",
        url: tip.isVip ? "https://protipsbet.com/vip-tips" : "https://protipsbet.com/free-tips",
        price: "0",
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        validFrom: tip.matchDate,
      },
    };
  });

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}