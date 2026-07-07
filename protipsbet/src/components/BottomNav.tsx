"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Target, Crown, BarChart2, Mail } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/free-tips", label: "Free", icon: Target },
    { href: "/vip-tips", label: "VIP", icon: Crown },
    { href: "/history", label: "History", icon: BarChart2 },
    { href: "/contact", label: "Contact", icon: Mail },
  ];

  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden w-[92%] max-w-sm">
      <div className="bg-zinc-900/95 backdrop-blur-2xl border border-white/10 rounded-full px-2 py-2 flex justify-between items-center shadow-2xl shadow-black/50">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-14 h-12"
            >
              {isActive && (
                <div className="absolute inset-0 bg-white/10 rounded-full -z-10 animate-in zoom-in-90 duration-200"></div>
              )}
              <Icon 
                size={20} 
                strokeWidth={isActive ? 2.5 : 2}
                className={`mb-1 transition-colors ${
                  isActive ? "text-emerald-400" : "text-zinc-500"
                }`} 
              />
              <span className={`text-[9px] font-bold tracking-wider ${
                isActive ? "text-white" : "text-zinc-500"
              }`}>
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}