"use client";

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Trash2, Edit3 } from "lucide-react";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Badge } from "@/components/ui/Badge";
import { CustomizationDetails } from "./CustomizationDetails";
import { useCustomizerStore } from "@/store/customizer";
import type { CartItem } from "@/store/cart";
import type { ChocolateCustomization } from "@/types/customizer";

interface CartItemRowProps {
  item: CartItem;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
  compact?: boolean;
}

export const CartItemRow: React.FC<CartItemRowProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
  compact = false,
}) => {
  const router = useRouter();
  const { loadConfig } = useCustomizerStore();

  const isCustomized = Boolean(item.customization);
  const lineTotal = item.price * item.quantity;

  const handleEditCustomization = () => {
    if (!item.customization) return;
    loadConfig(item.customization as unknown as ChocolateCustomization, item.id);
    const slug = item.productSlug || "design-your-own-bar";
    router.push(`/customize?product=${slug}`);
  };

  const fmt = (n: number) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(n);

  if (compact) {
    return (
      <div className="flex gap-3 py-3 border-b border-cream-200/70 last:border-0">
        {/* Thumbnail */}
        <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-cream-100 shrink-0 border border-cream-200">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="64px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-xl select-none">
              🍫
            </div>
          )}
        </div>

        {/* Item Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1">
            <h4 className="font-montserrat font-bold text-xs text-choco-900 truncate">
              {item.name}
            </h4>
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.name} from cart`}
              className="text-choco-400 hover:text-red-600 transition-colors p-1"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>

          {isCustomized && (
            <CustomizationDetails customization={item.customization} compact />
          )}

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                disabled={item.quantity <= 1}
                className="w-5 h-5 rounded flex items-center justify-center bg-cream-100 hover:bg-cream-200 text-choco-700 disabled:opacity-40"
              >
                -
              </button>
              <span className="w-6 text-center font-bold text-xs">{item.quantity}</span>
              <button
                type="button"
                onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                className="w-5 h-5 rounded flex items-center justify-center bg-cream-100 hover:bg-cream-200 text-choco-700"
              >
                +
              </button>
            </div>
            <span className="font-montserrat font-bold text-xs text-choco-900">
              {fmt(lineTotal)}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5 sm:p-6 bg-white rounded-2xl border border-cream-200/90 shadow-2xs hover:border-gold-300/60 transition-all duration-200">
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Product Image */}
        <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-cream-100 shrink-0 border border-cream-200 shadow-inner">
          {item.image ? (
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(max-width: 640px) 96px, 112px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-3xl select-none bg-gradient-to-br from-cream-100 to-cream-200">
              🍫
            </div>
          )}
          {isCustomized && (
            <span className="absolute bottom-1.5 left-1.5 right-1.5 px-1.5 py-0.5 rounded-full bg-choco-900/85 backdrop-blur-xs text-[9px] font-montserrat font-bold uppercase tracking-wider text-gold-400 text-center">
              Bespoke
            </span>
          )}
        </div>

        {/* Product Details */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 mb-1 flex-wrap">
                <h3 className="font-serif text-lg sm:text-xl text-choco-900 font-bold leading-tight">
                  {item.name}
                </h3>
                {isCustomized && (
                  <Badge variant="gold" className="text-[10px]">
                    Custom Creation
                  </Badge>
                )}
              </div>
              <p className="text-xs font-montserrat text-choco-500">
                {fmt(item.price)} each
              </p>
            </div>

            {/* Remove button (Desktop / Top Right) */}
            <button
              type="button"
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.name} from cart`}
              className="inline-flex items-center gap-1.5 text-xs font-montserrat font-medium text-choco-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden sm:inline">Remove</span>
            </button>
          </div>

          {/* Customization Details Breakdown */}
          {isCustomized && (
            <CustomizationDetails customization={item.customization} />
          )}

          {/* Controls Bar: Edit, Quantity, Line Total */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4 pt-3 border-t border-cream-100">
            <div className="flex items-center gap-3">
              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-montserrat text-choco-600 hidden xs:inline">
                  Qty:
                </span>
                <QuantitySelector
                  value={item.quantity}
                  onChange={(qty) => onUpdateQuantity(item.id, qty)}
                  min={1}
                  max={99}
                  className="h-9"
                />
              </div>

              {/* Edit Customization Button */}
              {isCustomized && (
                <button
                  type="button"
                  onClick={handleEditCustomization}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-cream-300 hover:border-gold-500 bg-white hover:bg-gold-50/50 text-choco-700 hover:text-choco-950 text-xs font-montserrat font-bold tracking-wide transition-all shadow-2xs cursor-pointer"
                >
                  <Edit3 className="h-3.5 w-3.5 text-gold-600" />
                  <span>Edit Recipe</span>
                </button>
              )}
            </div>

            {/* Line item total */}
            <div className="text-right">
              <span className="text-xs text-choco-500 font-sans block">Total</span>
              <span className="font-serif text-xl sm:text-2xl font-bold text-choco-950">
                {fmt(lineTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
