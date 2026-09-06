"use client";

import { ChevronLeft, ChevronRight, ShoppingBag, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { CustomizerStep } from "@/types/customizer";
import { TOTAL_STEPS } from "@/types/customizer";

interface CustomizerNavigationProps {
  currentStep: CustomizerStep;
  onBack: () => void;
  onNext: () => void;
  onAddToCart: () => void;
  canContinue: boolean;
  isAddingToCart: boolean;
  totalPrice: number;
  quantity: number;
}

const fmt = (n: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(n);

export function CustomizerNavigation({
  currentStep,
  onBack,
  onNext,
  onAddToCart,
  canContinue,
  isAddingToCart,
  totalPrice,
  quantity,
}: CustomizerNavigationProps) {
  const isFirst = currentStep === 1;
  const isLast = currentStep === TOTAL_STEPS;

  return (
    <div className="flex items-center justify-between gap-3 pt-6 border-t border-cream-200 mt-6">
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        disabled={isFirst}
        className={cn(
          "flex items-center gap-1.5 px-5 py-3 rounded-full font-montserrat font-bold text-sm tracking-wide transition-all",
          isFirst
            ? "opacity-0 pointer-events-none"
            : "border-2 border-cream-300 text-choco-700 hover:border-choco-300 hover:text-choco-900 hover:bg-cream-50"
        )}
        aria-label="Previous step"
      >
        <ChevronLeft className="h-4 w-4" />
        Back
      </button>

      {/* Next / Add to Cart */}
      {isLast ? (
        <button
          id="customizer-add-to-cart"
          type="button"
          onClick={onAddToCart}
          disabled={isAddingToCart || !canContinue}
          className={cn(
            "flex items-center gap-2 px-7 py-3 rounded-full font-montserrat font-bold text-sm tracking-wide transition-all shadow-md",
            "bg-choco-900 text-cream-50 hover:bg-choco-800 active:scale-[0.98]",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          )}
        >
          {isAddingToCart ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Adding…
            </>
          ) : (
            <>
              <ShoppingBag className="h-4 w-4" />
              Add to Cart — {fmt(totalPrice * quantity)}
            </>
          )}
        </button>
      ) : (
        <button
          type="button"
          onClick={onNext}
          disabled={!canContinue}
          className={cn(
            "flex items-center gap-1.5 px-7 py-3 rounded-full font-montserrat font-bold text-sm tracking-wide transition-all",
            "bg-choco-900 text-cream-50 hover:bg-choco-800 active:scale-[0.98]",
            "disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100"
          )}
          aria-label="Next step"
        >
          Continue
          <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}
