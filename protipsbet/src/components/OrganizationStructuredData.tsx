export default function OrganizationStructuredData() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ProTipsBet",
    url: "https://protipsbet.com",
    logo: "https://protipsbet.com/logo.png",
    sameAs: ["https://t.me/protipsbet11"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      url: "https://api.whatsapp.com/send/?phone=38978231801&text&type=phone_number&app_absent=0",
      availableLanguage: ["English"],
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}