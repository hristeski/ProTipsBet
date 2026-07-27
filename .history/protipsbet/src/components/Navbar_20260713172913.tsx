"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Crown, User } from "lucide-react";

// Кастом нацртана уникатна спортска топка (Фудбал)
const SoccerBallIcon = ({ size = 24, className = "" }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="1.5" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="m12 12 3.5-2.5L14 5h-4l-1.5 4.5z" fill="currentColor" fillOpacity="0.2" />
    <path d="m12 12-4 3 1.5 4.5" />
    <path d="m12 12 4 3-1.5 4.5" />
    <path d="m15.5 9.5 5.5 1.5" />
    <path d="m8.5 9.5-5.5 1.5" />
    <path d="M10 5 8 2" />
    <path d="M14 5l2-3" />
  </svg>
);

export default function Navbar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Re-check on every route change too, in case they just logged in/out
    setIsLoggedIn(!!window.localStorage.getItem("protipsbet_token"));
  }, [pathname]);

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

        {/* Уникатно Лого */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="relative flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-600 p-2 rounded-xl group-hover:rotate-12 transition-transform duration-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]">
            <SoccerBallIcon size={22} className="text-zinc-950" />
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
              className={`text-sm font-bold transition-colors flex items-center gap-1.5 ${
                pathname === link.href ? "text-white" : "text-zinc-400 hover:text-white"
              } ${link.href === "/vip-tips" ? "text-amber-400 hover:text-amber-300" : ""}`}
            >
              {link.href === "/vip-tips" && <Crown size={14} className={pathname === link.href ? "text-amber-400" : ""} />}
              {link.label}
            </Link>
          ))}

          <Link
            href={isLoggedIn ? "/admin/tips" : "/login"}
            className={`text-sm font-bold transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              pathname.includes("/admin") 
                ? "bg-zinc-800 border-zinc-700 text-white" 
                : "bg-transparent border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-900"
            }`}
          >
            <User size={14} />
            {isLoggedIn ? "Dashboard" : "Login"}
          </Link>
        </div>

        {/* CTA Button */}
        <Link
          href="/vip-tips"
          className="flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-950 font-black rounded-full hover:bg-zinc-200 transition-all hover:scale-105 active:scale-95 shadow-md"
        >
          <Crown size={16} className="text-amber-500" />
          <span>VIP Access</span>
        </Link>
      </div>
    </nav>
  );
}