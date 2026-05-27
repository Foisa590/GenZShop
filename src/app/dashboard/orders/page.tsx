"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, timeAgo } from "@/lib/utils";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import { Package } from "lucide-react";
import Image from "next/image";
import { ORDER_STATUSES } from "@/lib/constants";
export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { try { const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (user) { const { data } = await supabase.from("orders").select("*, order_items(*)").eq("user_id", user.id).order("created_at", { ascending: false }); setOrders(data || []); } } catch {} finally { setLoading(false); } })(); }, []);
  if (loading) return <div className="space-y-4">{[1,2].map((i) => <div key={i} className="bg-white rounded-sm shadow-sm p-6 animate-pulse"><div className="h-4 w-32 bg-gray-200 rounded mb-4" /><div className="h-16 bg-gray-200 rounded" /></div>)}</div>;
  if (orders.length === 0) return <EmptyState icon={<Package size={80} className="text-gray-300" />} title="No orders yet" description="Start shopping!" actionLabel="Shop Now" actionHref="/products" />;
  return (<div className="space-y-4"><div className="bg-white rounded-sm shadow-sm p-4"><h1 className="text-lg font-bold">My Orders ({orders.length})</h1></div>
    {orders.map((order) => { const status = ORDER_STATUSES[order.status as keyof typeof ORDER_STATUSES] || ORDER_STATUSES.pending; return (
      <div key={order.id} className="bg-white rounded-sm shadow-sm p-4"><div className="flex items-center justify-between mb-3 pb-3 border-b"><div><p className="text-xs text-gray-500">{timeAgo(order.created_at)}</p><p className="text-xs text-gray-400">ID: {order.id.substring(0, 8)}...</p></div><div className="text-right"><Badge variant={order.status === "delivered" ? "success" : order.status === "cancelled" ? "danger" : "warning"}>{status.label}</Badge><p className="text-sm font-bold mt-1">{formatPrice(order.total_amount)}</p></div></div>
        <div className="space-y-2">{order.order_items?.map((item: any) => <div key={item.id} className="flex items-center gap-3"><div className="relative w-12 h-12 bg-gray-50 rounded"><Image src={item.product_image || "/placeholder.png"} alt={item.product_name} fill className="object-contain p-1" sizes="48px" /></div><div className="flex-1 min-w-0"><p className="text-sm truncate">{item.product_name}</p><p className="text-xs text-gray-500">Qty: {item.quantity}</p></div></div>)}</div>
      </div>); })}
  </div>);
}
