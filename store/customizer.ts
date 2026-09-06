import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ChocolateCustomization,
  CustomizerStep,
} from "@/types/customizer";

export const DEFAULT_CUSTOMIZATION: ChocolateCustomization = {
  productId: 0,
  variantId: null,
  chocolateTypeId: 0,
  toppingIds: [],
  personalization: { name: "", message: "" },
  addonIds: [],
  giftMessage: "",
  quantity: 1,
};

interface CustomizerState {
  /** Current step (1–6) */
  step: CustomizerStep;
  /** The customization being built */
  config: ChocolateCustomization;
  /** True after user has meaningfully started configuring */
  isDirty: boolean;
  /** ID of the cart item being edited, if any */
  editingCartItemId: string | null;

  // ── Setters ──────────────────────────────────────────────────────────────
  setStep: (step: CustomizerStep) => void;
  setProductId: (id: number) => void;
  setVariantId: (id: number | null) => void;
  setChocolateTypeId: (id: number) => void;
  toggleTopping: (id: number, maxToppings: number) => void;
  setPersonalization: (personalization: ChocolateCustomization["personalization"]) => void;
  toggleAddon: (id: number) => void;
  setGiftMessage: (msg: string) => void;
  setQuantity: (qty: number) => void;
  setEditingCartItemId: (id: string | null) => void;
  /** Load an existing config (e.g. editing from cart) */
  loadConfig: (config: ChocolateCustomization, editingCartItemId?: string | null) => void;
  /** Reset everything back to defaults */
  reset: () => void;
}

export const useCustomizerStore = create<CustomizerState>()(
  persist(
    (set) => ({
      step: 1,
      config: { ...DEFAULT_CUSTOMIZATION },
      isDirty: false,
      editingCartItemId: null,

      setStep: (step) => set({ step }),

      setProductId: (id) =>
        set((s) => ({
          config: { ...s.config, productId: id },
          isDirty: true,
        })),

      setVariantId: (id) =>
        set((s) => ({
          config: { ...s.config, variantId: id },
          isDirty: true,
        })),

      setChocolateTypeId: (id) =>
        set((s) => ({
          config: { ...s.config, chocolateTypeId: id },
          isDirty: true,
        })),

      toggleTopping: (id, maxToppings) =>
        set((s) => {
          const current = s.config.toppingIds;
          if (current.includes(id)) {
            return {
              config: { ...s.config, toppingIds: current.filter((t) => t !== id) },
              isDirty: true,
            };
          }
          if (current.length >= maxToppings) return {}; // silently prevent — UI also blocks
          return {
            config: { ...s.config, toppingIds: [...current, id] },
            isDirty: true,
          };
        }),

      setPersonalization: (personalization) =>
        set((s) => ({
          config: { ...s.config, personalization },
          isDirty: true,
        })),

      toggleAddon: (id) =>
        set((s) => {
          const current = s.config.addonIds;
          return {
            config: {
              ...s.config,
              addonIds: current.includes(id)
                ? current.filter((a) => a !== id)
                : [...current, id],
            },
            isDirty: true,
          };
        }),

      setGiftMessage: (giftMessage) =>
        set((s) => ({
          config: { ...s.config, giftMessage },
          isDirty: true,
        })),

      setQuantity: (qty) =>
        set((s) => ({
          config: { ...s.config, quantity: Math.max(1, Math.min(qty, 20)) },
          isDirty: true,
        })),

      setEditingCartItemId: (id) => set({ editingCartItemId: id }),

      loadConfig: (config, editingCartItemId = null) =>
        set({
          config: {
            ...DEFAULT_CUSTOMIZATION,
            ...config,
          },
          isDirty: true,
          step: 1,
          editingCartItemId,
        }),

      reset: () =>
        set({
          step: 1,
          config: { ...DEFAULT_CUSTOMIZATION },
          isDirty: false,
          editingCartItemId: null,
        }),
    }),
    {
      name: "cococraft-customizer-draft",
      // Only persist the config + step, not setters
      partialize: (state) => ({
        step: state.step,
        config: state.config,
        isDirty: state.isDirty,
        editingCartItemId: state.editingCartItemId,
      }),
    }
  )
);
