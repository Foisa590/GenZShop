"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, timeAgo } from "@/lib/utils";
import { Package, Phone, MapPin, CreditCard, Calendar } from "lucide-react";
import toast from "react-hot-toast";

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending", banglaLabel: "অপেক্ষমান", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { value: "confirmed", label: "Confirmed", banglaLabel: "নিশ্চিত", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { value: "shipped", label: "Shipped", banglaLabel: "প্রেরিত", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { value: "delivered", label: "Delivered", banglaLabel: "ডেলিভার্ড", color: "bg-green-100 text-green-800 border-green-300" },
  { value: "cancelled", label: "Cancelled", banglaLabel: "বাতিল", color: "bg-red-100 text-red-800 border-red-300" },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>("all");

  const load = async () => {
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*), profiles(full_name, email)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Load orders error:", error);
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const updateStatus = async (orderId: string, status: string) => {
    setUpdatingId(orderId);
    try {
      const supabase = createClient();

      // First check if user is admin
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("You must be logged in");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role !== "admin") {
        toast.error("Only admins can update orders. Run: UPDATE profiles SET role='admin' WHERE email='your@email.com'");
        return;
      }

      // Perform the update with .select() to verify
      const { data, error } = await supabase
        .from("orders")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .select();

      if (error) {
        console.error("Update error:", error);
        toast.error(`Update failed: ${error.message}`);
        return;
      }

      if (!data || data.length === 0) {
        toast.error("Update blocked by RLS policy. Check admin role.");
        return;
      }

      toast.success(`Order marked as ${status}`);
      // Optimistic update
      setOrders(orders.map((o) => (o.id === orderId ? { ...o, status } : o)));
    } catch (error: any) {
      console.error("Update order error:", error);
      toast.error(error?.message || "Failed to update order");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = filter === "all" ? orders : orders.filter((o) => o.status === filter);
  const statusCounts = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s.value] = orders.filter((o) => o.status === s.value).length;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-white rounded" />
        <div className="h-32 bg-white rounded-xl" />
        <div className="h-32 bg-white rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="text-xs text-gray-500 mt-0.5">অর্ডার ব্যবস্থাপনা • {orders.length} total</p>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border p-2 flex gap-1 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
            filter === "all" ? "bg-[#2874f0] text-white" : "text-gray-600 hover:bg-gray-100"
          }`}
        >
          All ({orders.length})
        </button>
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s.value}
            onClick={() => setFilter(s.value)}
            className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
              filter === s.value ? "bg-[#2874f0] text-white" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {s.label} ({statusCounts[s.value] || 0})
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border p-12 text-center">
            <Package size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No orders found</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const status = STATUS_OPTIONS.find((s) => s.value === order.status) || STATUS_OPTIONS[0];
            const addr = order.shipping_address || {};
            const isUpdating = updatingId === order.id;
            return (
              <div key={order.id} className="bg-white rounded-xl shadow-sm border overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 px-4 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b">
                  <div>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Calendar size={12} />
                      {timeAgo(order.created_at)}
                    </p>
                    <p className="text-sm font-bold text-gray-900 mt-0.5">
                      Order #{order.id.substring(0, 8).toUpperCase()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-base sm:text-lg font-bold text-gray-900">
                      {formatPrice(order.total_amount)}
                    </span>
                    <span className={`px-2 py-1 text-[10px] sm:text-xs font-bold rounded-full border ${status.color}`}>
                      {status.label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="p-4 space-y-3">
                  {/* Customer Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    <div>
                      <p className="text-gray-500 mb-0.5">Customer / কাস্টমার</p>
                      <p className="font-semibold text-gray-900">
                        {order.profiles?.full_name || addr.full_name || "—"}
                      </p>
                      <p className="text-gray-600 truncate">{order.profiles?.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-0.5 flex items-center gap-1">
                        <Phone size={11} /> Phone / ফোন
                      </p>
                      <p className="font-semibold text-gray-900">{addr.phone || "—"}</p>
                    </div>
                  </div>

                  {/* Address */}
                  {addr.address_line1 && (
                    <div className="text-xs sm:text-sm">
                      <p className="text-gray-500 mb-0.5 flex items-center gap-1">
                        <MapPin size={11} /> Delivery Address / ঠিকানা
                      </p>
                      <p className="text-gray-700">
                        {addr.address_line1}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                    </div>
                  )}

                  {/* Items */}
                  <div className="text-xs sm:text-sm border-t pt-2">
                    <p className="text-gray-500 mb-1">Items / পণ্য</p>
                    <div className="space-y-1">
                      {order.order_items?.map((item: any) => (
                        <div key={item.id} className="flex justify-between gap-2 text-gray-700">
                          <span className="truncate flex-1">
                            {item.product_name} <span className="text-gray-400">× {item.quantity}</span>
                          </span>
                          <span className="font-medium flex-shrink-0">{formatPrice(item.price * item.quantity)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 border-t pt-2">
                    <CreditCard size={12} />
                    <span className="capitalize font-medium">{order.payment_method}</span>
                    <span className="text-gray-400">•</span>
                    <span className={order.payment_status === "paid" ? "text-green-600" : "text-yellow-600"}>
                      {order.payment_status}
                    </span>
                    {order.tracking_id && (
                      <>
                        <span className="text-gray-400">•</span>
                        <span className="font-mono text-[10px]">TrxID: {order.tracking_id}</span>
                      </>
                    )}
                  </div>

                  {/* Status Update Action */}
                  <div className="border-t pt-3 flex flex-col sm:flex-row sm:items-center gap-2">
                    <span className="text-xs font-semibold text-gray-700">Update Status:</span>
                    <div className="flex gap-1.5 flex-wrap">
                      {STATUS_OPTIONS.map((s) => (
                        <button
                          key={s.value}
                          onClick={() => updateStatus(order.id, s.value)}
                          disabled={isUpdating || order.status === s.value}
                          className={`px-2.5 py-1 text-[11px] sm:text-xs font-medium rounded transition-all ${
                            order.status === s.value
                              ? `${s.color} ring-2 ring-offset-1 ring-blue-400 cursor-default`
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          } disabled:opacity-50`}
                        >
                          {isUpdating && order.status !== s.value ? "..." : s.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
