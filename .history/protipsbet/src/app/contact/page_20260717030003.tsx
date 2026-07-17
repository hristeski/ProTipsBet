import type { Metadata } from "next";
import ContactClient from "./ContactClient";

export const metadata: Metadata = {
  title: "Contact Support",
  description: "Get in touch with ProTipsBet support via Telegram, WhatsApp, or email. VIP subscription help and general inquiries answered 24/7.",
  alternates: {
    canonical: "https://protipsbet.com/contact",
  },
  openGraph: {
    title: "Contact ProTipsBet Support",
    description: "Get in touch via Telegram, WhatsApp, or email. Answered 24/7.",
    url: "https://protipsbet.com/contact",
  },
};

export default function ContactPage() {
  return <ContactClient />;
}