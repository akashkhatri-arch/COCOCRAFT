import { z } from "zod";

// ── 1. PRODUCT VALIDATIONS ───────────────────────────────────────────────────
export const ProductSchema = z.object({
  id: z.number().optional(),
  category_id: z.number().nullable(),
  name: z.string().min(2, "Product name must be at least 2 characters"),
  slug: z.string().min(2, "Slug must be at least 2 characters").regex(/^[a-z0-9-]+$/, "Invalid slug format"),
  description: z.string().nullable().optional(),
  short_description: z.string().nullable().optional(),
  base_price: z.number().nonnegative("Base price cannot be negative"),
  compare_at_price: z.number().nonnegative().nullable().optional(),
  sku: z.string().nullable().optional(),
  main_image: z.string().url().nullable().optional(),
  ingredients: z.string().nullable().optional(),
  allergens: z.string().nullable().optional(),
  weight: z.number().positive("Weight must be positive").nullable().optional(),
  shelf_life: z.string().nullable().optional(),
  storage_instructions: z.string().nullable().optional(),
  stock_quantity: z.number().int().nonnegative("Stock quantity cannot be negative"),
  featured: z.boolean().default(false),
  active: z.boolean().default(true),
  is_customizable: z.boolean().default(false),
});

// ── 2. PRODUCT VARIANT VALIDATIONS ───────────────────────────────────────────
export const ProductVariantSchema = z.object({
  id: z.number().optional(),
  product_id: z.number(),
  name: z.string().min(1, "Variant name is required"),
  description: z.string().nullable().optional(),
  price_modifier: z.number().default(0.00),
  sku: z.string().nullable().optional(),
  stock_quantity: z.number().int().nonnegative(),
  weight: z.number().positive().nullable().optional(),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

// ── 3. CHOCOLATE TYPE VALIDATIONS ────────────────────────────────────────────
export const ChocolateTypeSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1),
  description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  price_modifier: z.number().default(0.00),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

// ── 4. TOPPING VALIDATIONS ───────────────────────────────────────────────────
export const ToppingSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1),
  description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  price: z.number().nonnegative(),
  category: z.string().min(1),
  max_quantity: z.number().int().positive().default(1),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

// ── 5. ADD-ON VALIDATIONS ────────────────────────────────────────────────────
export const AddonSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1),
  description: z.string().nullable().optional(),
  image_url: z.string().url().nullable().optional(),
  price: z.number().nonnegative(),
  active: z.boolean().default(true),
  sort_order: z.number().int().default(0),
});

// ── 6. COUPON VALIDATIONS ────────────────────────────────────────────────────
export const CouponSchema = z.object({
  id: z.number().optional(),
  code: z.string().min(3, "Code must be at least 3 characters").toUpperCase(),
  type: z.enum(["percentage", "fixed"]),
  value: z.number().positive("Value must be positive"),
  minimum_order_value: z.number().nonnegative().default(0),
  maximum_discount: z.number().positive().nullable().optional(),
  usage_limit: z.number().int().positive().nullable().optional(),
  valid_from: z.string().datetime(),
  valid_until: z.string().datetime(),
  active: z.boolean().default(true),
});

// ── 7. CUSTOMIZATION CONFIGURATION ───────────────────────────────────────────
export const CustomizationConfigSchema = z.object({
  baseChocolateId: z.number(),
  variantId: z.number().nullable().optional(),
  toppings: z.array(
    z.object({
      toppingId: z.number(),
      quantity: z.number().int().positive().max(3),
    })
  ).max(5, "Maximum of 5 toppings allowed"),
  personalizationText: z.string().max(40, "Personalization text must be 40 characters or less").optional(),
});

// ── 8. CART ITEM VALIDATIONS ─────────────────────────────────────────────────
export const CartItemSchema = z.object({
  id: z.number().optional(),
  user_id: z.string().uuid().optional(),
  product_id: z.number(),
  variant_id: z.number().nullable().optional(),
  customization_json: CustomizationConfigSchema.nullable().optional(),
  quantity: z.number().int().positive("Quantity must be at least 1"),
});

// ── 9. CHECKOUT / CUSTOMER INFO VALIDATIONS ─────────────────────────────────
export const AddressSchema = z.object({
  line1: z.string().min(5, "Address line 1 must be at least 5 characters"),
  line2: z.string().optional(),
  city: z.string().min(2, "City name is too short"),
  state: z.string().min(2, "State name is too short"),
  pincode: z.string().regex(/^[1-9][0-9]{5}$/, "Pincode must be exactly 6 digits"),
  country: z.string().default("India"),
});

export const CheckoutInfoSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian number"),
  shipping_address: AddressSchema,
  notes: z.string().optional(),
});

// ── 10. ORDER VALIDATIONS ────────────────────────────────────────────────────
export const OrderSchema = z.object({
  id: z.string().uuid().optional(),
  user_id: z.string().uuid().nullable().optional(),
  order_number: z.string().min(1),
  status: z.enum(["pending", "processing", "preparing", "shipped", "delivered", "cancelled", "refunded"]),
  payment_status: z.enum(["pending", "paid", "failed", "refunded"]),
  payment_provider: z.string().default("razorpay"),
  payment_id: z.string().nullable().optional(),
  razorpay_order_id: z.string().nullable().optional(),
  subtotal: z.number().nonnegative(),
  discount: z.number().nonnegative().default(0),
  shipping_fee: z.number().nonnegative().default(0),
  tax: z.number().nonnegative().default(0),
  total: z.number().nonnegative(),
  currency: z.string().default("INR"),
  customer_name: z.string().min(1),
  customer_email: z.string().email(),
  customer_phone: z.string(),
  shipping_address: AddressSchema,
  notes: z.string().nullable().optional(),
});
