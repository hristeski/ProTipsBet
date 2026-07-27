import Link from "next/link";
import { Mail, ShieldAlert } from "lucide-react";

import BannerWall from "@/components/BannerWall";
import { FOOTER_BANNERS } from "@/lib/banners";

// Директни SVG икони за да не зависиме од надворешни пакети за брендови
const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
  </svg>
);

export default function Footer() {
  return (
    <footer className="bg-zinc-950 border-t border-zinc-800 pt-16 pb-8 mt-20">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          {/* Бренд Инфо */}
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-black text-white tracking-tighter mb-4 block">
              ProTips<span className="text-emerald-500">Bet</span>
            </Link>
            <p className="text-zinc-400 text-sm mb-6 leading-relaxed">
              Premium sports analytics and high-confidence betting predictions. We track every ticket to provide 100% verified history and transparency.
            </p>
            <div className="flex items-center gap-4 text-zinc-500">
              <a href="#" className="hover:text-emerald-400 transition-colors p-2 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-emerald-500/30">
                <TwitterIcon />
              </a>
              <a href="#" className="hover:text-emerald-400 transition-colors p-2 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-emerald-500/30">
                <InstagramIcon />
              </a>
              <a href="mailto:contact@protipsbet.com" className="hover:text-emerald-400 transition-colors p-2 bg-zinc-900 rounded-lg border border-zinc-800 hover:border-emerald-500/30">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Брзи Линкови */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Explore</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-medium">
              <li><Link href="/free-tips" className="hover:text-emerald-400 transition-colors">Free Daily Tips</Link></li>
              <li><Link href="/vip-tips" className="hover:text-emerald-400 transition-colors flex items-center gap-2">VIP Analytics <span className="bg-amber-500/10 text-amber-400 text-[10px] px-1.5 py-0.5 rounded uppercase font-black tracking-wider">Pro</span></Link></li>
              <li><Link href="/history" className="hover:text-emerald-400 transition-colors">Verified History</Link></li>
            </ul>
                        
          </div>

          {/* Правни Линкови */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Legal & Support</h4>
            <ul className="space-y-3 text-sm text-zinc-400 font-medium">
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/contact" className="hover:text-white transition-colors">Contact Support</Link></li>
            </ul>
          </div>

          {/* Задолжително Предупредување (Disclaimer) */}
          <div>
            <h4 className="text-white font-bold mb-5 uppercase tracking-wider text-sm">Disclaimer</h4>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-4 flex items-start gap-3">
              <ShieldAlert size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <p className="text-xs text-zinc-400 leading-relaxed">
                Sports betting involves significant financial risk. Please gamble responsibly. Our predictions are for informational and entertainment purposes only and do not guarantee financial gain.
              </p>
            </div>
          </div>
        </div>
<BannerWall title="Sponsored" banners={FOOTER_BANNERS} />

        {/* Долна Лента (Bottom Bar) */}
        <div className="border-t border-zinc-800/50 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-sm text-center md:text-left font-medium">
            © {new Date().getFullYear()} ProTipsBet. All rights reserved.
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