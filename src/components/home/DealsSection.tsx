"use client";
import Link from "next/link";
import { Product } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { ChevronRight } from "lucide-react";
export function DealsSection({ title, products, viewAllHref }: { title: string; products: Product[]; viewAllHref?: string }) {
  if (!products || products.length === 0) return null;
  return (
    <section className="bg-white shadow-sm"><div className="max-w-7xl mx-auto px-4 py-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">{title}</h2>
        {viewAllHref && <Link href={viewAllHref} className="flex items-center gap-1 bg-[#2874f0] text-white px-4 py-2 rounded-sm text-sm font-semibold hover:bg-[#1a5dc8] transition-colors">VIEW ALL <ChevronRight size={16} /></Link>}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">{products.slice(0, 5).map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </div></section>
  );
}
