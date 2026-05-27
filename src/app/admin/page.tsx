"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Package, ShoppingBag, Users, IndianRupee } from "lucide-react";
import Link from "next/link";
export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0 }); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const supabase = createClient(); const [p, o, u] = await Promise.all([supabase.from("products").select("id", { count: "exact" }), supabase.from("orders").select("id, total_amount"), supabase.from("profiles").select("id", { count: "exact" })]); setStats({ totalProducts: p.count || 0, totalOrders: o.data?.length || 0, totalUsers: u.count || 0, totalRevenue: o.data?.reduce((s, x) => s + Number(x.total_amount), 0) || 0 }); } catch {} finally { setLoading(false); } })(); }, []);
  if (loading) return <div className="animate-pulse"><div className="grid grid-cols-4 gap-4">{[1,2,3,4].map(i => <div key={i} className="h-32 bg-white rounded-lg" />)}</div></div>;
  return (<div><h1 className="text-2xl font-bold mb-6">Dashboard</h1><div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div className="bg-white rounded-lg p-6 shadow-sm border"><p className="text-sm text-gray-500">Revenue</p><p className="text-2xl font-bold mt-1">{formatPrice(stats.totalRevenue)}</p></div>
    <div className="bg-white rounded-lg p-6 shadow-sm border"><p className="text-sm text-gray-500">Orders</p><p className="text-2xl font-bold mt-1">{stats.totalOrders}</p><Link href="/admin/orders" className="text-xs text-blue-600">View all →</Link></div>
    <div className="bg-white rounded-lg p-6 shadow-sm border"><p className="text-sm text-gray-500">Products</p><p className="text-2xl font-bold mt-1">{stats.totalProducts}</p><Link href="/admin/products" className="text-xs text-purple-600">Manage →</Link></div>
    <div className="bg-white rounded-lg p-6 shadow-sm border"><p className="text-sm text-gray-500">Customers</p><p className="text-2xl font-bold mt-1">{stats.totalUsers}</p></div>
  </div></div>);
}
