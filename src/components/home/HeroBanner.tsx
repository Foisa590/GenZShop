"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
const banners = [
  { id: 1, title: "Mega Electronics Sale", subtitle: "Up to 70% Off on Smartphones, Laptops & more", cta: "Shop Now", href: "/products?category=electronics", bg: "from-blue-600 to-indigo-800", emoji: "📱" },
  { id: 2, title: "Fashion Fiesta", subtitle: "New Arrivals | Flat 50% Off on Top Brands", cta: "Explore Fashion", href: "/products?category=fashion", bg: "from-pink-500 to-purple-700", emoji: "👗" },
  { id: 3, title: "Home Makeover Sale", subtitle: "Transform your space with upto 60% off", cta: "Shop Home", href: "/products?category=home-living", bg: "from-amber-500 to-orange-700", emoji: "🏠" },
  { id: 4, title: "Beauty Bonanza", subtitle: "Premium skincare & makeup at unbeatable prices", cta: "Explore Beauty", href: "/products?category=beauty", bg: "from-rose-400 to-pink-700", emoji: "💄" },
];
export function HeroBanner() {
  const [current, setCurrent] = useState(0);
  useEffect(() => { const timer = setInterval(() => setCurrent((p) => (p + 1) % banners.length), 5000); return () => clearInterval(timer); }, []);
  return (
    <div className="relative overflow-hidden">
      <div className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${current * 100}%)` }}>
        {banners.map((b) => (
          <div key={b.id} className={`min-w-full bg-gradient-to-r ${b.bg} py-12 md:py-20 px-4`}>
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="text-white max-w-lg">
                <h2 className="text-3xl md:text-5xl font-bold mb-3">{b.title}</h2>
                <p className="text-base md:text-lg text-white/90 mb-6">{b.subtitle}</p>
                <Link href={b.href} className="inline-block bg-white text-gray-900 font-semibold px-6 py-3 rounded-sm hover:bg-gray-100 transition-colors text-sm">{b.cta} →</Link>
              </div>
              <div className="hidden md:block text-8xl">{b.emoji}</div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setCurrent((c) => (c - 1 + banners.length) % banners.length)} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow"><ChevronLeft size={20} /></button>
      <button onClick={() => setCurrent((c) => (c + 1) % banners.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow"><ChevronRight size={20} /></button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">{banners.map((_, i) => (<button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition-all ${i === current ? "bg-white w-6" : "bg-white/50"}`} />))}</div>
    </div>
  );
}
