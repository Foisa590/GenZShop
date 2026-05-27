"use client";

import Link from "next/link";
import Image from "next/image";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

export function ProductCard({ product }: { product: Product }) {
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const inWishlist = isInWishlist(product.id);

  const handleWishlist = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); inWishlist ? removeFromWishlist(product.id) : addToWishlist(product); };
  const handleAddToCart = (e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); addItem(product); };

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="product-card bg-white rounded-sm border border-gray-100 overflow-hidden group relative h-full flex flex-col">
        {product.discount_percent > 0 && <span className="absolute top-2 left-2 z-10 badge-discount">{product.discount_percent}% OFF</span>}
        <button onClick={handleWishlist} className="absolute top-2 right-2 z-10 w-8 h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform">
          <Heart size={16} className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
        <div className="relative w-full pt-[100%] bg-gray-50">
          <Image src={product.images[0] || "/placeholder.png"} alt={product.name} fill className="object-contain p-4 group-hover:scale-105 transition-transform duration-300" sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw" />
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">{product.brand}</p>
          <h3 className="text-sm font-medium text-gray-800 line-clamp-2 mb-2 flex-1">{product.name}</h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-sm">{product.rating} <Star size={10} fill="white" /></span>
            <span className="text-xs text-gray-500">({product.rating_count.toLocaleString()})</span>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
            {product.original_price > product.price && (<><span className="text-xs text-gray-500 line-through">{formatPrice(product.original_price)}</span><span className="text-xs font-semibold text-green-600">{product.discount_percent}% off</span></>)}
          </div>
          <button onClick={handleAddToCart} className="mt-3 w-full flex items-center justify-center gap-2 py-2 bg-[#ff9f00] hover:bg-[#fb8c00] text-white text-xs font-semibold rounded-sm transition-colors opacity-0 group-hover:opacity-100">
            <ShoppingCart size={14} /> ADD TO CART
          </button>
        </div>
      </div>
    </Link>
  );
}
