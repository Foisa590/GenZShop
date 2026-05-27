"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown, Package, MapPin, LogOut, Shield } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { getInitials } from "@/lib/utils";
import toast from "react-hot-toast";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const { user, profile, isAdmin, loading } = useAuth();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    setShowUserMenu(false);
    router.push("/");
    router.refresh();
  };

  const userName = profile?.full_name || user?.email?.split("@")[0] || "User";

  return (
    <header className="bg-[#2874f0] sticky top-0 z-40 shadow-md">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="flex items-center h-14 sm:h-16 gap-2 sm:gap-4">
          <Link href="/" className="flex-shrink-0">
            <div className="text-white">
              <h1 className="text-lg sm:text-xl font-bold italic leading-tight">{SITE_NAME}</h1>
              <p className="text-[9px] sm:text-[10px] text-yellow-300 -mt-0.5 italic flex items-center gap-1 leading-tight">
                Explore <span className="text-yellow-300">Plus</span>
                <span className="text-yellow-400">✦</span>
              </p>
            </div>
          </Link>

          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:block">
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products / প্রোডাক্ট খুঁজুন..."
                className="w-full py-2 pl-4 pr-12 rounded-sm text-sm bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-4 text-[#2874f0] hover:text-blue-800">
                <Search size={20} />
              </button>
            </div>
          </form>

          <div className="flex items-center gap-1 sm:gap-2 ml-auto">
            {/* User Menu / Login */}
            <div className="relative">
              {loading ? (
                <div className="w-9 h-9 rounded-full bg-blue-400 animate-pulse" />
              ) : user ? (
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 text-white px-2 sm:px-3 py-2 hover:bg-blue-600 rounded transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-yellow-400 text-[#2874f0] flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {getInitials(userName)}
                  </div>
                  <span className="hidden md:inline text-sm font-medium max-w-[100px] truncate">
                    {userName}
                  </span>
                  <ChevronDown size={14} className="hidden md:inline" />
                </button>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center gap-2 bg-white text-[#2874f0] px-3 sm:px-5 py-1.5 rounded-sm font-semibold text-xs sm:text-sm hover:bg-gray-100"
                >
                  <User size={14} className="sm:hidden" />
                  <span>Login</span>
                </Link>
              )}

              {showUserMenu && user && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded shadow-xl border w-56 py-2 animate-fade-in z-50">
                  <div className="px-4 py-3 border-b">
                    <p className="text-xs text-gray-500">Hello,</p>
                    <p className="text-sm font-semibold text-gray-900 truncate">{userName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/dashboard"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <User size={16} className="text-gray-400" />
                    <span>My Profile <span className="text-gray-400 text-xs">/ প্রোফাইল</span></span>
                  </Link>
                  <Link
                    href="/dashboard/orders"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <Package size={16} className="text-gray-400" />
                    <span>Orders <span className="text-gray-400 text-xs">/ অর্ডার</span></span>
                  </Link>
                  <Link
                    href="/dashboard/addresses"
                    className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                    onClick={() => setShowUserMenu(false)}
                  >
                    <MapPin size={16} className="text-gray-400" />
                    <span>Addresses <span className="text-gray-400 text-xs">/ ঠিকানা</span></span>
                  </Link>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-purple-700 hover:bg-purple-50 border-t"
                      onClick={() => setShowUserMenu(false)}
                    >
                      <Shield size={16} className="text-purple-500" />
                      <span className="font-semibold">Admin Panel</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 border-t"
                  >
                    <LogOut size={16} />
                    <span>Logout <span className="text-red-300 text-xs">/ লগ আউট</span></span>
                  </button>
                </div>
              )}
            </div>

            <Link
              href="/wishlist"
              className="relative text-white p-2 hover:bg-blue-600 rounded hidden sm:block"
            >
              <Heart size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-[#2874f0] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link
              href="/cart"
              className="relative flex items-center gap-1 text-white px-2 sm:px-3 py-2 hover:bg-blue-600 rounded"
            >
              <ShoppingCart size={20} />
              <span className="hidden md:inline text-sm font-medium">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-[#2874f0] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white sm:hidden p-2"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        <div className="sm:hidden pb-2">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search / খুঁজুন..."
                className="w-full py-2 pl-4 pr-10 rounded-sm text-sm bg-white text-gray-800 placeholder-gray-500 focus:outline-none"
              />
              <button type="submit" className="absolute right-0 top-0 h-full px-3 text-[#2874f0]">
                <Search size={18} />
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Sub Navbar */}
      <div className="bg-white border-b hidden md:block">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex items-center gap-8 h-10 overflow-x-auto no-scrollbar">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-700 hover:text-[#2874f0] whitespace-nowrap transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-t animate-slide-in max-h-[70vh] overflow-y-auto">
          <nav className="px-4 py-3 space-y-1">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2.5 text-sm text-gray-700 hover:text-[#2874f0] border-b border-gray-100"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}

      {/* Backdrop for user menu */}
      {showUserMenu && (
        <div className="fixed inset-0 z-30" onClick={() => setShowUserMenu(false)} />
      )}
    </header>
  );
}
