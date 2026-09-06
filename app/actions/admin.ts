"use server";

import { updateOrderStatus as updateOrderInStore, getOrders, type StoredOrder } from "@/lib/data/orders-store";
import { getProducts, getCategories } from "@/lib/data/store";
import type { Product, Category } from "@/types/database";
import { revalidatePath } from "next/cache";

export async function changeOrderStatusAction(
  orderId: string,
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled"
) {
  const ok = await updateOrderInStore(orderId, status);
  revalidatePath("/admin/orders");
  revalidatePath("/admin");
  revalidatePath("/account/orders");
  return { success: ok };
}

export async function fetchAllOrdersAction(): Promise<StoredOrder[]> {
  return await getOrders();
}

export async function fetchAdminProductsAction(): Promise<Product[]> {
  return await getProducts();
}

export async function fetchAdminCategoriesAction(): Promise<Category[]> {
  return await getCategories();
}

