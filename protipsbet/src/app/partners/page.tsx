"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Check, Handshake } from "lucide-react";

const BANNER_URL = "https://protipsbet.com/banners/protipsbet.webp";
const TARGET_URL = "https://protipsbet.com";

const EMBED_CODE = `<a href="${TARGET_URL}" target="_blank" rel="noopener noreferrer">
  <img src="${BANNER_URL}" width="120" height="40" alt="ProTipsBet - VIP Sports Predictions" />
</a>`;

export default function PartnersPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(EMBED_CODE);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback ako clipboard API не е достапно
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* HEADER */}
      <div className="mb-12">
        <div className="bg-emerald-500/10 p-3 rounded-full text-emerald-400 w-fit mb-5">
          <Handshake size={28} />
        </div>
        <h1 className="text-3xl md:text-4xl font-black text-white mb-3">Become a Partner</h1>
        <p className="text-zinc-400 text-sm md:text-base max-w-xl">
          Add our banner to your site and link back to ProTipsBet. Copy the code below and paste it anywhere on your page — no setup required.
        </p>
      </div>

      {/* PREVIEW */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600 mb-4">Preview</p>
        <div className="flex justify-center bg-zinc-950 rounded-xl p-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={BANNER_URL} width={120} height={40} alt="ProTipsBet banner preview" />
        </div>
        <p className="text-[11px] text-zinc-600 mt-3 text-center">120 × 40px</p>
      </div>

      {/* EMBED CODE */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 mb-10">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-600">Embed Code (HTML)</p>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            {copied ? "Copied!" : "Copy code"}
          </button>
        </div>
        <pre className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-xs text-zinc-300 overflow-x-auto whitespace-pre-wrap break-all">
          {EMBED_CODE}
        </pre>
      </div>

      {/* HOW TO USE */}
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4">How to add it</h3>
        <ol className="space-y-3 text-sm text-zinc-400">
          <li className="flex gap-3">
            <span className="text-emerald-400 font-black shrink-0">1.</span>
            Click "Copy code" above.
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-black shrink-0">2.</span>
            Paste it into your site's HTML — a footer, sidebar, or anywhere you display partner links or banners.
          </li>
          <li className="flex gap-3">
            <span className="text-emerald-400 font-black shrink-0">3.</span>
            The banner links directly to protipsbet.com and updates automatically on our end — you never need to touch the code again.
          </li>
        </ol>
      </div>

      <p className="text-xs text-zinc-600 mt-8 text-center">
        Questions about partnership? <Link href="/contact" className="text-emerald-400 hover:underline">Contact us</Link>
      </p>
    </div>
  );
}