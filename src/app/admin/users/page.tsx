"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getInitials, timeAgo } from "@/lib/utils";
import { Search, Users, Mail, Phone } from "lucide-react";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
        setUsers(data || []);
      } catch {
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(search.toLowerCase())
  );
  const adminCount = users.filter((u) => u.role === "admin").length;

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-white rounded w-48" />
        <div className="h-64 bg-white rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Customers</h1>
        <p className="text-xs text-gray-500 mt-0.5">কাস্টমার • {users.length} total ({adminCount} admins)</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.length === 0 ? (
          <div className="col-span-full bg-white rounded-xl border p-8 text-center">
            <Users size={40} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No customers found</p>
          </div>
        ) : (
          filtered.map((u) => (
            <div key={u.id} className="bg-white rounded-xl shadow-sm border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  u.role === "admin"
                    ? "bg-gradient-to-br from-purple-500 to-pink-500 text-white"
                    : "bg-gradient-to-br from-blue-500 to-cyan-500 text-white"
                }`}>
                  {getInitials(u.full_name || u.email || "U")}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold text-gray-900 truncate text-sm">{u.full_name || "—"}</p>
                    {u.role === "admin" && (
                      <span className="px-1.5 py-0.5 bg-purple-100 text-purple-700 text-[10px] font-bold rounded">ADMIN</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 flex items-center gap-1 mt-1 truncate">
                    <Mail size={11} className="flex-shrink-0" />
                    <span className="truncate">{u.email}</span>
                  </p>
                  {u.phone && (
                    <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
                      <Phone size={11} />
                      {u.phone}
                    </p>
                  )}
                  <p className="text-[10px] text-gray-400 mt-2">Joined {timeAgo(u.created_at)}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
