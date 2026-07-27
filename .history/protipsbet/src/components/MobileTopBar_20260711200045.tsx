"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { User, Crown } from "lucide-react";

export default function MobileTopBar() {
  const pathname = usePathname();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!window.localStorage.getItem("protipsbet_token"));
  }, [pathname]);

  const isActive = pathname === "/account" || pathname === "/login";

  return (
    <div className="fixed top-4 right-4 z-50 md:hidden">
      <Link
        href={isLoggedIn ? "/account" : "/login"}
        className={`flex items-center gap-1.5 pl-3 pr-4 py-2 rounded-full backdrop-blur-2xl border shadow-lg transition-colors ${
          isActive
            ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400"
            : "bg-zinc-900/90 border-white/10 text-white hover:bg-zinc-800/90"
        }`}
      >
        {isLoggedIn ? <Crown size={15} className="text-amber-400" /> : <User size={15} />}
        <span className="text-xs font-bold">{isLoggedIn ? "Account" : "Login"}</span>
      </Link>
    </div>
  );
}
