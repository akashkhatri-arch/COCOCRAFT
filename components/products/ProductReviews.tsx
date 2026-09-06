"use client";

import React, { useState, useEffect } from "react";
import { Star, CheckCircle2, MessageSquarePlus } from "lucide-react";
import { getProductReviews, submitReviewAction, type ReviewData } from "@/app/actions/reviews";

interface ProductReviewsProps {
  productId: number;
  productName: string;
}

export const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productName }) => {
  const [reviews, setReviews] = useState<ReviewData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(5);
  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    getProductReviews(productId).then(setReviews);
  }, [productId]);

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    setSuccessMsg(null);

    const res = await submitReviewAction({
      productId,
      customerName: name,
      rating,
      title,
      comment,
    });

    setLoading(false);
    if (!res.success) {
      setErrorMsg(res.error || "Failed to submit review.");
      return;
    }

    setSuccessMsg(res.message || "Review submitted!");
    setShowForm(false);
    setName("");
    setTitle("");
    setComment("");
    const refreshed = await getProductReviews(productId);
    setReviews(refreshed);
  };

  return (
    <section className="py-12 border-t border-cream-200 space-y-8" aria-labelledby="reviews-heading">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 id="reviews-heading" className="font-serif text-2xl sm:text-3xl font-bold text-choco-950">
            Connoisseur Reviews
          </h2>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-gold-500">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.round(Number(avgRating)) ? "fill-current" : "text-cream-300"
                  }`}
                />
              ))}
            </div>
            <span className="font-montserrat font-bold text-sm text-choco-900">
              {avgRating} out of 5
            </span>
            <span className="text-xs text-choco-500 font-sans">
              ({reviews.length} {reviews.length === 1 ? "review" : "reviews"})
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-choco-900 text-choco-900 hover:bg-cream-100 text-xs font-montserrat font-bold transition-colors cursor-pointer self-start sm:self-auto"
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span>{showForm ? "Cancel Review" : "Write a Review"}</span>
        </button>
      </div>

      {/* Review Form */}
      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="p-6 bg-cream-50 rounded-3xl border border-cream-200 space-y-4 max-w-xl animate-in fade-in"
        >
          <h3 className="font-serif text-lg font-bold text-choco-950">
            Reviewing {productName}
          </h3>

          {errorMsg && (
            <p className="text-xs text-red-600 font-sans">{errorMsg}</p>
          )}

          <div>
            <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
              Your Rating
            </label>
            <div className="flex gap-1.5 text-gold-500 cursor-pointer">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="p-1 focus:outline-none"
                  aria-label={`${star} star rating`}
                >
                  <Star
                    className={`h-6 w-6 ${
                      star <= rating ? "fill-current text-gold-500" : "text-cream-300"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
              Your Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Priya Iyer"
              className="w-full px-3.5 py-2 rounded-xl border border-cream-300 bg-white text-xs font-sans text-choco-950"
            />
          </div>

          <div>
            <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
              Headline / Summary *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Exceptional couverture texture and presentation"
              className="w-full px-3.5 py-2 rounded-xl border border-cream-300 bg-white text-xs font-sans text-choco-950"
            />
          </div>

          <div>
            <label className="block text-xs font-montserrat font-bold text-choco-900 mb-1">
              Detailed Experience *
            </label>
            <textarea
              required
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share details about the flavor profile, packaging freshness, or occasion..."
              className="w-full px-3.5 py-2 rounded-xl border border-cream-300 bg-white text-xs font-sans text-choco-950"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-2.5 px-6 rounded-full bg-choco-900 text-cream-50 hover:bg-choco-800 text-xs font-montserrat font-bold cursor-pointer transition-colors"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      )}

      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-sans flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-xs text-choco-500 font-sans italic py-4">
            Be the first to review this artisanal chocolate creation!
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((r) => (
              <div
                key={r.id}
                className="p-5 rounded-2xl bg-white border border-cream-200 shadow-2xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex text-gold-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3.5 w-3.5 ${
                          i < r.rating ? "fill-current" : "text-cream-200"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-[11px] text-choco-400 font-sans">
                    {new Date(r.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <h4 className="font-montserrat font-bold text-xs text-choco-950">
                  {r.title}
                </h4>
                <p className="text-xs text-choco-700 font-sans leading-relaxed">
                  &ldquo;{r.comment}&rdquo;
                </p>
                <span className="text-[11px] text-choco-500 font-sans block pt-1">
                  — {r.customerName}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
