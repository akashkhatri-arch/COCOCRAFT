"use client";

import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils/cn";

interface ImageItem {
  id: number;
  image_url: string | null;
  alt_text: string | null;
}

interface ProductImageGalleryProps {
  images: ImageItem[];
  defaultImageAlt: string;
}

export const ProductImageGallery: React.FC<ProductImageGalleryProps> = ({
  images,
  defaultImageAlt,
}) => {
  const galleryImages =
    images.length > 0 && images[0].image_url
      ? images
      : [{ id: 0, image_url: null, alt_text: defaultImageAlt }];

  const [activeImage, setActiveImage] = useState<ImageItem>(galleryImages[0]);

  return (
    <div className="space-y-4">
      {/* Primary Display */}
      <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-cream-100 border border-cream-200">
        {activeImage.image_url ? (
          <Image
            src={activeImage.image_url}
            alt={activeImage.alt_text || defaultImageAlt}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 500px"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-8xl text-choco-300/60 select-none" role="img" aria-label="Chocolate bar placeholder">
              🍫
            </span>
          </div>
        )}
      </div>

      {/* Thumbnails Row */}
      {galleryImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {galleryImages.map((img) => {
            const isActive = activeImage.id === img.id;
            return (
              <button
                key={img.id}
                onClick={() => setActiveImage(img)}
                className={cn(
                  "relative aspect-square w-20 rounded-xl overflow-hidden bg-cream-50 border transition-all cursor-pointer flex-shrink-0",
                  isActive
                    ? "border-choco-900 ring-1 ring-choco-900"
                    : "border-cream-200 hover:border-choco-400"
                )}
                aria-label={`View image ${img.id + 1}`}
              >
                {img.image_url ? (
                  <Image
                    src={img.image_url}
                    alt={img.alt_text || "Thumbnail"}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                ) : (
                  <span className="text-xl">🍫</span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
