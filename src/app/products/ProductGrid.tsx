"use client";
import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/types";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { SORT_OPTIONS } from "@/lib/constants";
import { Search } from "lucide-react";

export function ProductGrid({ products }: { products: Product[] }) { return <Suspense fallback={<div />}><Inner products={products} /></Suspense>; }

function Inner({ products }: { products: Product[] }) {
  const router = useRouter(); const searchParams = useSearchParams();
  const handleSort = (value: string) => { const params = new URLSearchParams(searchParams.toString()); value ? params.set("sort", value) : params.delete("sort"); router.push(`/products?${params.toString()}`); };
  if (products.length === 0) return <div className="bg-white rounded-sm shadow-sm"><EmptyState icon={<Search size={64} className="text-gray-300" />} title="No products found" description="Try changing your filters." actionLabel="View All" actionHref="/products" /></div>;
  return (
    <div>
      <div className="bg-white p-3 rounded-sm shadow-sm mb-4 flex items-center gap-3"><span className="text-sm font-semibold text-gray-700">Sort By:</span><div className="flex gap-1 overflow-x-auto">{SORT_OPTIONS.map((o) => (<button key={o.value} onClick={() => handleSort(o.value)} className={`px-3 py-1.5 text-xs font-medium rounded whitespace-nowrap transition-colors ${searchParams.get("sort") === o.value || (!searchParams.get("sort") && o.value === "") ? "bg-[#2874f0] text-white" : "text-gray-600 hover:bg-gray-100"}`}>{o.label}</button>))}</div></div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
    </div>
  );
}
