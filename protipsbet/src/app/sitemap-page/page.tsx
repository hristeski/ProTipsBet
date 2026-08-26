import type { Metadata } from "next";
import Link from "next/link";
import { getAllTips, isPubliclyRenderable } from "@/lib/predictions";
import { getDistinctLeagues, slugifyLeague } from "@/lib/league-slug";
import { GLOSSARY_TERMS } from "@/lib/glossary-data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Sitemap",
  description: "Full list of every page on ProTipsBet — leagues, glossary terms, and site sections.",
  alternates: { canonical: "https://protipsbet.com/sitemap-page" },
  robots: { index: true, follow: true },
};

export default async function HtmlSitemapPage() {
  const tips = await getAllTips();
  const leagues = getDistinctLeagues(tips.filter(isPubliclyRenderable));

  const mainPages = [
    { href: "/", label: "Home" },
    { href: "/free-tips", label: "Free Tips" },
    { href: "/vip-tips", label: "VIP Tips" },
    { href: "/history", label: "Verified History" },
    { href: "/leagues", label: "Predictions by League" },
    { href: "/glossary", label: "Betting Glossary" },
    { href: "/results", label: "Weekly Results Archive" },
    { href: "/contact", label: "Contact" },
    { href: "/partners", label: "Partners" },
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ];

  return (
    <div className="pb-24 px-4 pt-24 md:pt-32 max-w-3xl mx-auto">
      <h1 className="text-2xl md:text-4xl font-black text-white mb-10">Sitemap</h1>

      <div className="mb-10">
        <h2 className="text-lg font-black text-white mb-4">Main Pages</h2>
        <ul className="grid grid-cols-2 gap-2">
          {mainPages.map((p) => (
            <li key={p.href}>
              <Link href={p.href} className="text-emerald-400 text-sm hover:underline">
                {p.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {leagues.length > 0 && (
        <div className="mb-10">
          <h2 className="text-lg font-black text-white mb-4">Leagues</h2>
          <ul className="grid grid-cols-2 gap-2">
            {leagues.map((league) => (
              <li key={league}>
                <Link href={`/leagues/${slugifyLeague(league)}`} className="text-emerald-400 text-sm hover:underline">
                  {league}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <h2 className="text-lg font-black text-white mb-4">Glossary Terms</h2>
        <ul className="grid grid-cols-2 gap-2">
          {GLOSSARY_TERMS.map((t) => (
            <li key={t.slug}>
              <Link href={`/glossary/${t.slug}`} className="text-emerald-400 text-sm hover:underline">
                {t.term}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}