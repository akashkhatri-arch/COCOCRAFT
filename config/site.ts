export const siteConfig = {
  brandName: "Truffle Tales",
  brandSubtitle: "by Parul",
  tagline: "Handcrafted Luxury Chocolates by Parul",
  currency: "INR",
  currencySymbol: "₹",
  locale: "en-IN",
  supportEmail: process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "hello@truffletales.in",
  supportPhone: process.env.NEXT_PUBLIC_SUPPORT_PHONE || "+91 98765 43210",
  whatsappNumber: process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210",
  instagramHandle: process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "truffletales.in",
  shippingThreshold: 999, // Free shipping above this amount
  defaultShippingFee: 99, // Flat shipping fee below threshold
  taxRate: 0, // In percentage, e.g. 18 for 18% GST (currently 0 for simplicity)
  maxToppings: 5,
  maxPersonalizationChars: 40,
};

export type SiteConfig = typeof siteConfig;
