"use client";

import { useEffect, useState } from "react";
import { Loader2, Crown, ShieldAlert, ShieldCheck, Search } from "lucide-react";

const API_BASE = "http://localhost:5103";

type AdminUser = {
  id: number;
  email: string;
  fullName: string | null;
  role: string;
  isVip: boolean;
  vipExpiresAt: string | null;
  isActive: boolean;
  createdAt: string;
  totalPaid: number;
  confirmedPaymentsCount: number;
  pendingPaymentsCount: number;
  lastPaymentDate: string | null;
};

function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem("protipsbet_token");
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "vip" | "unpaid">("all");

  useEffect(() => {
    const fetchUsers = async () => {
      const token = getToken();
      try {
        const res = await fetch(`${API_BASE}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) setUsers(await res.json());
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const toggleActive = async (id: number) => {
    const token = getToken();
    const res = await fetch(`${API_BASE}/api/admin/users/${id}/toggle-active`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const { isActive } = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, isActive } : u)));
    }
  };

  const filtered = users
    .filter((u) => u.email.toLowerCase().includes(search.toLowerCase()))
    .filter((u) => {
      if (filter === "vip") return u.isVip;
      if (filter === "unpaid") return u.confirmedPaymentsCount === 0;
      return true;
    });

  if (loading)
    return (
      <div className="p-8 text-center text-neutral-500">
        <Loader2 className="animate-spin mx-auto" />
      </div>
    );

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-black text-white">Users</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500" />
            <input
              placeholder="Search email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-500"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
            className="px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-lg text-sm text-white focus:outline-none"
          >
            <option value="all">All users</option>
            <option value="vip">VIP only</option>
            <option value="unpaid">Never paid</option>
          </select>
        </div>
      </div>

      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-neutral-950 text-neutral-400 uppercase text-xs border-b border-neutral-800">
            <tr>
              <th className="p-4">User</th>
              <th className="p-4">Status</th>
              <th className="p-4">Total Paid</th>
              <th className="p-4">Payments</th>
              <th className="p-4">Last Payment</th>
              <th className="p-4">Joined</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className="p-8 text-center text-neutral-500">
                  No users found.
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-800/50">
                  <td className="p-4">
                    <div className="font-bold text-white">{u.email}</div>
                    <div className="text-xs text-neutral-500">{u.fullName ?? "—"} · {u.role}</div>
                  </td>
                  <td className="p-4">
                    {u.isVip ? (
                      <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-400 px-2 py-1 rounded text-xs font-bold">
                        <Crown size={12} /> VIP
                        {u.vipExpiresAt && (
                          <span className="text-neutral-500 font-normal">
                            · until {new Date(u.vipExpiresAt).toLocaleDateString()}
                          </span>
                        )}
                      </span>
                    ) : (
                      <span className="bg-neutral-800 text-neutral-400 px-2 py-1 rounded text-xs font-bold">Free</span>
                    )}
                    {!u.isActive && (
                      <span className="ml-2 bg-red-500/10 text-red-400 px-2 py-1 rounded text-xs font-bold">Suspended</span>
                    )}
                  </td>
                  <td className="p-4 font-black text-emerald-400">€{u.totalPaid.toFixed(2)}</td>
                  <td className="p-4 text-xs text-neutral-400">
                    {u.confirmedPaymentsCount} confirmed
                    {u.pendingPaymentsCount > 0 && (
                      <span className="text-amber-400"> · {u.pendingPaymentsCount} pending</span>
                    )}
                  </td>
                  <td className="p-4 text-xs text-neutral-500">
                    {u.lastPaymentDate ? new Date(u.lastPaymentDate).toLocaleDateString() : "Never"}
                  </td>
                  <td className="p-4 text-xs text-neutral-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-right">
                    <button
                      onClick={() => toggleActive(u.id)}
                      title={u.isActive ? "Suspend account" : "Reactivate account"}
                      className={u.isActive ? "text-neutral-500 hover:text-red-400" : "text-neutral-500 hover:text-emerald-400"}
                    >
                      {u.isActive ? <ShieldAlert size={18} /> : <ShieldCheck size={18} />}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
