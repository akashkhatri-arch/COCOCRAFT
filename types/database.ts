export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          role: "customer" | "admin";
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          role?: "customer" | "admin";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          role?: "customer" | "admin";
          avatar_url?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: number;
          category_id: number | null;
          name: string;
          slug: string;
          description: string | null;
          short_description: string | null;
          base_price: number;
          compare_at_price: number | null;
          sku: string | null;
          main_image: string | null;
          ingredients: string | null;
          allergens: string | null;
          weight: number | null;
          shelf_life: string | null;
          storage_instructions: string | null;
          stock_quantity: number;
          featured: boolean;
          active: boolean;
          is_customizable: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          category_id?: number | null;
          name: string;
          slug: string;
          description?: string | null;
          short_description?: string | null;
          base_price: number;
          compare_at_price?: number | null;
          sku?: string | null;
          main_image?: string | null;
          ingredients?: string | null;
          allergens?: string | null;
          weight?: number | null;
          shelf_life?: string | null;
          storage_instructions?: string | null;
          stock_quantity?: number;
          featured?: boolean;
          active?: boolean;
          is_customizable?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          category_id?: number | null;
          name?: string;
          slug?: string;
          description?: string | null;
          short_description?: string | null;
          base_price?: number;
          compare_at_price?: number | null;
          sku?: string | null;
          main_image?: string | null;
          ingredients?: string | null;
          allergens?: string | null;
          weight?: number | null;
          shelf_life?: string | null;
          storage_instructions?: string | null;
          stock_quantity?: number;
          featured?: boolean;
          active?: boolean;
          is_customizable?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: number;
          product_id: number;
          image_url: string;
          alt_text: string | null;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          image_url: string;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          product_id?: number;
          image_url?: string;
          alt_text?: string | null;
          sort_order?: number;
          created_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: number;
          product_id: number;
          name: string;
          description: string | null;
          price_modifier: number;
          sku: string | null;
          stock_quantity: number;
          weight: number | null;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          name: string;
          description?: string | null;
          price_modifier?: number;
          sku?: string | null;
          stock_quantity?: number;
          weight?: number | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          product_id?: number;
          name?: string;
          description?: string | null;
          price_modifier?: number;
          sku?: string | null;
          stock_quantity?: number;
          weight?: number | null;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      chocolate_types: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          price_modifier: number;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          price_modifier?: number;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          price_modifier?: number;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      toppings: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          price: number;
          category: string;
          max_quantity: number;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          price: number;
          category: string;
          max_quantity?: number;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          price?: number;
          category?: string;
          max_quantity?: number;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      addons: {
        Row: {
          id: number;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          price: number;
          active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          price: number;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          price?: number;
          active?: boolean;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      settings: {
        Row: {
          id: number;
          key: string;
          value: Json;
          description: string | null;
          updated_at: string;
        };
        Insert: {
          id?: number;
          key: string;
          value: Json;
          description?: string | null;
          updated_at?: string;
        };
        Update: {
          id?: number;
          key?: string;
          value?: Json;
          description?: string | null;
          updated_at?: string;
        };
      };
      coupons: {
        Row: {
          id: number;
          code: string;
          type: "percentage" | "fixed";
          value: number;
          minimum_order_value: number;
          maximum_discount: number | null;
          usage_limit: number | null;
          used_count: number;
          valid_from: string;
          valid_until: string;
          active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          code: string;
          type: "percentage" | "fixed";
          value: number;
          minimum_order_value?: number;
          maximum_discount?: number | null;
          usage_limit?: number | null;
          used_count?: number;
          valid_from: string;
          valid_until: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          code?: string;
          type?: "percentage" | "fixed";
          value?: number;
          minimum_order_value?: number;
          maximum_discount?: number | null;
          usage_limit?: number | null;
          used_count?: number;
          valid_from?: string;
          valid_until?: string;
          active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          user_id: string | null;
          order_number: string;
          status: "pending" | "processing" | "preparing" | "shipped" | "delivered" | "cancelled" | "refunded";
          payment_status: "pending" | "paid" | "failed" | "refunded";
          payment_provider: string;
          payment_id: string | null;
          razorpay_order_id: string | null;
          subtotal: number;
          discount: number;
          shipping_fee: number;
          tax: number;
          total: number;
          currency: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: Json;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          order_number: string;
          status?: "pending" | "processing" | "preparing" | "shipped" | "delivered" | "cancelled" | "refunded";
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          payment_provider?: string;
          payment_id?: string | null;
          razorpay_order_id?: string | null;
          subtotal: number;
          discount?: number;
          shipping_fee?: number;
          tax?: number;
          total: number;
          currency?: string;
          customer_name: string;
          customer_email: string;
          customer_phone: string;
          shipping_address: Json;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          order_number?: string;
          status?: "pending" | "processing" | "preparing" | "shipped" | "delivered" | "cancelled" | "refunded";
          payment_status?: "pending" | "paid" | "failed" | "refunded";
          payment_provider?: string;
          payment_id?: string | null;
          razorpay_order_id?: string | null;
          subtotal?: number;
          discount?: number;
          shipping_fee?: number;
          tax?: number;
          total?: number;
          currency?: string;
          customer_name?: string;
          customer_email?: string;
          customer_phone?: string;
          shipping_address?: Json;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: number;
          order_id: string;
          product_id: number | null;
          product_name_snapshot: string;
          variant_snapshot: Json | null;
          customization_json: Json | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          image_snapshot: string | null;
          created_at: string;
        };
        Insert: {
          id?: number;
          order_id: string;
          product_id?: number | null;
          product_name_snapshot: string;
          variant_snapshot?: Json | null;
          customization_json?: Json | null;
          quantity: number;
          unit_price: number;
          total_price: number;
          image_snapshot?: string | null;
          created_at?: string;
        };
        Update: {
          id?: number;
          order_id?: string;
          product_id?: number | null;
          product_name_snapshot?: string;
          variant_snapshot?: Json | null;
          customization_json?: Json | null;
          quantity?: number;
          unit_price?: number;
          total_price?: number;
          image_snapshot?: string | null;
          created_at?: string;
        };
      };
      reviews: {
        Row: {
          id: number;
          product_id: number;
          user_id: string;
          order_id: string | null;
          rating: number;
          title: string | null;
          body: string | null;
          approved: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          product_id: number;
          user_id: string;
          order_id?: string | null;
          rating: number;
          title?: string | null;
          body?: string | null;
          approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          product_id?: number;
          user_id?: string;
          order_id?: string | null;
          rating?: number;
          title?: string | null;
          body?: string | null;
          approved?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      cart_items: {
        Row: {
          id: number;
          user_id: string;
          product_id: number;
          variant_id: number | null;
          customization_json: Json | null;
          quantity: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          product_id: number;
          variant_id?: number | null;
          customization_json?: Json | null;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          product_id?: number;
          variant_id?: number | null;
          customization_json?: Json | null;
          quantity?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

// ── Helpers ──────────────────────────────────────────────────────────────────
export type Row<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Row"];
export type Insert<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Insert"];
export type Update<T extends keyof Database["public"]["Tables"]> = Database["public"]["Tables"][T]["Update"];

export type Profile = Row<"profiles">;
export type Category = Row<"categories">;
export type Product = Row<"products">;
export type ProductImage = Row<"product_images">;
export type ProductVariant = Row<"product_variants">;
export type ChocolateType = Row<"chocolate_types">;
export type Topping = Row<"toppings">;
export type Addon = Row<"addons">;
export type Order = Row<"orders">;
export type OrderItem = Row<"order_items">;
export type Review = Row<"reviews">;
export type Coupon = Row<"coupons">;
export type CartItem = Row<"cart_items">;
export type StoreSettings = Row<"settings">;
