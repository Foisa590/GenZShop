"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, Menu, X, Store, RefreshCw } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", banglaLabel: "ড্যাশবোর্ড", icon: LayoutDashboard, exact: true },
  { href: "/admin/products", label: "Products", banglaLabel: "প্রোডাক্ট", icon: Package },
  { href: "/admin/orders", label: "Orders", banglaLabel: "অর্ডার", icon: ShoppingBag },
  { href: "/admin/users", label: "Customers", banglaLabel: "কাস্টমার", icon: Users },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const { user, profile, isAdmin, loading, refresh } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-sm text-gray-500">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-2">Login Required</h1>
          <p className="text-sm text-gray-500 mb-4">Please login to access admin panel</p>
          <Link href="/login?redirect=/admin" className="inline-block bg-[#2874f0] text-white px-6 py-2 rounded font-medium">
            Login
          </Link>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <X size={32} className="text-red-500" />
          </div>
          <h1 className="text-xl font-bold text-gray-900 mb-2 text-center">Access Denied</h1>
          <p className="text-sm text-gray-500 mb-1 text-center">You don&apos;t have admin privileges</p>
          <p className="text-xs text-gray-400 mb-4 text-center">আপনার অ্যাডমিন অ্যাক্সেস নেই</p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-xs font-semibold text-yellow-900 mb-1">Logged in as:</p>
            <p className="text-xs text-gray-700 font-mono break-all">{user.email}</p>
            <p className="text-xs text-gray-500 mt-1">Current role: <span className="font-semibold">{profile?.role || "customer"}</span></p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-left mb-4">
            <p className="text-xs font-semibold text-blue-900 mb-1">Step 1: Run this SQL in Supabase:</p>
            <code className="block bg-white border border-blue-200 rounded p-2 mt-2 text-[10px] text-gray-700 break-all">
              UPDATE profiles SET role=&apos;admin&apos; WHERE email=&apos;{user.email}&apos;;
            </code>
            <p className="text-xs text-blue-700 mt-2">Step 2: Click refresh below ⬇️</p>
          </div>

          <button
            onClick={async () => {
              setRefreshing(true);
              await refresh();
              setTimeout(() => setRefreshing(false), 500);
            }}
            disabled={refreshing}
            className="w-full bg-[#2874f0] text-white py-2.5 rounded font-medium flex items-center justify-center gap-2 disabled:opacity-50 mb-2"
          >
            <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
            {refreshing ? "Refreshing..." : "I've Updated DB - Refresh Now"}
          </button>

          <Link
            href="/"
            className="block text-center text-sm text-blue-600 hover:underline"
          >
            ← Back to Store
          </Link>
        </div>
      </div>
    );
  }

  const isActive = (href: string, exact = false) => exact ? pathname === href : pathname?.startsWith(href);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="md:hidden admin-gradient text-white sticky top-0 z-30 shadow-lg">
        <div className="flex items-center justify-between px-4 h-14">
          <button onClick={() => setMobileOpen(true)} className="p-2 -ml-2">
            <Menu size={22} />
          </button>
          <div className="flex items-center gap-2">
            <Store size={18} />
            <h1 className="text-base font-bold">Admin Panel</h1>
          </div>
          <Link href="/" className="p-2 -mr-2 text-xs font-medium">Store</Link>
        </div>
      </header>

      <div className="flex">
        {/* Desktop Sidebar */}
        <aside className="w-64 admin-gradient text-white hidden md:flex flex-col fixed h-screen overflow-y-auto z-20">
          <div className="p-6 border-b border-white/10">
            <div className="flex items-center gap-3 mb-1">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <Store size={20} />
              </div>
              <div>
                <h1 className="text-base font-bold">GenZShop</h1>
                <p className="text-[11px] text-blue-100">Admin Console</p>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 border-b border-white/10">
            <p className="text-[10px] uppercase tracking-wider text-blue-200">Logged in as</p>
            <p className="text-sm font-semibold mt-0.5 truncate">{profile?.full_name || "Admin"}</p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-yellow-400 text-blue-900 text-[10px] font-bold rounded">
              ADMIN
            </span>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                  isActive(item.href, item.exact)
                    ? "bg-white text-blue-700 font-semibold shadow-lg"
                    : "text-blue-100 hover:bg-white/10 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                <div className="flex-1">
                  <div>{item.label}</div>
                  <div className={`text-[10px] ${isActive(item.href, item.exact) ? "text-blue-500" : "text-blue-300"}`}>
                    {item.banglaLabel}
                  </div>
                </div>
              </Link>
            ))}
          </nav>

          <div className="p-3 border-t border-white/10">
            <Link
              href="/"
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-100 hover:bg-white/10 hover:text-white rounded-xl transition-colors"
            >
              <Settings size={16} />
              <span>Back to Store</span>
            </Link>
          </div>
        </aside>

        {/* Mobile Drawer */}
        {mobileOpen && (
          <div className="md:hidden fixed inset-0 z-40">
            <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
            <aside className="absolute left-0 top-0 bottom-0 w-72 admin-gradient text-white overflow-y-auto animate-slide-in">
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-white/20 rounded-lg flex items-center justify-center">
                    <Store size={18} />
                  </div>
                  <div>
                    <h1 className="text-sm font-bold">GenZShop</h1>
                    <p className="text-[10px] text-blue-100">Admin Console</p>
                  </div>
                </div>
                <button onClick={() => setMobileOpen(false)} className="p-1.5">
                  <X size={20} />
                </button>
              </div>

              <div className="p-4 border-b border-white/10">
                <p className="text-[10px] uppercase text-blue-200">Logged in</p>
                <p className="text-sm font-semibold truncate">{profile?.full_name}</p>
              </div>

              <nav className="p-3 space-y-1">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all ${
                      isActive(item.href, item.exact) ? "bg-white text-blue-700 font-semibold" : "text-blue-100 hover:bg-white/10"
                    }`}
                  >
                    <item.icon size={18} />
                    <div>
                      <div>{item.label}</div>
                      <div className="text-[10px] opacity-70">{item.banglaLabel}</div>
                    </div>
                  </Link>
                ))}
              </nav>

              <div className="p-3 border-t border-white/10">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-blue-100 hover:bg-white/10 rounded-xl"
                >
                  <Settings size={16} />
                  <span>Back to Store</span>
                </Link>
              </div>
            </aside>
          </div>
        )}

        <main className="flex-1 md:ml-64 min-h-screen">
          <div className="p-4 sm:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
