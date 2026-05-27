"use client";
import { useWishlistStore } from "@/store/wishlistStore";
import { ProductCard } from "@/components/ui/ProductCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heart } from "lucide-react";
export default function WishlistPage() {
  const { items } = useWishlistStore();
  if (items.length === 0) return <div className="max-w-4xl mx-auto px-4 py-8"><EmptyState icon={<Heart size={80} className="text-gray-300" />} title="Your wishlist is empty!" description="Save items you like." actionLabel="Start Shopping" actionHref="/products" /></div>;
  return (<div className="max-w-7xl mx-auto px-4 py-4"><div className="bg-white rounded-sm shadow-sm p-4 mb-4"><h1 className="text-lg font-bold text-gray-900">My Wishlist ({items.length})</h1></div><div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 md:gap-4">{items.map((p) => <ProductCard key={p.id} product={p} />)}</div></div>);
}
