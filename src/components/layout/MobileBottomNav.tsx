"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Heart, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuth } from "@/hooks/useAuth";

export function MobileBottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);
  const { user } = useAuth();

  // Hide on admin pages
  if (pathname?.startsWith("/admin")) return null;

  const items = [
    { href: "/", label: "Home", banglaLabel: "হোম", icon: Home },
    { href: "/products", label: "Shop", banglaLabel: "শপ", icon: Search },
    { href: "/wishlist", label: "Wishlist", banglaLabel: "পছন্দ", icon: Heart, badge: wishlistCount },
    { href: "/cart", label: "Cart", banglaLabel: "কার্ট", icon: ShoppingCart, badge: totalItems },
    { href: user ? "/dashboard" : "/login", label: user ? "Account" : "Login", banglaLabel: user ? "একাউন্ট" : "লগইন", icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-lg">
      <div className="flex items-center justify-around h-16">
        {items.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 h-full relative transition-colors ${
                isActive ? "text-[#2874f0]" : "text-gray-500"
              }`}
            >
              <div className="relative">
                <item.icon size={20} className={isActive ? "fill-blue-100" : ""} />
                {item.badge && item.badge > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {item.badge > 9 ? "9+" : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] mt-0.5 font-medium">{item.label}</span>
              <span className="text-[9px] text-gray-400 leading-none">{item.banglaLabel}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
