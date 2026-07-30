interface ApiTip {
  id: number;
  homeTeam: string;
  awayTeam: string;
  league?: string;
  matchDate?: string;
}

export default function TipsStructuredData({ tips }: { tips: ApiTip[] }) {
  if (tips.length === 0) return null;

  const data = tips.map((tip) => ({
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    name: `${tip.homeTeam} vs ${tip.awayTeam}`,
    startDate: tip.matchDate,
    sport: "Football",
    competitor: [
      { "@type": "SportsTeam", name: tip.homeTeam },
      { "@type": "SportsTeam", name: tip.awayTeam },
    ],
    ...(tip.league && tip.league !== "Unknown"
      ? { superEvent: { "@type": "SportsEvent", name: tip.league } }
      : {}),
  }));

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}