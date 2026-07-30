import type { Metadata } from "next";
import PartnersPage from "./PartnersPage";

export const metadata: Metadata = {
  title: "Become a Partner",
  description: "Partner with ProTipsBet — add our banner to your site and earn through our affiliate program. Free, simple embed setup.",
  alternates: {
    canonical: "https://protipsbet.com/partners",
  },
  openGraph: {
    title: "Become a Partner | ProTipsBet",
    description: "Partner with ProTipsBet — add our banner to your site.",
    url: "https://protipsbet.com/partners",
  },
};

export default function Page() {
  return <PartnersPage />;
}