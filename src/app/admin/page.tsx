"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice, timeAgo } from "@/lib/utils";
import { Package, ShoppingBag, Users, TrendingUp, ArrowRight, Activity, DollarSign, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalProducts: 0, totalOrders: 0, totalUsers: 0, totalRevenue: 0, pendingOrders: 0 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const supabase = createClient();
        const [p, o, u, recent, top] = await Promise.all([
          supabase.from("products").select("id", { count: "exact" }),
          supabase.from("orders").select("id, total_amount, status"),
          supabase.from("profiles").select("id", { count: "exact" }),
          supabase.from("orders").select("*, profiles(full_name, email)").order("created_at", { ascending: false }).limit(5),
          supabase.from("products").select("name, price, rating, rating_count").order("rating_count", { ascending: false }).limit(5),
        ]);
        const totalRevenue = o.data?.reduce((sum, x) => sum + Number(x.total_amount), 0) || 0;
        const pending = o.data?.filter((x) => x.status === "pending").length || 0;
        setStats({
          totalProducts: p.count || 0,
          totalOrders: o.data?.length || 0,
          totalUsers: u.count || 0,
          totalRevenue,
          pendingOrders: pending,
        });
        setRecentOrders(recent.data || []);
        setTopProducts(top.data || []);
      } catch (e) {
        console.error("Dashboard error:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 w-48 bg-white rounded" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => <div key={i} className="h-32 bg-white rounded-xl" />)}
        </div>
        <div className="h-64 bg-white rounded-xl" />
      </div>
    );
  }

  const statCards = [
    {
      title: "Total Revenue",
      banglaTitle: "মোট আয়",
      value: formatPrice(stats.totalRevenue),
      icon: DollarSign,
      color: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Total Orders",
      banglaTitle: "মোট অর্ডার",
      value: stats.totalOrders,
      icon: ShoppingBag,
      color: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      link: "/admin/orders",
      badge: stats.pendingOrders > 0 ? `${stats.pendingOrders} pending` : null,
    },
    {
      title: "Products",
      banglaTitle: "প্রোডাক্ট",
      value: stats.totalProducts,
      icon: Package,
      color: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      link: "/admin/products",
    },
    {
      title: "Customers",
      banglaTitle: "কাস্টমার",
      value: stats.totalUsers,
      icon: Users,
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      link: "/admin/users",
    },
  ];

  return (
    <div className="space-y-5">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-5 sm:p-6 text-white shadow-lg">
        <h1 className="text-xl sm:text-2xl font-bold mb-1">Welcome back! 👋</h1>
        <p className="text-blue-100 text-sm">Here&apos;s what&apos;s happening with your store today / আজকের দোকানের আপডেট</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {statCards.map((card) => (
          <div key={card.title} className="bg-white rounded-xl shadow-sm border p-4 sm:p-5 relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className={`absolute top-0 right-0 w-20 h-20 ${card.bgColor} rounded-full -mr-8 -mt-8 opacity-50`} />
            <div className="relative">
              <div className={`w-9 h-9 sm:w-10 sm:h-10 ${card.bgColor} rounded-lg flex items-center justify-center mb-3`}>
                <card.icon size={18} className={card.iconColor} />
              </div>
              <p className="text-xs text-gray-500">{card.title}</p>
              <p className="text-[10px] text-gray-400 mb-1">{card.banglaTitle}</p>
              <p className="text-lg sm:text-2xl font-bold text-gray-900 mb-1">{card.value}</p>
              {card.badge && (
                <span className="inline-block text-[10px] font-semibold text-orange-600 bg-orange-100 px-2 py-0.5 rounded-full">
                  {card.badge}
                </span>
              )}
              {card.link && (
                <Link href={card.link} className={`flex items-center gap-1 text-xs font-medium ${card.iconColor} hover:underline mt-2`}>
                  View all <ArrowRight size={10} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 sm:p-5 border-b flex items-center justify-between">
            <div>
              <h2 className="font-bold text-gray-900 flex items-center gap-2">
                <Activity size={16} className="text-blue-500" />
                Recent Orders
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">সাম্প্রতিক অর্ডার</p>
            </div>
            <Link href="/admin/orders" className="text-xs sm:text-sm text-blue-600 font-medium hover:underline">View All →</Link>
          </div>

          <div className="divide-y">
            {recentOrders.length === 0 ? (
              <div className="p-8 text-center">
                <ShoppingBag size={40} className="mx-auto text-gray-300 mb-2" />
                <p className="text-sm text-gray-500">No orders yet</p>
              </div>
            ) : (
              recentOrders.map((o) => (
                <div key={o.id} className="p-3 sm:p-4 hover:bg-gray-50 flex items-center gap-3">
                  <div className="w-9 h-9 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <ShoppingBag size={16} className="text-blue-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {o.profiles?.full_name || o.profiles?.email || "Guest"}
                    </p>
                    <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                      <span className="font-mono">#{o.id.substring(0, 6)}</span>
                      <span>•</span>
                      <span>{timeAgo(o.created_at)}</span>
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">{formatPrice(o.total_amount)}</p>
                    <span className={`inline-block text-[10px] font-medium px-1.5 py-0.5 rounded mt-0.5 ${
                      o.status === "delivered" ? "bg-green-100 text-green-700" :
                      o.status === "shipped" ? "bg-blue-100 text-blue-700" :
                      o.status === "cancelled" ? "bg-red-100 text-red-700" :
                      o.status === "confirmed" ? "bg-purple-100 text-purple-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {o.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
          <div className="p-4 sm:p-5 border-b">
            <h2 className="font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp size={16} className="text-green-500" />
              Top Products
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">জনপ্রিয় পণ্য</p>
          </div>

          <div className="divide-y">
            {topProducts.length === 0 ? (
              <div className="p-6 text-center text-sm text-gray-500">No products</div>
            ) : (
              topProducts.map((p, i) => (
                <div key={i} className="p-3 flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                    i === 0 ? "bg-yellow-100 text-yellow-700" :
                    i === 1 ? "bg-gray-200 text-gray-700" :
                    i === 2 ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-500"
                  }`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-900 truncate">{p.name}</p>
                    <p className="text-[10px] text-gray-500">⭐ {p.rating} ({p.rating_count})</p>
                  </div>
                  <p className="text-xs font-bold text-gray-900 flex-shrink-0">{formatPrice(p.price)}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
            <BarChart3 size={20} className="text-purple-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">Quick Actions / দ্রুত কাজ</h3>
            <p className="text-xs text-gray-600 mt-0.5 mb-3">Common admin tasks at a glance</p>
            <div className="flex flex-wrap gap-2">
              <Link href="/admin/products" className="text-xs bg-white border border-purple-200 hover:border-purple-400 text-purple-700 px-3 py-1.5 rounded-lg font-medium">
                + Add Product
              </Link>
              <Link href="/admin/orders" className="text-xs bg-white border border-purple-200 hover:border-purple-400 text-purple-700 px-3 py-1.5 rounded-lg font-medium">
                Manage Orders
              </Link>
              <Link href="/" className="text-xs bg-white border border-purple-200 hover:border-purple-400 text-purple-700 px-3 py-1.5 rounded-lg font-medium">
                View Store
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
