import type { Metadata } from "next";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { GLOSSARY_TERMS } from "@/lib/glossary-data";

export const metadata: Metadata = {
  title: "Betting Glossary — Football Betting Terms Explained",
  description: "Clear explanations of common football betting terms — 1X2, BTTS, Over/Under, Correct Score, and more.",
  alternates: { canonical: "https://protipsbet.com/glossary" },
};

export default function GlossaryIndexPage() {
  return (
    <div className="pb-24 px-4 pt-24 md:pt-32 max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 mb-3">
          <BookOpen className="text-emerald-500" size={28} />
          <h1 className="text-2xl md:text-4xl font-black text-white">Betting Glossary</h1>
        </div>
        <p className="text-zinc-400 text-sm max-w-md mx-auto">
          Clear explanations of the betting terms you'll see across our predictions.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {GLOSSARY_TERMS.map((t) => (
          <Link
            key={t.slug}
            href={`/glossary/${t.slug}`}
            className="flex items-center justify-between gap-4 bg-zinc-900/40 border border-zinc-800 rounded-xl px-5 py-4 hover:bg-zinc-900/70 hover:border-emerald-500/30 transition-colors"
          >
            <div className="min-w-0">
              <p className="text-white font-bold text-sm mb-0.5">{t.term}</p>
              <p className="text-zinc-500 text-xs truncate">{t.shortDefinition}</p>
            </div>
            <ChevronRight size={18} className="text-zinc-600 shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  );
}