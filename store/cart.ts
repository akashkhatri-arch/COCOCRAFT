import { create } from "zustand";
import { persist } from "zustand/middleware";

// Structured customization payload type — extended in Phase 5 (Customizer)
export type CustomizationJson = Record<string, string | number | boolean | string[] | null | Record<string, string | null>>;

export interface AppliedCoupon {
  code: string;
  type: "percentage" | "fixed";
  value: number;
  discount: number;
}

export interface CartItem {
  id: string; // Composite key: product-id_variant-id_customization-hash
  productId: number;
  productSlug?: string;
  variantId?: number | null;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
  customization?: CustomizationJson | null; // For BYO custom bars
}

interface CartState {
  items: CartItem[];
  isDrawerOpen: boolean;
  appliedCoupon: AppliedCoupon | null;
  
  // Item actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  
  // Drawer actions
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  
  // Coupon actions
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
  
  // Selectors
  getCartCount: () => number;
  getCartSubtotal: () => number;
}

// Generate unique id for cart items to group identical configurations together
export function generateCartItemId(
  productId: number,
  variantId?: number | null,
  customization?: CustomizationJson | null
): string {
  const parts: (string | number)[] = [productId, variantId || "base"];
  if (customization) {
    // Normalization to ensure identical configurations produce identical hashes
    // Ignore `quantity` because item quantity in cart does not define recipe identity
    const normalized: Record<string, unknown> = {};
    const keys = Object.keys(customization)
      .filter((k) => k !== "quantity")
      .sort();

    for (const key of keys) {
      const val = customization[key];
      if (Array.isArray(val)) {
        normalized[key] = [...val].sort();
      } else if (val && typeof val === "object") {
        // e.g. personalization: { name, message }
        const inner: Record<string, unknown> = {};
        const innerKeys = Object.keys(val as Record<string, unknown>).sort();
        for (const ik of innerKeys) {
          const iv = (val as Record<string, unknown>)[ik];
          inner[ik] = typeof iv === "string" ? iv.trim() : iv;
        }
        normalized[key] = inner;
      } else if (typeof val === "string") {
        normalized[key] = val.trim();
      } else {
        normalized[key] = val;
      }
    }
    parts.push(JSON.stringify(normalized));
  }
  return parts.join("_");
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isDrawerOpen: false,
      appliedCoupon: null,

      addItem: (newItem) => {
        const id = generateCartItemId(
          newItem.productId,
          newItem.variantId,
          newItem.customization
        );

        set((state) => {
          const existingIndex = state.items.findIndex((item) => item.id === id);

          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex].quantity += newItem.quantity;
            return { items: updatedItems };
          }

          return { items: [...state.items, { ...newItem, id }] };
        });
      },

      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      updateQuantity: (id, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
          ),
        }));
      },

      clearCart: () => set({ items: [], appliedCoupon: null }),

      openDrawer: () => set({ isDrawerOpen: true }),
      closeDrawer: () => set({ isDrawerOpen: false }),
      toggleDrawer: () => set((state) => ({ isDrawerOpen: !state.isDrawerOpen })),

      applyCoupon: (coupon) => set({ appliedCoupon: coupon }),
      removeCoupon: () => set({ appliedCoupon: null }),

      getCartCount: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      },

      getCartSubtotal: () => {
        return get().items.reduce((acc, item) => acc + item.price * item.quantity, 0);
      },
    }),
    {
      name: "cococraft-cart-storage",
      // Persist only items and appliedCoupon, not ephemeral drawer state
      partialize: (state) => ({
        items: state.items,
        appliedCoupon: state.appliedCoupon,
      }),
    }
  )
);
