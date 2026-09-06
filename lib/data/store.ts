import { createClient } from "@/lib/supabase/server";
import {
  devCategories,
  devProducts,
  devVariants,
  devToppings,
  devChocolateTypes,
  devAddons,
} from "./dev-data";
import type { Category, Product, ProductVariant, Topping, ChocolateType, Addon } from "@/types/database";

// Check if credentials are placeholders or undefined
function isSupabaseConfigured() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  return url && key && url !== "your-supabase-url" && key !== "your-supabase-anon-key";
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase is not configured. Falling back to development mock data for Categories.");
    return devCategories;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching categories, falling back to mock data:", error);
    return devCategories;
  }
}

export async function getProducts(options?: {
  categoryId?: number;
  categorySlug?: string;
  featuredOnly?: boolean;
  searchQuery?: string;
  sort?: string; // 'featured' | 'price_asc' | 'price_desc' | 'newest'
  minPrice?: number;
  maxPrice?: number;
  inStockOnly?: boolean;
  customizableOnly?: boolean;
}): Promise<Product[]> {
  const isConfigured = isSupabaseConfigured();

  // 1. Resolve Category ID from Category Slug if needed
  let categoryId = options?.categoryId;
  if (options?.categorySlug) {
    if (isConfigured) {
      try {
        const supabase = await createClient();
        const { data: cat } = await supabase
          .from("categories")
          .select("id")
          .eq("slug", options.categorySlug)
          .single();
        if (cat) categoryId = cat.id;
      } catch (e) {
        console.error("Error resolving category slug:", e);
      }
    } else {
      const cat = devCategories.find((c) => c.slug === options.categorySlug);
      if (cat) categoryId = cat.id;
    }
  }

  // ── MOCK FALLBACK PATH ──────────────────────────────────────────────────────
  if (!isConfigured) {
    console.warn("Supabase is not configured. Falling back to development mock data for Products.");
    let list = [...devProducts];

    if (categoryId) {
      list = list.filter((p) => p.category_id === categoryId);
    }
    if (options?.featuredOnly) {
      list = list.filter((p) => p.featured);
    }
    if (options?.customizableOnly) {
      list = list.filter((p) => p.is_customizable);
    }
    if (options?.inStockOnly) {
      list = list.filter((p) => p.stock_quantity > 0);
    }
    if (options?.minPrice !== undefined) {
      list = list.filter((p) => p.base_price >= options.minPrice!);
    }
    if (options?.maxPrice !== undefined) {
      list = list.filter((p) => p.base_price <= options.maxPrice!);
    }
    if (options?.searchQuery) {
      const q = options.searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.short_description && p.short_description.toLowerCase().includes(q))
      );
    }

    // Sort
    if (options?.sort === "price_asc") {
      list.sort((a, b) => a.base_price - b.base_price);
    } else if (options?.sort === "price_desc") {
      list.sort((a, b) => b.base_price - a.base_price);
    } else if (options?.sort === "newest") {
      list.sort((a, b) => b.created_at.localeCompare(a.created_at));
    } else {
      // Default: featured or id sorting
      list.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    return list;
  }

  // ── SUPABASE PATH ───────────────────────────────────────────────────────────
  try {
    const supabase = await createClient();
    let query = supabase
      .from("products")
      .select("*")
      .eq("active", true);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }
    if (options?.featuredOnly) {
      query = query.eq("featured", true);
    }
    if (options?.customizableOnly) {
      query = query.eq("is_customizable", true);
    }
    if (options?.inStockOnly) {
      query = query.gt("stock_quantity", 0);
    }
    if (options?.minPrice !== undefined) {
      query = query.gte("base_price", options.minPrice);
    }
    if (options?.maxPrice !== undefined) {
      query = query.lte("base_price", options.maxPrice);
    }
    if (options?.searchQuery) {
      query = query.ilike("name", `%${options.searchQuery}%`);
    }

    // Apply sorting
    if (options?.sort === "price_asc") {
      query = query.order("base_price", { ascending: true });
    } else if (options?.sort === "price_desc") {
      query = query.order("base_price", { ascending: false });
    } else if (options?.sort === "newest") {
      query = query.order("created_at", { ascending: false });
    } else {
      // Default
      query = query.order("featured", { ascending: false }).order("id", { ascending: true });
    }

    const { data, error } = await query;
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching products, falling back to mock data:", error);
    // Fall back to local filter list in case of db errors
    let list = [...devProducts];
    if (categoryId) list = list.filter((p) => p.category_id === categoryId);
    if (options?.featuredOnly) list = list.filter((p) => p.featured);
    if (options?.customizableOnly) list = list.filter((p) => p.is_customizable);
    if (options?.inStockOnly) list = list.filter((p) => p.stock_quantity > 0);
    if (options?.minPrice !== undefined) list = list.filter((p) => p.base_price >= options.minPrice!);
    if (options?.maxPrice !== undefined) list = list.filter((p) => p.base_price <= options.maxPrice!);
    return list;
  }
}

