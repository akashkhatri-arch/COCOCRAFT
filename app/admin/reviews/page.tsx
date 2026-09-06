"use client";

import React, { useState } from "react";
import { Star, Check, X, Trash2, Eye } from "lucide-react";

interface ReviewItem {
  id: string;
  customerName: string;
  productName: string;
  rating: number;
  title: string;
  comment: string;
  date: string;
  status: "approved" | "pending" | "hidden";
}

const INITIAL_REVIEWS: ReviewItem[] = [
  {
    id: "rev-1",
    customerName: "Aarav Mehta",
    productName: "Design-Your-Own Bar",
    rating: 5,
    title: "Unmatched Couverture Freshness!",
    comment: "The 70% dark chocolate with roasted almonds and sea salt flakes arrived perfectly cool and tempered. Best bespoke chocolate in India.",
    date: "2 days ago",
    status: "approved",
  },
  {
    id: "rev-2",
    customerName: "Pooja Reddy",
    productName: "Artisanal Bonbon Collection",
    rating: 5,
    title: "The wooden gift packaging is magnificent",
    comment: "Ordered as an anniversary gift. The custom engraved name was beautifully rendered. My partner was delighted.",
    date: "5 days ago",
    status: "approved",
  },
  {
    id: "rev-3",
    customerName: "Vikram Sen",
    productName: "Single Origin Madagascar Bar",
    rating: 4,
    title: "Very rich flavor notes",
    comment: "Subtle red fruit notes and smooth melt. Will definitely reorder with pistachios next time.",
    date: "1 week ago",
    status: "pending",
  },
];

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<ReviewItem[]>(INITIAL_REVIEWS);

  const handleUpdateStatus = (id: string, newStatus: ReviewItem["status"]) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  const handleDelete = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-choco-950">
          Customer Review Moderation
        </h1>
        <p className="text-xs sm:text-sm text-choco-500 font-sans mt-0.5">
          Approve, hide, or moderate customer ratings and testimonials before public display.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-cream-200 p-6 sm:p-8 shadow-sm space-y-4">
        <div className="divide-y divide-cream-100">
          {reviews.map((rev) => (
            <div key={rev.id} className="py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="flex text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < rev.rating ? "fill-current" : "text-cream-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-montserrat font-bold text-choco-950 text-xs">
                    {rev.title}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-montserrat font-bold uppercase tracking-wider ${
                      rev.status === "approved"
                        ? "bg-emerald-100 text-emerald-800"
                        : rev.status === "pending"
                        ? "bg-amber-100 text-amber-800"
                        : "bg-choco-100 text-choco-600"
                    }`}
                  >
                    {rev.status}
                  </span>
                </div>

                <p className="text-xs text-choco-700 font-sans leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>

                <div className="text-[11px] text-choco-500 font-sans">
                  By <strong className="text-choco-900">{rev.customerName}</strong> on{" "}
                  <em>{rev.productName}</em> · {rev.date}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {rev.status !== "approved" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(rev.id, "approved")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-800 text-xs font-montserrat font-bold transition-colors cursor-pointer"
                  >
                    <Check className="h-3.5 w-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                {rev.status !== "hidden" && (
                  <button
                    type="button"
                    onClick={() => handleUpdateStatus(rev.id, "hidden")}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-cream-100 hover:bg-cream-200 text-choco-700 text-xs font-montserrat font-bold transition-colors cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Hide</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDelete(rev.id)}
                  aria-label="Delete review"
                  className="p-1.5 rounded-full text-choco-400 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
