import { createClient } from "@/lib/supabase/server";

export interface CreateOrderPayload {
  orderNumber: string;
  userId?: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  notes?: string;
  subtotal: number;
  discount: number;
  shippingFee: number;
  tax: number;
  total: number;
  items: {
    productId: number;
    variantId?: number | null;
    productName: string;
    unitPrice: number;
    quantity: number;
    totalPrice: number;
    image?: string | null;
    customization?: Record<string, unknown> | null;
  }[];
}

export interface StoredOrder {
  id: string;
  order_number: string;
  user_id?: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: CreateOrderPayload["shippingAddress"];
  notes?: string | null;
  status: "pending" | "confirmed" | "preparing" | "shipped" | "delivered" | "cancelled";
  payment_status: "pending" | "paid" | "failed" | "refunded";
  payment_provider: string;
  subtotal: number;
  discount: number;
  shipping_fee: number;
  tax: number;
  total: number;
  currency: string;
  created_at: string;
  updated_at: string;
  items: {
    id: string;
    order_id: string;
    product_id: number;
    variant_id?: number | null;
    product_name: string;
    unit_price: number;
    quantity: number;
    total_price: number;
    image?: string | null;
    customization?: Record<string, unknown> | null;
  }[];
}

// In-memory mock store for local dev when Supabase credentials are mock/unconfigured
const mockOrders: StoredOrder[] = [
  {
    id: "ord-sample-001",
    order_number: "CC-INITIAL-001",
    user_id: "demo-user-123",
    customer_name: "Elena Sharma",
    customer_email: "elena@example.com",
    customer_phone: "9876543210",
    shipping_address: {
      line1: "Flat 402, Royal Palms, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      pincode: "560001",
      country: "India",
    },
    notes: "Please pack with extra thermal insulation.",
    status: "preparing",
    payment_status: "paid",
    payment_provider: "cod",
    subtotal: 1560,
    discount: 156,
    shipping_fee: 0,
    tax: 0,
    total: 1404,
    currency: "INR",
    created_at: new Date(Date.now() - 86400000).toISOString(),
    updated_at: new Date(Date.now() - 43200000).toISOString(),
    items: [
      {
        id: "item-001",
        order_id: "ord-sample-001",
        product_id: 2,
        variant_id: 2,
        product_name: "Design-Your-Own Bar · Dark Couverture",
        unit_price: 780,
        quantity: 2,
        total_price: 1560,
        image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?auto=format&fit=crop&q=80&w=600",
        customization: {
          chocolateTypeName: "Dark Couverture (70%)",
          variantName: "Large Slab (150g)",
          toppingNames: ["Roasted Almonds", "Sea Salt Flakes"],
          personalization: { name: "Elena", message: "Happy Celebration" },
          addonNames: ["Luxury Wooden Gift Box"],
        },
      },
    ],
  },
];

function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return Boolean(url && key && url !== "your-supabase-url" && key !== "your-supabase-anon-key");
}

