"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Crown, Activity } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/free-tips", label: "Free Picks" },
    { href: "/vip-tips", label: "VIP" },
    { href: "/history", label: "History" },
    { href: "/contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 hidden md:block bg-zinc-950/80 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="bg-emerald-500/10 p-2 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
            <Activity size={24} className="text-emerald-400" />
          </div>
          <span className="text-xl font-black text-white tracking-tight">
            Pro<span className="text-emerald-400">TipsBet</span>
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${
                pathname === link.href ? "text-white" : "text-zinc-400 hover:text-white"
              } ${link.href === "/vip-tips" ? "text-amber-400 hover:text-amber-300" : ""}`}
            >
              {link.href === "/vip-tips" && <Crown size={14} className={pathname === link.href ? "text-amber-400" : ""} />}
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <Link
          href="/vip-tips"
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-950 font-bold rounded-full hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95"
        >
          <Crown size={16} />
          <span>VIP Access</span>
        </Link>
      </div>
    </nav>
  );
}