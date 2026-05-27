"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { getInitials, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const supabase = createClient(); const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false }); setUsers(data || []); } catch {} finally { setLoading(false); } })(); }, []);
  if (loading) return <div className="animate-pulse"><div className="h-64 bg-white rounded" /></div>;
  return (<div><h1 className="text-2xl font-bold mb-6">Customers ({users.length})</h1><div className="bg-white rounded-lg shadow-sm border overflow-hidden"><table className="w-full text-sm"><thead className="bg-gray-50 text-xs uppercase text-gray-500"><tr><th className="text-left px-4 py-3">Customer</th><th className="text-left px-4 py-3">Email</th><th className="text-left px-4 py-3">Role</th><th className="text-left px-4 py-3">Joined</th></tr></thead><tbody className="divide-y">{users.map(u => <tr key={u.id} className="hover:bg-gray-50"><td className="px-4 py-3"><div className="flex items-center gap-3"><div className="w-8 h-8 rounded-full bg-[#2874f0] flex items-center justify-center text-white text-xs font-bold">{getInitials(u.full_name || "U")}</div><span className="font-medium">{u.full_name || "—"}</span></div></td><td className="px-4 py-3 text-gray-600">{u.email}</td><td className="px-4 py-3"><Badge variant={u.role === "admin" ? "info" : "default"}>{u.role || "customer"}</Badge></td><td className="px-4 py-3 text-xs text-gray-500">{timeAgo(u.created_at)}</td></tr>)}</tbody></table></div></div>);
}
