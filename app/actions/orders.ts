"use server";

import { getOrders, getOrderByIdOrNumber, type StoredOrder } from "@/lib/data/orders-store";
import { getCurrentUser } from "./auth";

export async function fetchMyOrdersAction(): Promise<StoredOrder[]> {
  const user = await getCurrentUser();
  if (!user) {
    return [];
  }
  return await getOrders({ userId: user.id });
}

export async function fetchAllOrdersAction(): Promise<StoredOrder[]> {
  return await getOrders();
}

export async function fetchOrderByIdAction(orderId: string): Promise<StoredOrder | null> {
  return await getOrderByIdOrNumber(orderId);
}

export async function fetchOrderByIdOrNumberAction(identifier: string): Promise<StoredOrder | null> {
  return await getOrderByIdOrNumber(identifier);
}
