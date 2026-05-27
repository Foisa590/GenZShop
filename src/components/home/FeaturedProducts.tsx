"use client";
import Link from "next/link";
import { Product } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { ChevronRight } from "lucide-react";

export function FeaturedProducts({ products }: { products: Product[] }) {
  if (!products || products.length === 0) return null;
  return (
    <section className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-5">
        <div className="flex items-center justify-between mb-3 sm:mb-4">
          <div>
            <h2 className="text-base sm:text-xl md:text-2xl font-bold text-gray-900">Featured Products</h2>
            <p className="text-xs text-gray-500 mt-0.5">বাছাইকৃত পণ্য • Handpicked just for you</p>
          </div>
          <Link href="/products" className="flex items-center gap-1 bg-[#2874f0] text-white px-3 sm:px-4 py-1.5 sm:py-2 rounded-sm text-xs sm:text-sm font-semibold hover:bg-[#1a5dc8]">
            VIEW ALL <ChevronRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3 md:gap-4">
          {products.slice(0, 8).map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      </div>
    </section>
  );
}
