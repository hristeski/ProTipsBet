import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookOpen } from "lucide-react";
import { GLOSSARY_TERMS, findGlossaryTermBySlug } from "@/lib/glossary-data";
import BreadcrumbStructuredData from "@/components/BreadcrumbStructuredData";

export function generateStaticParams() {
  return GLOSSARY_TERMS.map((t) => ({ slug: t.slug }));
}

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const term = findGlossaryTermBySlug(slug);
  if (!term) return { title: "Term Not Found | ProTipsBet" };

  return {
    title: `What is ${term.term}? | Betting Glossary`,
    description: term.shortDefinition,
    alternates: { canonical: `https://protipsbet.com/glossary/${slug}` },
  };
}

export default async function GlossaryTermPage({ params }: Props) {
  const { slug } = await params;
  const term = findGlossaryTermBySlug(slug);
  if (!term) notFound();

  const otherTerms = GLOSSARY_TERMS.filter((t) => t.slug !== slug).slice(0, 4);

  return (
    <div className="pb-24 px-4 pt-24 md:pt-32 max-w-2xl mx-auto">
      <BreadcrumbStructuredData
        items={[
          { name: "Home", url: "https://protipsbet.com/" },
          { name: "Glossary", url: "https://protipsbet.com/glossary" },
          { name: term.term, url: `https://protipsbet.com/glossary/${slug}` },
        ]}
      />

      <nav className="text-xs text-zinc-500 mb-6">
        <Link href="/" className="hover:text-emerald-400">Home</Link>
        {" / "}
        <Link href="/glossary" className="hover:text-emerald-400">Glossary</Link>
        {" / "}
        <span className="text-zinc-300">{term.term}</span>
      </nav>

      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="text-emerald-500" size={22} />
        <h1 className="text-2xl md:text-3xl font-black text-white">{term.term}</h1>
      </div>

      <p className="text-zinc-300 text-base leading-relaxed mb-10">{term.longExplanation}</p>

      <div className="flex flex-col sm:flex-row gap-3 mb-12">
        <Link
          href="/free-tips"
          className="flex-1 text-center bg-emerald-500 text-zinc-950 font-bold text-sm px-6 py-3 rounded-xl hover:bg-emerald-400 transition-colors"
        >
          See Today's Free Picks
        </Link>
        <Link
          href="/glossary"
          className="flex-1 text-center bg-zinc-900 border border-zinc-800 text-white font-bold text-sm px-6 py-3 rounded-xl hover:bg-zinc-800 transition-colors"
        >
          Back to Glossary
        </Link>
      </div>

      {otherTerms.length > 0 && (
        <div>
          <h2 className="text-sm font-black text-zinc-500 uppercase mb-4">Related Terms</h2>
          <div className="flex flex-col gap-2">
            {otherTerms.map((t) => (
              <Link
                key={t.slug}
                href={`/glossary/${t.slug}`}
                className="text-emerald-400 text-sm font-bold hover:underline"
              >
                {t.term} →
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}