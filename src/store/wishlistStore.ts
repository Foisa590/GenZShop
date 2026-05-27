import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/types";
import toast from "react-hot-toast";

interface WishlistState {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product: Product) => {
        if (get().items.find((item) => item.id === product.id)) { toast("Already in wishlist", { icon: "💛" }); return; }
        set({ items: [...get().items, product] });
        toast.success("Added to wishlist!");
      },
      removeItem: (productId: string) => {
        set({ items: get().items.filter((item) => item.id !== productId) });
        toast.success("Removed from wishlist");
      },
      isInWishlist: (productId: string) => get().items.some((item) => item.id === productId),
      clearWishlist: () => set({ items: [] }),
    }),
    { name: "genzshop-wishlist" }
  )
);
