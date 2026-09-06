import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  itemIds: number[];
  toggleWishlist: (productId: number) => void;
  removeFromWishlist: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      itemIds: [],

      toggleWishlist: (productId: number) => {
        set((state) => {
          const exists = state.itemIds.includes(productId);
          return {
            itemIds: exists
              ? state.itemIds.filter((id) => id !== productId)
              : [...state.itemIds, productId],
          };
        });
      },

      removeFromWishlist: (productId: number) => {
        set((state) => ({
          itemIds: state.itemIds.filter((id) => id !== productId),
        }));
      },

      isInWishlist: (productId: number) => {
        return get().itemIds.includes(productId);
      },

      clearWishlist: () => set({ itemIds: [] }),
    }),
    {
      name: "cococraft-wishlist-storage",
    }
  )
);
