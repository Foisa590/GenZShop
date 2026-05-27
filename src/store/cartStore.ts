import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product, CartItem } from "@/types";
import toast from "react-hot-toast";

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getTotalSavings: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product: Product, quantity = 1) => {
        const items = get().items;
        const existingItem = items.find((item) => item.product.id === product.id);
        if (existingItem) {
          set({ items: items.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item) });
          toast.success("Quantity updated in cart");
        } else {
          set({ items: [...items, { id: crypto.randomUUID(), product, quantity }] });
          toast.success("Added to cart!");
        }
      },
      removeItem: (productId: string) => {
        set({ items: get().items.filter((item) => item.product.id !== productId) });
        toast.success("Removed from cart");
      },
      updateQuantity: (productId: string, quantity: number) => {
        if (quantity <= 0) { get().removeItem(productId); return; }
        set({ items: get().items.map((item) => item.product.id === productId ? { ...item, quantity } : item) });
      },
      clearCart: () => set({ items: [] }),
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => total + item.product.price * item.quantity, 0),
      getTotalSavings: () => get().items.reduce((total, item) => total + (item.product.original_price - item.product.price) * item.quantity, 0),
    }),
    { name: "genzshop-cart" }
  )
);