export async function getProductBySlug(slug: string): Promise<{
  product: Product;
  variants: ProductVariant[];
  images: { id: number; image_url: string; alt_text: string | null }[];
} | null> {
  if (!isSupabaseConfigured()) {
    console.warn(`Supabase is not configured. Falling back to dev mock data for product: ${slug}`);
    const product = devProducts.find((p) => p.slug === slug);
    if (!product) return null;

    const variants = devVariants.filter((v) => v.product_id === product.id);
    const images = [{ id: 1, image_url: "", alt_text: product.name }];

    return { product, variants, images };
  }

  try {
    const supabase = await createClient();
    const { data: product, error: prodError } = await supabase
      .from("products")
      .select("*")
      .eq("slug", slug)
      .eq("active", true)
      .single();

    if (prodError || !product) {
      return null;
    }

    const [variantsRes, imagesRes] = await Promise.all([
      supabase
        .from("product_variants")
        .select("*")
        .eq("product_id", product.id)
        .eq("active", true)
        .order("sort_order", { ascending: true }),
      supabase
        .from("product_images")
        .select("id, image_url, alt_text")
        .eq("product_id", product.id)
        .order("sort_order", { ascending: true }),
    ]);

    return {
      product,
      variants: variantsRes.data || [],
      images: imagesRes.data || [],
    };
  } catch (error) {
    console.error(`Error fetching product by slug (${slug}), falling back to mock data:`, error);
    const product = devProducts.find((p) => p.slug === slug);
    if (!product) return null;

    const variants = devVariants.filter((v) => v.product_id === product.id);
    const images = [{ id: 1, image_url: "", alt_text: product.name }];

    return { product, variants, images };
  }
}

export async function getToppings(): Promise<Topping[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase is not configured. Falling back to development mock data for Toppings.");
    return devToppings;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("toppings")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching toppings, falling back to mock data:", error);
    return devToppings;
  }
}

export async function getChocolateTypes(): Promise<ChocolateType[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase is not configured. Falling back to development mock data for Chocolate Types.");
    return devChocolateTypes;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("chocolate_types")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching chocolate types, falling back to mock data:", error);
    return devChocolateTypes;
  }
}

export async function getAddons(): Promise<Addon[]> {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase is not configured. Falling back to development mock data for Addons.");
    return devAddons;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("addons")
      .select("*")
      .eq("active", true)
      .order("sort_order", { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching addons, falling back to mock data:", error);
    return devAddons;
  }
}

export async function getFAQs(): Promise<{ question: string; answer: string }[]> {
  const { devFAQs } = await import("./dev-data");
  if (!isSupabaseConfigured()) {
    return devFAQs;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "faqs")
      .single();

    if (error || !data) throw error;
    return (data.value as { question: string; answer: string }[]) || devFAQs;
  } catch (error) {
    console.error("Error fetching FAQs, falling back to dev mock:", error);
    return devFAQs;
  }
}

export async function getTestimonials(): Promise<{ name: string; role: string; rating: number; text: string }[]> {
  const { devTestimonials } = await import("./dev-data");
  if (!isSupabaseConfigured()) {
    return devTestimonials;
  }

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "testimonials")
      .single();

    if (error || !data) throw error;
    return (data.value as { name: string; role: string; rating: number; text: string }[]) || devTestimonials;
  } catch (error) {
    console.error("Error fetching testimonials, falling back to dev mock:", error);
    return devTestimonials;
  }
}

