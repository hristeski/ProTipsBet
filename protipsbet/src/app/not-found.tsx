import Link from "next/link";
import { SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 pt-24 md:pt-32 text-center">
      <SearchX size={48} className="text-zinc-700 mb-6" />
      <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Page Not Found</h1>
      <p className="text-zinc-400 text-sm max-w-sm mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/"
          className="px-6 py-3 bg-emerald-500 text-zinc-950 font-bold text-sm rounded-xl hover:bg-emerald-400 transition-colors"
        >
          Back to Home
        </Link>
        <Link
          href="/free-tips"
          className="px-6 py-3 bg-zinc-900 border border-zinc-800 text-white font-bold text-sm rounded-xl hover:bg-zinc-800 transition-colors"
        >
          See Today's Picks
        </Link>
      </div>
    </div>
  );
}