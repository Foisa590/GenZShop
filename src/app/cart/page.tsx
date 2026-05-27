"use client";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Minus, Plus, ShoppingCart, Tag, Shield } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice, getTotalSavings, clearCart } = useCartStore();
  const totalPrice = getTotalPrice();
  const totalSavings = getTotalSavings();
  const deliveryFee = totalPrice >= 499 ? 0 : 40;
  const finalAmount = totalPrice + deliveryFee;

  if (items.length === 0) return <div className="max-w-4xl mx-auto px-4 py-8"><EmptyState icon={<ShoppingCart size={80} className="text-gray-300" />} title="Your cart is empty!" description="Explore our products and find something you love." actionLabel="Shop Now" actionHref="/products" /></div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-4"><div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white rounded-sm shadow-sm p-4 flex items-center justify-between"><h1 className="text-lg font-bold text-gray-900">My Cart ({items.length})</h1><button onClick={clearCart} className="text-sm text-red-500 hover:text-red-700 font-medium">Clear Cart</button></div>
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-sm shadow-sm p-4 flex gap-4">
            <Link href={`/product/${item.product.slug}`} className="flex-shrink-0"><div className="relative w-24 h-24 md:w-28 md:h-28 bg-gray-50 rounded"><Image src={item.product.images[0] || "/placeholder.png"} alt={item.product.name} fill className="object-contain p-2" sizes="112px" /></div></Link>
            <div className="flex-1 min-w-0">
              <Link href={`/product/${item.product.slug}`}><h3 className="text-sm font-medium text-gray-800 line-clamp-2 hover:text-[#2874f0]">{item.product.name}</h3></Link>
              <p className="text-xs text-gray-500 mt-1">{item.product.brand}</p>
              <div className="flex items-center gap-2 mt-2 flex-wrap"><span className="text-base font-bold text-gray-900">{formatPrice(item.product.price)}</span>{item.product.original_price > item.product.price && <><span className="text-xs text-gray-500 line-through">{formatPrice(item.product.original_price)}</span><span className="text-xs font-semibold text-green-600">{item.product.discount_percent}% off</span></>}</div>
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2"><button onClick={() => updateQuantity(item.product.id, item.quantity - 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100" disabled={item.quantity <= 1}><Minus size={14} /></button><span className="w-10 h-7 flex items-center justify-center border rounded text-sm font-medium">{item.quantity}</span><button onClick={() => updateQuantity(item.product.id, item.quantity + 1)} className="w-7 h-7 rounded-full border flex items-center justify-center hover:bg-gray-100" disabled={item.quantity >= 10}><Plus size={14} /></button></div>
                <button onClick={() => removeItem(item.product.id)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-500 font-medium"><Trash2 size={14} /><span className="hidden sm:inline">Remove</span></button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-1"><div className="bg-white rounded-sm shadow-sm p-4 sticky top-20">
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-3 mb-4">Price Details</h2>
        <div className="space-y-3">
          <div className="flex justify-between text-sm"><span className="text-gray-600">Price ({items.length} items)</span><span>{formatPrice(totalPrice + totalSavings)}</span></div>
          {totalSavings > 0 && <div className="flex justify-between text-sm"><span className="text-gray-600">Discount</span><span className="text-green-600 font-medium">- {formatPrice(totalSavings)}</span></div>}
          <div className="flex justify-between text-sm"><span className="text-gray-600">Delivery</span><span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>{deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}</span></div>
          <hr /><div className="flex justify-between text-base font-bold"><span>Total</span><span>{formatPrice(finalAmount)}</span></div>
          {totalSavings > 0 && <div className="bg-green-50 border border-green-200 rounded p-3 flex items-center gap-2"><Tag size={16} className="text-green-600" /><span className="text-sm text-green-700 font-medium">You save {formatPrice(totalSavings)}</span></div>}
        </div>
        <Link href="/checkout"><Button size="lg" className="w-full mt-6">PLACE ORDER</Button></Link>
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 justify-center"><Shield size={14} /><span>Safe and Secure Payments.</span></div>
      </div></div>
    </div></div>
  );
}
