"use client";

import Link from "next/link";
import { useState } from "react";
import { Search, ShoppingCart, Heart, User, Menu, X, ChevronDown } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { NAV_LINKS, SITE_NAME } from "@/lib/constants";
import { useRouter } from "next/navigation";

export function Navbar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const wishlistCount = useWishlistStore((s) => s.items.length);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) { router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`); setSearchQuery(""); }
  };

  return (
    <header className="bg-[#2874f0] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center h-16 gap-4">
          <Link href="/" className="flex-shrink-0">
            <div className="text-white">
              <h1 className="text-xl font-bold italic">{SITE_NAME}</h1>
              <p className="text-[10px] text-yellow-300 -mt-1 italic flex items-center gap-1">Explore <span className="text-yellow-300">Plus</span><span className="text-yellow-400">✦</span></p>
            </div>
          </Link>
          <form onSubmit={handleSearch} className="flex-1 max-w-xl hidden sm:block">
            <div className="relative">
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for products, brands and more" className="w-full py-2 pl-4 pr-12 rounded-sm text-sm bg-white text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400" />
              <button type="submit" className="absolute right-0 top-0 h-full px-4 text-[#2874f0] hover:text-blue-800"><Search size={20} /></button>
            </div>
          </form>
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="relative">
              <button onClick={() => setShowUserMenu(!showUserMenu)} className="flex items-center gap-1 text-white font-medium text-sm px-3 py-2 hover:bg-blue-600 rounded"><User size={20} /><span className="hidden md:inline">Account</span><ChevronDown size={14} className="hidden md:inline" /></button>
              {showUserMenu && (
                <div className="absolute right-0 top-full mt-1 bg-white rounded shadow-xl border w-48 py-2 animate-fade-in z-50">
                  <Link href="/login" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Login / Sign Up</Link>
                  <Link href="/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>My Profile</Link>
                  <Link href="/dashboard/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Orders</Link>
                  <Link href="/wishlist" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" onClick={() => setShowUserMenu(false)}>Wishlist</Link>
                </div>
              )}
            </div>
            <Link href="/wishlist" className="relative text-white p-2 hover:bg-blue-600 rounded hidden sm:block"><Heart size={20} />{wishlistCount > 0 && <span className="absolute -top-1 -right-1 bg-yellow-400 text-[#2874f0] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{wishlistCount}</span>}</Link>
            <Link href="/cart" className="relative flex items-center gap-1 text-white font-medium text-sm px-3 py-2 hover:bg-blue-600 rounded"><ShoppingCart size={20} /><span className="hidden md:inline">Cart</span>{totalItems > 0 && <span className="absolute -top-1 -right-1 bg-yellow-400 text-[#2874f0] text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">{totalItems}</span>}</Link>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="text-white sm:hidden p-2">{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
          </div>
        </div>
        <div className="sm:hidden pb-3"><form onSubmit={handleSearch}><div className="relative"><input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search for products..." className="w-full py-2 pl-4 pr-12 rounded-sm text-sm bg-white text-gray-800 placeholder-gray-500 focus:outline-none" /><button type="submit" className="absolute right-0 top-0 h-full px-4 text-[#2874f0]"><Search size={18} /></button></div></form></div>
      </div>
      <div className="bg-white border-b hidden md:block"><div className="max-w-7xl mx-auto px-4"><nav className="flex items-center gap-8 h-10 overflow-x-auto">{NAV_LINKS.map((link) => (<Link key={link.href} href={link.href} className="text-sm font-medium text-gray-700 hover:text-[#2874f0] whitespace-nowrap transition-colors">{link.label}</Link>))}</nav></div></div>
      {mobileMenuOpen && (<div className="sm:hidden bg-white border-t animate-slide-in"><nav className="px-4 py-3 space-y-2">{NAV_LINKS.map((link) => (<Link key={link.href} href={link.href} className="block py-2 text-sm text-gray-700 hover:text-[#2874f0]" onClick={() => setMobileMenuOpen(false)}>{link.label}</Link>))}</nav></div>)}
    </header>
  );
}
