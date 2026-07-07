export default function StructuredData() {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://protipsbet.com/#organization",
        name: "ProTipsBet",
        url: "https://protipsbet.com",
        logo: "https://protipsbet.com/logo.png",
        sameAs: ["https://t.me/protipsbet"],
      },
      {
        "@type": "WebSite",
        "@id": "https://protipsbet.com/#website",
        url: "https://protipsbet.com",
        name: "ProTipsBet",
        publisher: { "@id": "https://protipsbet.com/#organization" },
        inLanguage: "en",
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}