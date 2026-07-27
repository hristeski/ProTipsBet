import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import MobileNav from "@/components/BottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import NotificationToast from "@/components/NotificationToast";
import StructuredData from "@/components/StructuredData";
import Footer from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

const SITE_URL = "https://protipsbet.com"; // change to your real domain

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ProTipsBet | Verified VIP Sports Predictions",
    template: "%s | ProTipsBet",
  },
  description:
    "Daily football predictions backed by data, a verified track record, and VIP analytics with premium odds.",
  keywords: [
    "sports predictions",
    "football tips",
    "VIP betting tips",
    "verified betting slips",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "ProTipsBet",
    title: "ProTipsBet | Verified VIP Sports Predictions",
    description: "Daily football predictions backed by data and a verified track record.",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "ProTipsBet | Verified VIP Sports Predictions",
    description: "Daily football predictions backed by data and a verified track record.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: SITE_URL },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-950 text-zinc-50 antialiased selection:bg-emerald-500/30 selection:text-emerald-200`}>
        <StructuredData />

        {/* Desktop nav (hidden on mobile) */}
        <Navbar />

        {/* Rotating notifications for discounts / new VIP tickets */}
        <NotificationToast />

        {/* Main content */}
        <main className="max-w-7xl mx-auto min-h-screen pt-0 md:pt-20 pb-28 md:pb-10">
          {children}
        </main>

        <Footer />

        <ScrollToTop />

        {/* Mobile nav (hidden on desktop) */}
        <MobileNav />
      </body>
    </html>
  );
}