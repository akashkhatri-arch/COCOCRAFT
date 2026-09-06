"use server";

import { revalidatePath } from "next/cache";

export interface ReviewData {
  id: string;
  productId: number;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
  createdAt: string;
  status: "approved" | "pending";
}

// In-memory reviews store for immediate feedback
const mockProductReviews: ReviewData[] = [
  {
    id: "rev-dyo-1",
    productId: 2,
    customerName: "Aarav Mehta",
    rating: 5,
    title: "Unmatched Couverture Freshness!",
    comment: "The 70% dark chocolate with roasted almonds and sea salt flakes arrived perfectly cool and tempered. Best bespoke chocolate in India.",
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    status: "approved",
  },
  {
    id: "rev-dyo-2",
    productId: 2,
    customerName: "Pooja Reddy",
    rating: 5,
    title: "The wooden gift packaging is magnificent",
    comment: "Ordered as an anniversary gift. The custom engraved name was beautifully rendered. My partner was delighted.",
    createdAt: new Date(Date.now() - 432000000).toISOString(),
    status: "approved",
  },
  {
    id: "rev-bonbon-1",
    productId: 3,
    customerName: "Simran Kapoor",
    rating: 5,
    title: "Silky ganache centers",
    comment: "Each bonbon had a distinct, exquisite flavor profile. The passionfruit and salted caramel were standout favorites.",
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    status: "approved",
  },
];

export async function getProductReviews(productId: number): Promise<ReviewData[]> {
  return mockProductReviews.filter(
    (r) => r.productId === productId && r.status === "approved"
  );
}

export async function submitReviewAction(payload: {
  productId: number;
  customerName: string;
  rating: number;
  title: string;
  comment: string;
}): Promise<{ success: boolean; error?: string; message?: string }> {
  if (!payload.customerName.trim()) {
    return { success: false, error: "Please enter your name" };
  }
  if (!payload.title.trim()) {
    return { success: false, error: "Please add a headline for your review" };
  }
  if (!payload.comment.trim() || payload.comment.trim().length < 10) {
    return { success: false, error: "Review comment must be at least 10 characters" };
  }

  const newReview: ReviewData = {
    id: `rev-${Date.now()}`,
    productId: payload.productId,
    customerName: payload.customerName.trim(),
    rating: Math.max(1, Math.min(5, payload.rating)),
    title: payload.title.trim(),
    comment: payload.comment.trim(),
    createdAt: new Date().toISOString(),
    status: "approved",
  };

  mockProductReviews.unshift(newReview);
  revalidatePath(`/products`);
  return {
    success: true,
    message: "Thank you! Your artisanal review has been published.",
  };
}
