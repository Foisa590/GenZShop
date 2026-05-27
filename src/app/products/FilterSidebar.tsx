"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Star, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface Props { categories: any[]; currentFilters: Record<string, string | undefined>; }
export function FilterSidebar(props: Props) { return <Suspense fallback={<aside className="hidden md:block w-64" />}><Inner {...props} /></Suspense>; }

const BRANDS = ["Apple", "Samsung", "Sony", "Nike", "Levi's", "IKEA", "Xiaomi", "boAt", "The Ordinary"];
const PRICE_RANGES = [{ label: "Under ৳500", min: 0, max: 500 }, { label: "৳500 - ৳2,000", min: 500, max: 2000 }, { label: "৳2,000 - ৳10,000", min: 2000, max: 10000 }, { label: "৳10,000 - ৳50,000", min: 10000, max: 50000 }, { label: "৳50,000+", min: 50000, max: 9999999 }];

function Inner({ categories, currentFilters }: Props) {
  const router = useRouter(); const searchParams = useSearchParams(); const [showMobile, setShowMobile] = useState(false);
  const updateFilter = (key: string, value: string | undefined) => { const params = new URLSearchParams(searchParams.toString()); value ? params.set(key, value) : params.delete(key); params.delete("page"); router.push(`/products?${params.toString()}`); };
  const cats = categories.length > 0 ? categories : [{ slug: "electronics", name: "Electronics" }, { slug: "fashion", name: "Fashion" }, { slug: "home-living", name: "Home & Living" }, { slug: "beauty", name: "Beauty" }, { slug: "sports", name: "Sports" }, { slug: "books", name: "Books" }];
  const content = (<>
    <div className="flex items-center justify-between p-4 border-b"><h3 className="font-bold text-gray-900">Filters</h3>{(currentFilters.category || currentFilters.brand || currentFilters.minPrice) && <button onClick={() => router.push("/products")} className="text-xs text-[#2874f0] font-semibold">CLEAR ALL</button>}</div>
    <div className="p-4 border-b"><h4 className="text-xs font-bold text-gray-900 uppercase mb-3">Categories</h4><div className="space-y-2"><label className="flex items-center gap-2 cursor-pointer"><input type="radio" name="category" checked={!currentFilters.category} onChange={() => updateFilter("category", undefined)} /><span className="text-sm text-gray-700">All</span></label>{cats.map((c: any) => <label key={c.slug} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="category" checked={currentFilters.category === c.slug} onChange={() => updateFilter("category", c.slug)} /><span className="text-sm text-gray-700">{c.name}</span></label>)}</div></div>
    <div className="p-4 border-b"><h4 className="text-xs font-bold text-gray-900 uppercase mb-3">Price</h4><div className="space-y-2">{PRICE_RANGES.map((r) => <label key={r.label} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="price" checked={currentFilters.minPrice === String(r.min)} onChange={() => { const params = new URLSearchParams(searchParams.toString()); params.set("minPrice", String(r.min)); params.set("maxPrice", String(r.max)); router.push(`/products?${params.toString()}`); }} /><span className="text-sm text-gray-700">{r.label}</span></label>)}</div></div>
    <div className="p-4 border-b"><h4 className="text-xs font-bold text-gray-900 uppercase mb-3">Brand</h4><div className="space-y-2">{BRANDS.map((b) => <label key={b} className="flex items-center gap-2 cursor-pointer"><input type="checkbox" checked={currentFilters.brand === b} onChange={() => updateFilter("brand", currentFilters.brand === b ? undefined : b)} className="rounded" /><span className="text-sm text-gray-700">{b}</span></label>)}</div></div>
    <div className="p-4"><h4 className="text-xs font-bold text-gray-900 uppercase mb-3">Rating</h4><div className="space-y-2">{[4, 3, 2, 1].map((r) => <label key={r} className="flex items-center gap-2 cursor-pointer"><input type="radio" name="rating" checked={currentFilters.rating === String(r)} onChange={() => updateFilter("rating", String(r))} /><span className="text-sm text-gray-700">{r}</span><Star size={12} className="text-yellow-400 fill-yellow-400" /><span className="text-sm text-gray-500">& above</span></label>)}</div></div>
  </>);
  return (<>
    <aside className="hidden md:block w-64 flex-shrink-0"><div className="bg-white rounded-sm shadow-sm sticky top-20 overflow-y-auto max-h-[calc(100vh-100px)]">{content}</div></aside>
    <div className="md:hidden fixed bottom-4 left-1/2 -translate-x-1/2 z-40"><Button onClick={() => setShowMobile(true)} className="shadow-lg"><SlidersHorizontal size={16} /> Filters</Button></div>
    {showMobile && <div className="md:hidden fixed inset-0 z-50"><div className="absolute inset-0 bg-black/50" onClick={() => setShowMobile(false)} /><div className="absolute left-0 top-0 bottom-0 w-80 bg-white overflow-y-auto animate-slide-in">{content}</div></div>}
  </>);
}
