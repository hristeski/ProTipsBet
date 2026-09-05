import Link from "next/link";
import { Mail, ShieldAlert, Send, MessageCircle } from "lucide-react";
import { getAllMarkets } from "@/lib/market-slug";
import { getAllTips, isPubliclyRenderable } from "@/lib/predictions";
import { getDistinctLeagues, slugifyLeague } from "@/lib/league-slug";

const TELEGRAM_URL = "https://t.me/protipsbet11";
const WHATSAPP_URL = "https://api.whatsapp.com/send/?phone=5493815694938&text&type=phone_number&app_absent=0";

export default async function Footer() {
  const tips = await getAllTips();
  const leagues = getDistinctLeagues(tips.filter(isPubliclyRenderable)).slice(0, 5);
  const markets = getAllMarkets();

  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 md:gap-12 mb-16">

          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-2xl font-black text-white tracking-tighter mb-4 block">
              ProTips<span className="text-emerald-500">Bet</span>
            </Link>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Premium sports analytics and high-confidence betting predictions. We track every ticket to provide 100% verified history and transparency.
            </p>
            <div className="flex items-center gap-4 text-zinc-500">
              <a href={TELEGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Telegram" className="hover:text-emerald-400 transition-colors p-2 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-emerald-500/30">
                <Send size={18} />
              </a>
              <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" className="hover:text-emerald-400 transition-colors p-2 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-emerald-500/30">
                <MessageCircle size={18} />
              </a>
              <a href="mailto:contact@protipsbet.com" aria-label="Email us" className="hover:text-emerald-400 transition-colors p-2 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-emerald-500/30">
                <Mail size={18} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Predictions</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-medium">
              <li><Link href="/free-tips" className="hover:text-emerald-400 transition-colors">Free Daily Tips</Link></li>
              <li><Link href="/vip-tips" className="hover:text-emerald-400 transition-colors flex items-center gap-2">VIP Analytics <span className="bg-amber-500/10 text-amber-400 text-[10px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider">Pro</span></Link></li>
              <li><Link href="/history" className="hover:text-emerald-400 transition-colors">Verified History</Link></li>
              <li><Link href="/results" className="hover:text-emerald-400 transition-colors">Weekly Results</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">By Market</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-medium">
              {markets.map((m) => (
                <li key={m.slug}>
                  <Link href={`/markets/${m.slug}`} className="hover:text-emerald-400 transition-colors">
                    {m.label} Tips
                  </Link>
                </li>
              ))}
              <li><Link href="/markets" className="hover:text-white transition-colors">All Markets →</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">By League</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-medium">
              {leagues.map((league) => (
                <li key={league}>
                  <Link href={`/leagues/${slugifyLeague(league)}`} className="hover:text-emerald-400 transition-colors">
                    {league} Tips
                  </Link>
                </li>
              ))}
              <li><Link href="/leagues" className="hover:text-white transition-colors">All Leagues →</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Resources</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-medium">
              <li><Link href="/glossary" className="hover:text-emerald-400 transition-colors">Betting Glossary</Link></li>
              <li><Link href="/partners" className="hover:text-white transition-colors">Become a Partner</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
              <li><Link href="/sitemap-page" className="hover:text-white transition-colors">Sitemap</Link></li>
            </ul>
          </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex items-start gap-3 mb-10 max-w-2xl">
          <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
          <p className="text-xs text-zinc-400 leading-relaxed">
            Sports betting involves significant financial risk. Please gamble responsibly. Our predictions are for informational and entertainment purposes only and do not guarantee financial gain.
          </p>
        </div>

        <div className="border-t border-zinc-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm text-center md:text-left font-medium">
            © {new Date().getFullYear()} ProTipsBet. All rights reserved. •{" "}
            <Link href="/terms" className="hover:text-white">Terms</Link> •{" "}
            <Link href="/privacy" className="hover:text-white">Privacy</Link>
          </p>
          <div className="flex items-center gap-3">
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-black px-2.5 py-1 rounded shadow-sm">18+</span>
            <span className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-[11px] font-black px-2.5 py-1 rounded shadow-sm uppercase tracking-widest flex items-center gap-1.5">
              Gamble Responsibly
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}