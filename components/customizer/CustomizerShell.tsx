"use client";

/**
 * CustomizerShell — main client component for the 6-step chocolate builder.
 *
 * Layout:
 *  Desktop: Left column (steps) | Right column (sticky preview + price summary)
 *  Mobile:  Top (preview) | Below (step controls) | Sticky bottom (price + CTA)
 */

import { useEffect, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/Toast";

import { useCustomizerStore } from "@/store/customizer";
import { useCartStore } from "@/store/cart";
import { siteConfig } from "@/config/site";
import { validateAndPriceCustomization } from "@/app/actions/validateCustomization";

import { CustomizerProgress } from "./CustomizerProgress";
import { CustomizerNavigation } from "./CustomizerNavigation";
import { CustomizerPriceSummary } from "./CustomizerPriceSummary";
import { ChocolatePreview } from "./ChocolatePreview";
import { StepChocolateType } from "./StepChocolateType";
import { StepVariant } from "./StepVariant";
import { StepToppings } from "./StepToppings";
import { StepPersonalization } from "./StepPersonalization";
import { StepAddons } from "./StepAddons";
import { StepReview } from "./StepReview";

import type { Product, ProductVariant, ChocolateType, Topping, Addon } from "@/types/database";
import type { CustomizerStep } from "@/types/customizer";

interface CustomizerShellProps {
  product: Product;
  variants: ProductVariant[];
  chocolateTypes: ChocolateType[];
  toppings: Topping[];
  addons: Addon[];
  productSlug: string;
}

// Which steps are "required" to advance past — maps step → boolean check
function canAdvance(
  step: CustomizerStep,
  chocolateTypeId: number,
  variantId: number | null,
  variants: ProductVariant[]
): boolean {
  switch (step) {
    case 1:
      return chocolateTypeId > 0;
    case 2:
      return variants.length === 0 || variantId !== null;
    case 3:
    case 4:
    case 5:
      return true; // Optional steps
    case 6:
      return true;
    default:
      return false;
  }
}

export function CustomizerShell({
  product,
  variants,
  chocolateTypes,
  toppings,
  addons,
  productSlug,
}: CustomizerShellProps) {
  const router = useRouter();
  const {
    step,
    config,
    setStep,
    setProductId,
    setVariantId,
    setChocolateTypeId,
    toggleTopping,
    setPersonalization,
    toggleAddon,
    setGiftMessage,
    setQuantity,
    reset,
    editingCartItemId,
    setEditingCartItemId,
  } = useCustomizerStore();

  const { addItem, removeItem } = useCartStore();

  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<CustomizerStep>>(new Set());

  // On mount: set product & auto-select first variant if only one exists
  useEffect(() => {
    if (config.productId !== product.id && !editingCartItemId) {
      reset();
      setProductId(product.id);
    }
    // Auto-select first variant if exactly one exists
    if (variants.length === 1 && config.variantId === null) {
      setVariantId(variants[0].id);
    }
    // Auto-select first chocolate type if only one
    if (chocolateTypes.length === 1 && config.chocolateTypeId === 0) {
      setChocolateTypeId(chocolateTypes[0].id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Derived data ────────────────────────────────────────────────────────────
  const selectedChocolateType = useMemo(
    () => chocolateTypes.find((ct) => ct.id === config.chocolateTypeId) ?? null,
    [chocolateTypes, config.chocolateTypeId]
  );

  const selectedVariant = useMemo(
    () => variants.find((v) => v.id === config.variantId) ?? null,
    [variants, config.variantId]
  );

  const selectedToppings = useMemo(
    () => toppings.filter((t) => config.toppingIds.includes(t.id)),
    [toppings, config.toppingIds]
  );

  const selectedAddons = useMemo(
    () => addons.filter((a) => config.addonIds.includes(a.id)),
    [addons, config.addonIds]
  );

  // Find greeting card addon ID
  const greetingCardAddonId = useMemo(
    () => addons.find((a) => a.slug.includes("card") || a.slug.includes("greeting"))?.id,
    [addons]
  );

  const hasGiftBox = useMemo(
    () => addons.some((a) => (a.slug.includes("gift") || a.slug.includes("box")) && config.addonIds.includes(a.id)),
    [addons, config.addonIds]
  );

  // ── Live price breakdown (browser-side, display only) ───────────────────────
  const breakdown = useMemo(() => {
    const basePrice = product.base_price;
    const variantMod = selectedVariant?.price_modifier ?? 0;
    const chocolateMod = selectedChocolateType?.price_modifier ?? 0;
    const toppingsTotal = selectedToppings.reduce((acc, t) => acc + t.price, 0);
    const addonsTotal = selectedAddons.reduce((acc, a) => acc + a.price, 0);
    const itemSubtotal = basePrice + variantMod + chocolateMod + toppingsTotal + addonsTotal;
    const subtotal = itemSubtotal * config.quantity;
    return {
      basePrice,
      variantMod,
      chocolateMod,
      toppingsTotal,
      addonsTotal,
      itemSubtotal,
      quantity: config.quantity,
      subtotal,
    };
  }, [product, selectedVariant, selectedChocolateType, selectedToppings, selectedAddons, config.quantity]);

  // ── Step navigation ─────────────────────────────────────────────────────────
  const canGo = canAdvance(step, config.chocolateTypeId, config.variantId, variants);

  const goNext = useCallback(() => {
    if (!canGo) return;
    setCompletedSteps((s) => new Set(s).add(step));
    setStep(Math.min(step + 1, 6) as CustomizerStep);
    setValidationError(null);
  }, [canGo, step, setStep]);

  const goBack = useCallback(() => {
    if (step <= 1) return;
    setStep((step - 1) as CustomizerStep);
    setValidationError(null);
  }, [step, setStep]);

  // ── Add to cart (server-authoritative) ──────────────────────────────────────
  const handleAddToCart = useCallback(async () => {
    setIsAddingToCart(true);
    setValidationError(null);

    try {
      const result = await validateAndPriceCustomization({
        ...config,
        productSlug,
      });

      if (!result.success || result.itemSubtotal === undefined || !result.customization) {
        setValidationError(result.error ?? "Validation failed. Please review your selections.");
        setIsAddingToCart(false);
        return;
      }

      // If editing an existing item from the cart, remove the previous version
      if (editingCartItemId) {
        removeItem(editingCartItemId);
        setEditingCartItemId(null);
      }

      // Use server-authoritative price
      addItem({
        productId: product.id,
        productSlug,
        variantId: config.variantId,
        name: `${product.name}${result.configLabel ? ` · ${result.configLabel}` : ""}`,
        price: result.itemSubtotal,
        image: product.main_image,
        quantity: config.quantity,
        customization: result.customization as unknown as Record<string, string | number | boolean | string[] | null>,
      });

      toast.success(editingCartItemId ? "Customization updated!" : "Added to cart!", {
        description: result.configLabel ?? product.name,
        action: {
          label: "View Cart",
          onClick: () => router.push("/cart"),
        },
      });

      // Reset the builder after successful add
      reset();
      router.push("/cart");
    } catch (err) {
      console.error("[CustomizerShell] Add to cart error:", err);
      setValidationError("Something went wrong. Please try again.");
    } finally {
      setIsAddingToCart(false);
    }
  }, [config, productSlug, product, addItem, removeItem, editingCartItemId, setEditingCartItemId, reset, router]);

  // ── Step content ─────────────────────────────────────────────────────────────
  const stepContent = useMemo(() => {
    switch (step) {
      case 1:
        return (
          <StepChocolateType
            chocolateTypes={chocolateTypes}
            selectedId={config.chocolateTypeId}
            onSelect={setChocolateTypeId}
          />
        );
      case 2:
        return (
          <StepVariant
            variants={variants}
            selectedId={config.variantId}
            onSelect={setVariantId}
          />
        );
      case 3:
        return (
          <StepToppings
            toppings={toppings}
            selectedIds={config.toppingIds}
            onToggle={(id) => toggleTopping(id, siteConfig.maxToppings)}
          />
        );
      case 4:
        return (
          <StepPersonalization
            personalization={config.personalization}
            onChange={setPersonalization}
          />
        );
      case 5:
        return (
          <StepAddons
            addons={addons}
            selectedIds={config.addonIds}
            onToggle={toggleAddon}
            giftMessage={config.giftMessage}
            onGiftMessageChange={setGiftMessage}
            greetingCardAddonId={greetingCardAddonId}
          />
        );
      case 6:
        return (
          <StepReview
            config={config}
            product={product}
            variant={selectedVariant}
            chocolateType={selectedChocolateType}
            selectedToppings={selectedToppings}
            selectedAddons={selectedAddons}
            onQuantityChange={setQuantity}
            validationError={validationError}
          />
        );
      default:
        return null;
    }
  }, [
    step, chocolateTypes, config, variants, toppings, addons,
    setChocolateTypeId, setVariantId, toggleTopping, setPersonalization,
    toggleAddon, setGiftMessage, greetingCardAddonId, selectedVariant,
    selectedChocolateType, selectedToppings, selectedAddons, setQuantity, validationError,
    product,
  ]);

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  return (
    <div className="min-h-screen bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* ── Mobile: Compact preview at top ─────────────────────────────────── */}
        <div className="md:hidden mb-6">
          <ChocolatePreview
            config={config}
            chocolateType={selectedChocolateType}
            selectedToppings={selectedToppings}
            selectedVariant={selectedVariant}
            hasGiftBox={hasGiftBox}
            className="max-w-xs mx-auto"
          />
        </div>

        {/* ── Main grid ────────────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_340px] lg:grid-cols-[1fr_380px] gap-8">

          {/* ── LEFT: Controls ──────────────────────────────────────────────── */}
          <div className="min-w-0">
            {/* Progress */}
            <div className="bg-white rounded-2xl border border-cream-200 p-5 mb-6">
              <CustomizerProgress
                currentStep={step}
                completedSteps={completedSteps}
                onStepClick={(s) => {
                  if (completedSteps.has(s)) setStep(s);
                }}
              />
            </div>

            {/* Editing mode alert */}
            {editingCartItemId && (
              <div className="mb-4 p-3.5 bg-amber-50/90 border border-amber-200 rounded-2xl flex items-center justify-between text-xs font-montserrat text-choco-900 shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-gold-500 animate-pulse shrink-0" />
                  <span>
                    <strong>Editing Mode:</strong> Modifying your custom bar recipe.
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    router.push("/cart");
                  }}
                  className="text-choco-700 underline hover:text-choco-950 font-bold ml-3 cursor-pointer shrink-0 transition-colors"
                >
                  Cancel & Return to Cart
                </button>
              </div>
            )}

            {/* Step panel */}
            <div className="bg-white rounded-2xl border border-cream-200 p-6 mb-4">
              <div key={step} className="animate-in fade-in duration-200">
                {stepContent}
              </div>

              <CustomizerNavigation
                currentStep={step}
                onBack={goBack}
                onNext={goNext}
                onAddToCart={handleAddToCart}
                canContinue={canGo}
                isAddingToCart={isAddingToCart}
                totalPrice={breakdown.itemSubtotal}
                quantity={config.quantity}
              />
            </div>
          </div>

          {/* ── RIGHT: Sticky preview + price ───────────────────────────────── */}
          <aside className="hidden md:flex flex-col gap-5 self-start sticky top-28">
            <ChocolatePreview
              config={config}
              chocolateType={selectedChocolateType}
              selectedToppings={selectedToppings}
              selectedVariant={selectedVariant}
              hasGiftBox={hasGiftBox}
            />

            <CustomizerPriceSummary
              breakdown={breakdown}
              chocolateTypeName={selectedChocolateType?.name}
              variantName={selectedVariant?.name}
              toppingCount={selectedToppings.length}
              addonCount={selectedAddons.length}
            />
          </aside>
        </div>

        {/* ── Mobile sticky bottom bar ─────────────────────────────────────────── */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-cream-200 px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
          <div>
            <p className="text-[10px] font-montserrat font-bold uppercase tracking-widest text-choco-400">
              {step < 6 ? `Step ${step} of 6` : "Your total"}
            </p>
            <p className="font-montserrat font-black text-choco-900 text-base">
              {fmt(breakdown.subtotal)}
            </p>
          </div>
          <div className="flex gap-2">
            {step > 1 && (
              <button
                type="button"
                onClick={goBack}
                className="px-4 py-2.5 border-2 border-cream-300 text-choco-700 rounded-full font-montserrat font-bold text-xs tracking-wide hover:border-choco-300 transition-all"
              >
                ← Back
              </button>
            )}
            {step < 6 ? (
              <button
                type="button"
                onClick={goNext}
                disabled={!canGo}
                className="px-5 py-2.5 bg-choco-900 text-cream-50 rounded-full font-montserrat font-bold text-xs tracking-wide hover:bg-choco-800 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Continue →
              </button>
            ) : (
              <button
                id="mobile-add-to-cart"
                type="button"
                onClick={handleAddToCart}
                disabled={isAddingToCart}
                className="px-5 py-2.5 bg-choco-900 text-cream-50 rounded-full font-montserrat font-bold text-xs tracking-wide hover:bg-choco-800 transition-all disabled:opacity-60"
              >
                {isAddingToCart ? "Adding…" : "Add to Cart"}
              </button>
            )}
          </div>
        </div>
        {/* Spacer for mobile sticky bar */}
        <div className="md:hidden h-20" />
      </div>
    </div>
  );
}
