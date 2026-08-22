import { TESTIMONIALS } from "@/lib/testimonials";

export default function ReviewStructuredData() {
  if (!TESTIMONIALS || TESTIMONIALS.length === 0) return null;

  const ratings = TESTIMONIALS.map((t) => t.rating);
  const average = ratings.reduce((sum, r) => sum + r, 0) / ratings.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "ProTipsBet VIP Sports Predictions Subscription",
    description: "Daily football predictions and VIP analytics with a verified, publicly-tracked win rate.",
    brand: { "@type": "Brand", name: "ProTipsBet" },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: average.toFixed(1),
      reviewCount: TESTIMONIALS.length,
      bestRating: "5",
      worstRating: "1",
    },
    review: TESTIMONIALS.map((t) => ({
      "@type": "Review",
      author: { "@type": "Person", name: t.name },
      reviewRating: {
        "@type": "Rating",
        ratingValue: t.rating,
        bestRating: "5",
        worstRating: "1",
      },
      reviewBody: t.quote,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}