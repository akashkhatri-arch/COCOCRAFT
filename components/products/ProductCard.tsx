"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Eye, Heart } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/ui/Badge";
import { Rating } from "@/components/ui/Rating";
import { useCartStore } from "@/store/cart";
import { useWishlistStore } from "@/store/wishlist";
import { toast } from "@/components/ui/Toast";

export interface ProductCardProduct {
  id: number | string;
  slug: string;
  name: string;
  short_description?: string | null;
  base_price: number;
  compare_at_price?: number | null;
  main_image?: string | null;
  featured?: boolean;
  is_customizable?: boolean;
  customizable?: boolean;
  rating?: number;
  review_count?: number;
}

interface ProductCardProps {
  product: ProductCardProduct;
  onAddToCart?: (product: ProductCardProduct) => void;
  className?: string;
}

function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  className,
}) => {
  const addItem = useCartStore((state) => state.addItem);
  const toggleWishlist = useWishlistStore((state) => state.toggleWishlist);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);
  const numericId = typeof product.id === "number" ? product.id : parseInt(String(product.id), 10) || 1;
  const isWishlisted = isInWishlist(numericId);

  const [imageError, setImageError] = React.useState(false);
  const [isHovered, setIsHovered] = React.useState(false);

  const discount =
    product.compare_at_price && product.compare_at_price > product.base_price
      ? Math.round(
          ((product.compare_at_price - product.base_price) / product.compare_at_price) * 100
        )
      : null;

  return (
    <div
      className={cn(
        "group relative bg-white rounded-2xl overflow-hidden border border-cream-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-cream-50">
        <Link href={`/products/${product.slug}`} aria-label={`View ${product.name}`} tabIndex={0}>
          {product.main_image && !imageError ? (
            <Image
              src={product.main_image}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-cream-100">
              <span className="font-serif text-5xl text-choco-300">🍫</span>
            </div>
          )}
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.featured && <Badge variant="gold">Featured</Badge>}
          {discount && <Badge variant="error">-{discount}%</Badge>}
          {(product.is_customizable || product.customizable) && (
            <Badge variant="default">Customizable</Badge>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(numericId);
            if (isWishlisted) {
              toast.info(`Removed ${product.name} from wishlist`);
            } else {
              toast.success(`Saved ${product.name} to wishlist!`);
            }
          }}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/90 hover:bg-white text-choco-700 hover:text-red-600 flex items-center justify-center shadow-xs transition-colors cursor-pointer"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? "fill-red-500 text-red-500" : "text-choco-600"
            }`}
          />
        </button>

        {/* Quick-view overlay */}
        <motion.div
          className="absolute inset-0 bg-choco-950/30 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden="true"
        >
          <Link
            href={`/products/${product.slug}`}
            className="flex items-center gap-2 px-5 py-2.5 bg-white/90 text-choco-900 rounded-full font-montserrat font-bold text-xs tracking-wide hover:bg-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            <Eye className="h-3.5 w-3.5" />
            Quick View
          </Link>
        </motion.div>
      </div>

      {/* Content */}
      <div className="p-5">
        {product.rating !== undefined && (
          <div className="flex items-center gap-1.5 mb-2">
            <Rating value={product.rating} size="sm" readOnly />
            {product.review_count !== undefined && (
              <span className="text-xs text-choco-400 font-sans">({product.review_count})</span>
            )}
          </div>
        )}

        <h3 className="font-serif text-lg text-choco-950 leading-snug mb-1 line-clamp-1">
          <Link
            href={`/products/${product.slug}`}
            className="hover:text-choco-700 transition-colors focus-visible:outline-none focus-visible:underline"
          >
            {product.name}
          </Link>
        </h3>

        {product.short_description && (
          <p className="text-xs text-choco-500 font-sans leading-relaxed mb-3 line-clamp-2">
            {product.short_description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 mt-3">
          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="font-montserrat font-bold text-lg text-choco-950">
              {formatPrice(product.base_price)}
            </span>
            {product.compare_at_price && (
              <span className="font-sans text-xs text-choco-400 line-through">
                {formatPrice(product.compare_at_price)}
              </span>
            )}
          </div>

          {/* Add to cart */}
          <button
            onClick={() => {
              if (onAddToCart) {
                onAddToCart(product);
              } else {
                addItem({
                  productId: typeof product.id === "number" ? product.id : parseInt(String(product.id), 10) || 1,
                  name: product.name,
                  price: product.base_price,
                  image: product.main_image || null,
                  quantity: 1,
                });
                toast.success(`${product.name} added to cart!`);
              }
            }}
            aria-label={`Add ${product.name} to cart`}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-choco-900 text-cream-50 rounded-full font-montserrat font-bold text-xs tracking-wide hover:bg-choco-800 active:scale-95 transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </button>
        </div>
      </div>
    </div>
  );
};
