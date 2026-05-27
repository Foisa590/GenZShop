"use client";
import { useState } from "react";
import { Product } from "@/types";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { Button } from "@/components/ui/Button";
import { ShoppingCart, Zap, Heart, Truck, RotateCcw, Shield, Tag } from "lucide-react";
import { useRouter } from "next/navigation";

export function ProductInfo({ product }: { product: Product }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
  const router = useRouter();
  const inWishlist = isInWishlist(product.id);
  const savings = product.original_price - product.price;
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-sm shadow-sm p-6">
        <p className="text-sm text-gray-500 mb-1">{product.brand}</p>
        <h1 className="text-xl md:text-2xl font-medium text-gray-900 mb-3">{product.name}</h1>
        <div className="flex items-center gap-3 mb-4"><span className="inline-flex items-center gap-1 bg-green-600 text-white text-sm font-bold px-2 py-0.5 rounded">{product.rating} ★</span><span className="text-sm text-gray-500">{product.rating_count.toLocaleString()} Ratings</span></div>
        <div className="border-t pt-4"><div className="flex items-baseline gap-3 flex-wrap"><span className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</span>{savings > 0 && <><span className="text-lg text-gray-500 line-through">{formatPrice(product.original_price)}</span><span className="text-lg font-semibold text-green-600">{product.discount_percent}% off</span></>}</div>{savings > 0 && <p className="text-sm text-green-600 mt-1 flex items-center gap-1"><Tag size={14} /> You save {formatPrice(savings)}</p>}</div>
        <div className="flex items-center gap-3 mt-4"><span className="text-sm font-medium text-gray-700">Qty:</span><div className="flex items-center border rounded"><button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100">-</button><span className="w-10 h-8 flex items-center justify-center text-sm font-medium border-x">{quantity}</span><button onClick={() => setQuantity(Math.min(10, quantity + 1))} className="w-8 h-8 flex items-center justify-center hover:bg-gray-100">+</button></div>{product.stock < 10 && product.stock > 0 && <span className="text-xs text-red-500 font-medium">Only {product.stock} left!</span>}</div>
        <div className="flex gap-3 mt-6"><Button onClick={() => addItem(product, quantity)} size="lg" className="flex-1" disabled={product.stock === 0}><ShoppingCart size={18} /> ADD TO CART</Button><Button onClick={() => { addItem(product, quantity); router.push("/cart"); }} variant="secondary" size="lg" className="flex-1" disabled={product.stock === 0}><Zap size={18} /> BUY NOW</Button></div>
        <div className="flex gap-4 mt-4 border-t pt-4"><button onClick={() => inWishlist ? removeFromWishlist(product.id) : addToWishlist(product)} className={`flex items-center gap-2 text-sm font-medium ${inWishlist ? "text-red-500" : "text-gray-600 hover:text-red-500"}`}><Heart size={18} className={inWishlist ? "fill-red-500" : ""} />{inWishlist ? "Wishlisted" : "Add to Wishlist"}</button></div>
      </div>
      <div className="bg-white rounded-sm shadow-sm p-6"><h3 className="text-sm font-bold text-gray-900 mb-4">Delivery & Services</h3><div className="space-y-3"><div className="flex items-center gap-3"><Truck size={20} className="text-gray-500" /><div><p className="text-sm font-medium">Free Delivery</p><p className="text-xs text-gray-500">Orders above ৳1,000</p></div></div><div className="flex items-center gap-3"><RotateCcw size={20} className="text-gray-500" /><div><p className="text-sm font-medium">7 Day Return</p><p className="text-xs text-gray-500">Easy return</p></div></div><div className="flex items-center gap-3"><Shield size={20} className="text-gray-500" /><div><p className="text-sm font-medium">1 Year Warranty</p><p className="text-xs text-gray-500">Brand warranty</p></div></div></div></div>
      {product.description && <div className="bg-white rounded-sm shadow-sm p-6"><h3 className="text-sm font-bold text-gray-900 mb-3">Description</h3><p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{product.description}</p></div>}
    </div>
  );
}
