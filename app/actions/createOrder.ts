"use server";

import { CheckoutInfoSchema } from "@/lib/validations/schemas";
import { getProducts, getToppings, getAddons, getChocolateTypes } from "@/lib/data/store";
import { calculatePrice } from "@/lib/pricing/calculator";
import { siteConfig } from "@/config/site";
import { saveOrder } from "@/lib/data/orders-store";
import type { CartItem } from "@/store/cart";

export interface CreateOrderInput {
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      pincode: string;
      country?: string;
    };
    notes?: string;
  };
  items: CartItem[];
  couponCode?: string | null;
  userId?: string | null;
}

export interface CreateOrderResult {
  success: boolean;
  error?: string;
  orderNumber?: string;
  orderId?: string;
  total?: number;
}

export async function createOrderAction(input: CreateOrderInput): Promise<CreateOrderResult> {
  try {
    // 1. Validate Customer & Address info with Zod
    const validatedCustomer = CheckoutInfoSchema.safeParse({
      name: input.customer.name,
      email: input.customer.email,
      phone: input.customer.phone,
      shipping_address: {
        line1: input.customer.address.line1,
        line2: input.customer.address.line2 || "",
        city: input.customer.address.city,
        state: input.customer.address.state,
        pincode: input.customer.address.pincode,
        country: input.customer.address.country || "India",
      },
      notes: input.customer.notes,
    });

    if (!validatedCustomer.success) {
      const firstError = validatedCustomer.error.issues[0]?.message || "Invalid customer information";
      return { success: false, error: firstError };
    }

    if (!input.items || input.items.length === 0) {
      return { success: false, error: "Your cart is empty. Please add items before checking out." };
    }

    // 2. Authoritative server-side price calculation
    const allProducts = await getProducts();
    const allChocolateTypes = await getChocolateTypes();
    const allToppings = await getToppings();
    const allAddons = await getAddons();

    const orderItemsPayload: {
      productId: number;
      variantId?: number | null;
      productName: string;
      unitPrice: number;
      quantity: number;
      totalPrice: number;
      image?: string | null;
      customization?: Record<string, unknown> | null;
    }[] = [];

    let authoritativeSubtotal = 0;

    for (const item of input.items) {
      const product = allProducts.find((p) => p.id === item.productId);
      if (!product) {
        return { success: false, error: `Product "${item.name}" is no longer available.` };
      }

      const qty = Math.max(1, Math.min(99, item.quantity));
      let unitPrice = product.base_price;

      // If it's a custom chocolate bar, calculate exact customization pricing
      if (item.customization) {
        const cust = item.customization as Record<string, unknown>;
        const chocoTypeId = typeof cust.chocolateTypeId === "number" ? cust.chocolateTypeId : undefined;
        const chocolateType = allChocolateTypes.find((c) => c.id === chocoTypeId);
        const chocoMod = chocolateType?.price_modifier || 0;

        const toppingsList = Array.isArray(cust.toppingIds)
          ? (cust.toppingIds as number[])
              .map((id) => allToppings.find((t) => t.id === id))
              .filter(Boolean)
              .map((t) => ({ price: t!.price, quantity: 1 }))
          : [];

        const addonsList = Array.isArray(cust.addonIds)
          ? (cust.addonIds as number[])
              .map((id) => allAddons.find((a) => a.id === id))
              .filter(Boolean)
              .map((a) => ({ price: a!.price }))
          : [];

        const calc = calculatePrice({
          basePrice: product.base_price,
          chocolatePriceModifier: chocoMod,
          toppings: toppingsList,
          addons: addonsList,
          quantity: 1,
        });
        unitPrice = calc.itemSubtotal;
      }

      const itemTotal = unitPrice * qty;
      authoritativeSubtotal += itemTotal;

      orderItemsPayload.push({
        productId: product.id,
        variantId: item.variantId || null,
        productName: item.name,
        unitPrice,
        quantity: qty,
        totalPrice: itemTotal,
        image: item.image || product.main_image,
        customization: item.customization ? (item.customization as Record<string, unknown>) : null,
      });
    }

    // 3. Authoritative Coupon & Discount Calculation
    let discount = 0;
    let isFreeShippingCoupon = false;

    if (input.couponCode) {
      const code = input.couponCode.trim().toUpperCase();
      if (code === "WELCOME10" && authoritativeSubtotal >= 499) {
        discount = Math.round((authoritativeSubtotal * 10) / 100);
      } else if (code === "SWEET50" && authoritativeSubtotal >= 299) {
        discount = Math.min(50, authoritativeSubtotal);
      } else if (code === "COCO15" && authoritativeSubtotal >= 799) {
        discount = Math.min(300, Math.round((authoritativeSubtotal * 15) / 100));
      } else if (code === "FREESHIP") {
        isFreeShippingCoupon = true;
      }
    }

    // 4. Shipping Fee
    const shippingFee =
      authoritativeSubtotal >= siteConfig.shippingThreshold || isFreeShippingCoupon
        ? 0
        : siteConfig.defaultShippingFee;

    const netTaxable = Math.max(0, authoritativeSubtotal - discount);
    const tax = Math.round(((netTaxable * siteConfig.taxRate) / 100) * 100) / 100;
    const finalTotal = Math.max(0, netTaxable + shippingFee + tax);

    // 5. Generate unique order number
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const datePart = Date.now().toString(36).substring(3, 7).toUpperCase();
    const orderNumber = `CC-${datePart}-${randomSuffix}`;

    // 6. Save to order store
    const saved = await saveOrder({
      orderNumber,
      userId: input.userId || null,
      customerName: validatedCustomer.data.name,
      customerEmail: validatedCustomer.data.email,
      customerPhone: validatedCustomer.data.phone,
      shippingAddress: validatedCustomer.data.shipping_address,
      notes: validatedCustomer.data.notes,
      subtotal: authoritativeSubtotal,
      discount,
      shippingFee,
      tax,
      total: finalTotal,
      items: orderItemsPayload,
    });

    return {
      success: true,
      orderNumber: saved.order_number,
      orderId: saved.id,
      total: saved.total,
    };
  } catch (err) {
    console.error("[createOrderAction] Error creating order:", err);
    return {
      success: false,
      error: "Unable to process order at this moment. Please try again.",
    };
  }
}