export async function saveOrder(payload: CreateOrderPayload): Promise<StoredOrder> {
  const orderId = `ord-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const now = new Date().toISOString();

  const newOrder: StoredOrder = {
    id: orderId,
    order_number: payload.orderNumber,
    user_id: payload.userId || null,
    customer_name: payload.customerName,
    customer_email: payload.customerEmail,
    customer_phone: payload.customerPhone,
    shipping_address: payload.shippingAddress,
    notes: payload.notes || null,
    status: "confirmed",
    payment_status: "paid", // Scaffolding order placement mode
    payment_provider: "cod",
    subtotal: payload.subtotal,
    discount: payload.discount,
    shipping_fee: payload.shippingFee,
    tax: payload.tax,
    total: payload.total,
    currency: "INR",
    created_at: now,
    updated_at: now,
    items: payload.items.map((item, idx) => ({
      id: `item-${orderId}-${idx + 1}`,
      order_id: orderId,
      product_id: item.productId,
      variant_id: item.variantId || null,
      product_name: item.productName,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      total_price: item.totalPrice,
      image: item.image || null,
      customization: item.customization || null,
    })),
  };

  if (!isSupabaseConfigured()) {
    mockOrders.unshift(newOrder);
    return newOrder;
  }

  try {
    const supabase = await createClient();
    const { data: dbOrder, error: orderErr } = await supabase
      .from("orders")
      .insert({
        order_number: newOrder.order_number,
        user_id: newOrder.user_id,
        status: newOrder.status,
        payment_status: newOrder.payment_status,
        payment_provider: newOrder.payment_provider,
        subtotal: newOrder.subtotal,
        discount: newOrder.discount,
        shipping_fee: newOrder.shipping_fee,
        tax: newOrder.tax,
        total: newOrder.total,
        currency: newOrder.currency,
        customer_name: newOrder.customer_name,
        customer_email: newOrder.customer_email,
        customer_phone: newOrder.customer_phone,
        shipping_address: newOrder.shipping_address,
        notes: newOrder.notes,
      })
      .select()
      .single();

    if (orderErr || !dbOrder) {
      console.warn("Supabase insert error, falling back to in-memory orders store:", orderErr);
      mockOrders.unshift(newOrder);
      return newOrder;
    }

    const orderItemsToInsert = payload.items.map((item) => ({
      order_id: dbOrder.id,
      product_id: item.productId,
      variant_id: item.variantId || null,
      product_name: item.productName,
      unit_price: item.unitPrice,
      quantity: item.quantity,
      total_price: item.totalPrice,
      customization: item.customization || null,
    }));

    await supabase.from("order_items").insert(orderItemsToInsert);
    newOrder.id = dbOrder.id;
    mockOrders.unshift(newOrder);
    return newOrder;
  } catch (err) {
    console.error("Failed writing order to Supabase, stored in memory:", err);
    mockOrders.unshift(newOrder);
    return newOrder;
  }
}

export async function getOrders(options?: { userId?: string; orderNumber?: string }): Promise<StoredOrder[]> {
  if (!isSupabaseConfigured()) {
    let list = [...mockOrders];
    if (options?.userId) {
      const uid = options.userId;
      list = list.filter((o) => o.user_id === uid || (o.customer_email && o.customer_email.includes(uid)));
    }
    if (options?.orderNumber) {
      list = list.filter((o) => o.order_number === options.orderNumber);
    }
    return list;
  }

  try {
    const supabase = await createClient();
    let query = supabase.from("orders").select("*, order_items(*)");

    if (options?.userId) {
      query = query.eq("user_id", options.userId);
    }
    if (options?.orderNumber) {
      query = query.eq("order_number", options.orderNumber);
    }

    const { data, error } = await query.order("created_at", { ascending: false });
    if (error || !data || data.length === 0) {
      let list = [...mockOrders];
      if (options?.userId) {
        const uid = options.userId;
        list = list.filter((o) => o.user_id === uid || (o.customer_email && o.customer_email.includes(uid)));
      }
      if (options?.orderNumber) {
        list = list.filter((o) => o.order_number === options.orderNumber);
      }
      return list;
    }

    return (data as Array<Record<string, unknown>>).map((d) => ({
      id: String(d.id),
      order_number: String(d.order_number),
      user_id: d.user_id ? String(d.user_id) : null,
      customer_name: String(d.customer_name || ""),
      customer_email: String(d.customer_email || ""),
      customer_phone: String(d.customer_phone || ""),
      shipping_address: (d.shipping_address || {}) as StoredOrder["shipping_address"],
      notes: d.notes ? String(d.notes) : null,
      status: (d.status || "confirmed") as StoredOrder["status"],
      payment_status: (d.payment_status || "pending") as StoredOrder["payment_status"],
      payment_provider: String(d.payment_provider || "cod"),
      subtotal: Number(d.subtotal || 0),
      discount: Number(d.discount || 0),
      shipping_fee: Number(d.shipping_fee || 0),
      tax: Number(d.tax || 0),
      total: Number(d.total || 0),
      currency: String(d.currency || "INR"),
      created_at: String(d.created_at || new Date().toISOString()),
      updated_at: String(d.updated_at || new Date().toISOString()),
      items: ((d.order_items as Array<Record<string, unknown>>) || []).map((it) => ({
        id: String(it.id),
        order_id: String(it.order_id),
        product_id: Number(it.product_id),
        variant_id: it.variant_id ? Number(it.variant_id) : null,
        product_name: String(it.product_name),
        unit_price: Number(it.unit_price),
        quantity: Number(it.quantity),
        total_price: Number(it.total_price),
        customization: (it.customization as Record<string, unknown>) || null,
      })),
    }));
  } catch {
    return mockOrders;
  }
}

export async function getOrderByIdOrNumber(identifier: string): Promise<StoredOrder | null> {
  const all = await getOrders();
  return all.find((o) => o.id === identifier || o.order_number === identifier) || null;
}

export async function updateOrderStatus(
  orderId: string,
  newStatus: StoredOrder["status"]
): Promise<boolean> {
  const existing = mockOrders.find((o) => o.id === orderId || o.order_number === orderId);
  if (existing) {
    existing.status = newStatus;
    existing.updated_at = new Date().toISOString();
  }

  if (!isSupabaseConfigured()) return true;

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq("id", orderId);
    return !error;
  } catch {
    return true;
  }
}
