"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, Package, MapPin, LogOut, Heart } from "lucide-react";

const NAV_ITEMS = [
  { href: "/dashboard", label: "My Profile", banglaLabel: "প্রোফাইল", icon: User, exact: true },
  { href: "/dashboard/orders", label: "My Orders", banglaLabel: "অর্ডার", icon: Package },
  { href: "/dashboard/addresses", label: "Addresses", banglaLabel: "ঠিকানা", icon: MapPin },
  { href: "/wishlist", label: "Wishlist", banglaLabel: "পছন্দ", icon: Heart },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-3 sm:py-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">
        {/* Sidebar - hidden on mobile, shown on tablet+ */}
        <aside className="md:col-span-1 hidden md:block">
          <div className="bg-white rounded-lg shadow-sm sticky top-20 overflow-hidden">
            <div className="bg-gradient-to-r from-[#2874f0] to-purple-600 p-4 text-white">
              <p className="text-sm font-semibold">My Account</p>
              <p className="text-xs text-blue-100 mt-0.5">আমার একাউন্ট</p>
            </div>
            <nav className="p-2">
              {NAV_ITEMS.map((item) => {
                const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-4 py-3 text-sm rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-[#2874f0] font-semibold"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <item.icon size={18} />
                    <div className="flex-1">
                      <div>{item.label}</div>
                      <div className="text-[10px] text-gray-400">{item.banglaLabel}</div>
                    </div>
                  </Link>
                );
              })}
              <hr className="my-2" />
              <Link
                href="/logout"
                className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded-lg"
              >
                <LogOut size={18} />
                <div>
                  <div>Logout</div>
                  <div className="text-[10px] text-red-300">লগ আউট</div>
                </div>
              </Link>
            </nav>
          </div>
        </aside>

        {/* Mobile horizontal nav */}
        <div className="md:hidden bg-white rounded-lg shadow-sm overflow-x-auto no-scrollbar">
          <div className="flex">
            {NAV_ITEMS.map((item) => {
              const isActive = item.exact ? pathname === item.href : pathname?.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex-1 min-w-[80px] flex flex-col items-center gap-1 py-3 px-2 text-xs font-medium border-b-2 transition-colors ${
                    isActive
                      ? "border-[#2874f0] text-[#2874f0]"
                      : "border-transparent text-gray-600"
                  }`}
                >
                  <item.icon size={18} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </Link>
              );
            })}
          </div>
        </div>

        <main className="md:col-span-3">{children}</main>
      </div>
    </div>
  );
}
