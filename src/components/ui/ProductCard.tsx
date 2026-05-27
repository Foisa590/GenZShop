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

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    inWishlist ? removeFromWishlist(product.id) : addToWishlist(product);
  };
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <Link href={`/product/${product.slug}`}>
      <div className="product-card bg-white rounded-lg sm:rounded-sm border border-gray-100 overflow-hidden group relative h-full flex flex-col">
        {product.discount_percent > 0 && (
          <span className="absolute top-2 left-2 z-10 badge-discount text-[10px] sm:text-xs">
            {product.discount_percent}% OFF
          </span>
        )}
        <button
          onClick={handleWishlist}
          className="absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 bg-white rounded-full shadow flex items-center justify-center hover:scale-110 transition-transform"
          aria-label="Add to wishlist"
        >
          <Heart size={14} className={inWishlist ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
        <div className="relative w-full pt-[100%] bg-gray-50">
          <Image
            src={product.images[0] || "/placeholder.png"}
            alt={product.name}
            fill
            className="object-contain p-3 sm:p-4 group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        </div>
        <div className="p-2 sm:p-3 flex-1 flex flex-col">
          <p className="text-[9px] sm:text-xs text-gray-500 uppercase tracking-wide mb-0.5 sm:mb-1 truncate">
            {product.brand}
          </p>
          <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 mb-1.5 sm:mb-2 flex-1 leading-snug">
            {product.name}
          </h3>
          <div className="flex items-center gap-1.5 mb-1.5 sm:mb-2">
            <span className="inline-flex items-center gap-0.5 bg-green-600 text-white text-[10px] sm:text-xs font-semibold px-1 sm:px-1.5 py-0.5 rounded-sm">
              {product.rating} <Star size={8} fill="white" />
            </span>
            <span className="text-[10px] sm:text-xs text-gray-500 truncate">
              ({product.rating_count > 999 ? `${(product.rating_count / 1000).toFixed(1)}k` : product.rating_count})
            </span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-sm sm:text-base font-bold text-gray-900">
              {formatPrice(product.price)}
            </span>
            {product.original_price > product.price && (
              <>
                <span className="text-[10px] sm:text-xs text-gray-500 line-through">
                  {formatPrice(product.original_price)}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-green-600">
                  {product.discount_percent}% off
                </span>
              </>
            )}
          </div>
          <button
            onClick={handleAddToCart}
            className="mt-2 sm:mt-3 w-full flex items-center justify-center gap-1 py-1.5 sm:py-2 bg-[#ff9f00] hover:bg-[#fb8c00] text-white text-[11px] sm:text-xs font-semibold rounded-sm transition-colors sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ShoppingCart size={12} />
            <span className="sm:inline">ADD TO CART</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
