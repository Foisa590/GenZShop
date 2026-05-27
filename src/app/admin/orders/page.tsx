"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, timeAgo } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import toast from "react-hot-toast";
export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]); const [loading, setLoading] = useState(true);
  const load = async () => { try { const supabase = createClient(); const { data } = await supabase.from("orders").select("*, order_items(*), profiles(full_name, email)").order("created_at", { ascending: false }); setOrders(data || []); } catch {} finally { setLoading(false); } };
  useEffect(() => { load(); }, []);
  const updateStatus = async (id: string, status: string) => { try { const supabase = createClient(); await supabase.from("orders").update({ status }).eq("id", id); toast.success(`Marked ${status}`); load(); } catch { toast.error("Failed"); } };
  if (loading) return <div className="animate-pulse"><div className="h-64 bg-white rounded" /></div>;
  return (<div><h1 className="text-2xl font-bold mb-6">Orders ({orders.length})</h1><div className="space-y-4">{orders.length === 0 ? <div className="bg-white rounded-lg p-8 text-center text-gray-500">No orders yet</div> : orders.map(o => <div key={o.id} className="bg-white rounded-lg shadow-sm border p-4">
    <div className="flex justify-between items-center mb-3"><div><p className="text-sm font-bold">#{o.id.substring(0,8)}</p><p className="text-xs text-gray-500">{timeAgo(o.created_at)} • {o.profiles?.full_name || o.profiles?.email || "Guest"}</p></div><div className="flex items-center gap-3"><span className="font-bold">{formatPrice(o.total_amount)}</span><Badge variant={o.status==="delivered"?"success":o.status==="cancelled"?"danger":"warning"}>{o.status}</Badge></div></div>
    <div className="text-xs text-gray-600 mb-3">{o.order_items?.map((i: any, idx: number) => <span key={i.id}>{i.product_name} (×{i.quantity}){idx < o.order_items.length - 1 && ", "}</span>)}</div>
    <div className="border-t pt-3"><select value={o.status} onChange={e => updateStatus(o.id, e.target.value)} className="text-xs border rounded px-2 py-1.5"><option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></div>
  </div>)}</div></div>);
}
