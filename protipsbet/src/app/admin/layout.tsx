"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";


import {
  LayoutDashboard,
  CreditCard,
  Trophy,
  Archive,
  Users,
  LogOut,
  Menu,
  X,
  Tag,
  Loader2,
} from "lucide-react";
import { isAdminToken } from "@/lib/jwt";

const ADMIN_LINKS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Payments", href: "/admin/payments", icon: CreditCard },
  { name: "Tips Manager", href: "/admin/tips", icon: Trophy },
  { name: "Tickets Archive", href: "/admin/archive", icon: Archive },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Discounts", href: "/admin/discounts", icon: Tag },

];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [authState, setAuthState] = useState<"checking" | "authorized" | "denied">("checking");

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    if (isLoginPage) {
      setAuthState("authorized"); // login page renders its own thing, no guard needed
      return;
    }

    const token = window.localStorage.getItem("protipsbet_token");
    if (isAdminToken(token)) {
      setAuthState("authorized");
    } else {
      window.localStorage.removeItem("protipsbet_token");
      setAuthState("denied");
      router.replace("/admin/login");
    }
  }, [isLoginPage, pathname, router]);

  const handleLogout = () => {
    window.localStorage.removeItem("protipsbet_token");
    router.push("/admin/login");
  };

  if (isLoginPage) {
    return <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">{children}</div>;
  }

  // While checking or after a denial (about to redirect), render nothing but a
  // spinner - never the sidebar/content, even for a split second.
  if (authState !== "authorized") {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center">
        <Loader2 className="animate-spin text-emerald-500" size={28} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col md:flex-row">

      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between bg-neutral-900 border-b border-neutral-800 p-4">
        <div className="font-black text-xl text-white tracking-tighter">
          ProTips<span className="text-emerald-500">Admin</span>
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-neutral-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside className={`
        ${isMobileMenuOpen ? "block" : "hidden"}
        md:block w-full md:w-64 bg-neutral-900 border-r border-neutral-800 shrink-0 flex flex-col min-h-full
      `}>
        <div className="hidden md:block p-6">
          <div className="font-black text-2xl text-white tracking-tighter">
            ProTips<span className="text-emerald-500">Admin</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 md:py-0 space-y-1">
          {ADMIN_LINKS.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all
                  ${isActive
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "text-neutral-400 hover:text-white hover:bg-neutral-800"
                  }
                `}
              >
                <Icon size={18} className={isActive ? "text-emerald-400" : "text-neutral-500"} />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 mt-auto">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-neutral-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-neutral-950">
        {children}
      </main>

    </div>
  );
}