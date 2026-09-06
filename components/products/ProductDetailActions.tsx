"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { ShoppingBag, CreditCard, Sparkles } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { QuantitySelector } from "@/components/ui/QuantitySelector";
import { Button } from "@/components/ui/Button";
import type { Product, ProductVariant } from "@/types/database";

interface ProductDetailActionsProps {
  product: Product;
  variants: ProductVariant[];
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const ProductDetailActions: React.FC<ProductDetailActionsProps> = ({
  product,
  variants,
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    variants.length > 0 ? variants[0] : null
  );
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const priceModifier = selectedVariant ? Number(selectedVariant.price_modifier) : 0;
  const unitPrice = Number(product.base_price) + priceModifier;

  const handleAddToCart = () => {
    setLoading(true);
    setTimeout(() => {
      addItem({
        productId: product.id,
        variantId: selectedVariant?.id || null,
        name: product.name + (selectedVariant ? ` (${selectedVariant.name})` : ""),
        price: unitPrice,
        image: product.main_image || null,
        quantity,
        customization: null, // Custom configurations added in customizer phase
      });
      toast.success(`${product.name} added to cart!`);
      setLoading(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Variants Selection */}
      {variants.length > 0 && (
        <div className="space-y-2.5">
          <span className="text-xs font-montserrat font-bold uppercase tracking-wider text-choco-700 select-none">
            Select Size / Option
          </span>
          <div className="flex flex-col gap-2">
            {variants.map((v) => {
              const isSelected = selectedVariant?.id === v.id;
              const modifier = Number(v.price_modifier);
              return (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl border text-sm font-sans tracking-wide text-left cursor-pointer transition-all ${
                    isSelected
                      ? "border-choco-900 bg-cream-100/30 text-choco-950 font-medium ring-1 ring-choco-900"
                      : "border-cream-200 bg-white text-choco-700 hover:bg-cream-50"
                  }`}
                >
                  <span>{v.name}</span>
                  <span className="font-montserrat font-bold text-choco-950">
                    {formatPrice(Number(product.base_price) + modifier)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Pricing Display */}
      <div className="border-y border-cream-200/50 py-4 flex items-baseline gap-3">
        <span className="font-montserrat font-bold text-2xl text-choco-950">
          {formatPrice(unitPrice)}
        </span>
        {product.compare_at_price && !selectedVariant && (
          <span className="font-sans text-sm text-choco-400 line-through">
            {formatPrice(Number(product.compare_at_price))}
          </span>
        )}
      </div>

      {/* Quantity & Actions Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="flex flex-col gap-2 w-full sm:w-auto flex-shrink-0">
          <span className="text-[10px] font-montserrat font-bold uppercase tracking-wider text-choco-500">
            Quantity
          </span>
          <QuantitySelector value={quantity} onChange={setQuantity} disabled={loading} className="w-full sm:w-auto" />
        </div>

        <div className="flex-1 w-full flex flex-col gap-2.5 sm:pt-6">
          {product.is_customizable ? (
            <Link
              href={`/customize?product=${product.slug}`}
              className="w-full flex items-center justify-center gap-2 h-11 px-6 bg-choco-900 text-cream-50 hover:bg-choco-800 rounded-full font-montserrat font-bold text-sm tracking-wide shadow-sm transition-colors"
            >
              <Sparkles className="h-4 w-4 text-gold-300" />
              Customize This Chocolate
            </Link>
          ) : (
            <div className="flex gap-3">
              <Button
                variant="primary"
                onClick={handleAddToCart}
                isLoading={loading}
                className="flex-1 flex items-center justify-center gap-2 h-11"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart
              </Button>
              <button
                disabled={loading}
                onClick={() => {
                  handleAddToCart();
                  // In future phase, redirects to checkout
                  toast("Proceeding to checkout (simulated)...");
                }}
                className="flex-1 h-11 flex items-center justify-center gap-2 border-2 border-choco-900 text-choco-900 hover:bg-cream-100 rounded-full font-montserrat font-bold text-sm tracking-wide transition-colors cursor-pointer disabled:opacity-50"
              >
                <CreditCard className="h-4 w-4" />
                Buy Now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
