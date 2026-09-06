-- COCOCRAFT Database Schema Migration
-- Initial release

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── 1. PROFILES TABLE ────────────────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text not null,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── 2. CATEGORIES TABLE ──────────────────────────────────────────────────────
create table public.categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  description text,
  image_url text,
  active boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── 3. PRODUCTS TABLE ────────────────────────────────────────────────────────
create table public.products (
  id bigint generated always as identity primary key,
  category_id bigint references public.categories(id) on delete set null,
  name text not null,
  slug text not null unique,
  description text,
  short_description text,
  base_price numeric(10, 2) not null check (base_price >= 0),
  compare_at_price numeric(10, 2) check (compare_at_price >= 0),
  sku text unique,
  main_image text,
  ingredients text,
  allergens text,
  weight integer check (weight > 0), -- in grams
  shelf_life text,
  storage_instructions text,
  stock_quantity integer default 0 not null check (stock_quantity >= 0),
  featured boolean default false not null,
  active boolean default true not null,
  is_customizable boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── 4. PRODUCT IMAGES TABLE ──────────────────────────────────────────────────
create table public.product_images (
  id bigint generated always as identity primary key,
  product_id bigint references public.products(id) on delete cascade not null,
  image_url text not null,
  alt_text text,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── 5. PRODUCT VARIANTS TABLE ────────────────────────────────────────────────
create table public.product_variants (
  id bigint generated always as identity primary key,
  product_id bigint references public.products(id) on delete cascade not null,
  name text not null, -- e.g., 'Small', 'Medium', 'Large'
  description text,
  price_modifier numeric(10, 2) default 0.00 not null, -- can be positive or negative
  sku text unique,
  stock_quantity integer default 0 not null check (stock_quantity >= 0),
  weight integer check (weight > 0), -- in grams
  active boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── 6. CHOCOLATE TYPES TABLE ─────────────────────────────────────────────────
create table public.chocolate_types (
  id bigint generated always as identity primary key,
  name text not null, -- e.g., 'Milk Chocolate', 'Dark Chocolate', 'White Chocolate'
  slug text not null unique,
  description text,
  image_url text,
  price_modifier numeric(10, 2) default 0.00 not null,
  active boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── 7. TOPPINGS TABLE ────────────────────────────────────────────────────────
create table public.toppings (
  id bigint generated always as identity primary key,
  name text not null, -- e.g., 'Almond', 'Hazelnut', 'Oreo'
  slug text not null unique,
  description text,
  image_url text,
  price numeric(10, 2) not null check (price >= 0),
  category text not null, -- e.g., 'nuts', 'fruits', 'crunch', 'sweets'
  max_quantity integer default 1 not null check (max_quantity >= 1),
  active boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── 8. ADD-ONS TABLE ─────────────────────────────────────────────────────────
create table public.addons (
  id bigint generated always as identity primary key,
  name text not null, -- e.g., 'Gift Box', 'Greeting Card'
  slug text not null unique,
  description text,
  image_url text,
  price numeric(10, 2) not null check (price >= 0),
  active boolean default true not null,
  sort_order integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── 9. SETTINGS TABLE ────────────────────────────────────────────────────────
create table public.settings (
  id bigint generated always as identity primary key,
  key text not null unique,
  value jsonb not null,
  description text,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── 10. COUPONS TABLE ────────────────────────────────────────────────────────
create table public.coupons (
  id bigint generated always as identity primary key,
  code text not null unique,
  type text not null check (type in ('percentage', 'fixed')),
  value numeric(10, 2) not null check (value > 0),
  minimum_order_value numeric(10, 2) default 0.00 not null check (minimum_order_value >= 0),
  maximum_discount numeric(10, 2) check (maximum_discount > 0),
  usage_limit integer check (usage_limit > 0),
  used_count integer default 0 not null check (used_count >= 0),
  valid_from timestamp with time zone not null,
  valid_until timestamp with time zone not null,
  active boolean default true not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint check_valid_dates check (valid_until > valid_from)
);

-- ── 11. ORDERS TABLE ─────────────────────────────────────────────────────────
create table public.orders (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete set null,
  order_number text not null unique,
  status text not null default 'pending' check (status in ('pending', 'processing', 'preparing', 'shipped', 'delivered', 'cancelled', 'refunded')),
  payment_status text not null default 'pending' check (payment_status in ('pending', 'paid', 'failed', 'refunded')),
  payment_provider text default 'razorpay' not null,
  payment_id text, -- payment gateway transaction id
  razorpay_order_id text,
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  discount numeric(10, 2) default 0.00 not null check (discount >= 0),
  shipping_fee numeric(10, 2) default 0.00 not null check (shipping_fee >= 0),
  tax numeric(10, 2) default 0.00 not null check (tax >= 0),
  total numeric(10, 2) not null check (total >= 0),
  currency text default 'INR' not null,
  customer_name text not null,
  customer_email text not null,
  customer_phone text not null,
  shipping_address jsonb not null,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── 12. ORDER ITEMS TABLE ────────────────────────────────────────────────────
create table public.order_items (
  id bigint generated always as identity primary key,
  order_id uuid references public.orders(id) on delete cascade not null,
  product_id bigint references public.products(id) on delete set null,
  product_name_snapshot text not null,
  variant_snapshot jsonb,
  customization_json jsonb, -- base, toppings, annotations
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null check (unit_price >= 0),
  total_price numeric(10, 2) not null check (total_price >= 0),
  image_snapshot text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── 13. REVIEWS TABLE ────────────────────────────────────────────────────────
create table public.reviews (
  id bigint generated always as identity primary key,
  product_id bigint references public.products(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  order_id uuid references public.orders(id) on delete set null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  approved boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ── 14. CART ITEMS TABLE (PERSISTENT CARTS) ──────────────────────────────────
create table public.cart_items (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  product_id bigint references public.products(id) on delete cascade not null,
  variant_id bigint references public.product_variants(id) on delete cascade,
  customization_json jsonb,
  quantity integer default 1 not null check (quantity > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_user_cart_item unique (user_id, product_id, variant_id, customization_json)
);

-- ── 15. UPDATED_AT AUTOMATIC UPDATE FUNCTION ─────────────────────────────────
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Apply update triggers to tables
create trigger update_profiles_updated_at before update on public.profiles for each row execute procedure public.update_updated_at_column();
create trigger update_categories_updated_at before update on public.categories for each row execute procedure public.update_updated_at_column();
create trigger update_products_updated_at before update on public.products for each row execute procedure public.update_updated_at_column();
create trigger update_product_variants_updated_at before update on public.product_variants for each row execute procedure public.update_updated_at_column();
create trigger update_chocolate_types_updated_at before update on public.chocolate_types for each row execute procedure public.update_updated_at_column();
create trigger update_toppings_updated_at before update on public.toppings for each row execute procedure public.update_updated_at_column();
create trigger update_addons_updated_at before update on public.addons for each row execute procedure public.update_updated_at_column();
create trigger update_settings_updated_at before update on public.settings for each row execute procedure public.update_updated_at_column();
create trigger update_coupons_updated_at before update on public.coupons for each row execute procedure public.update_updated_at_column();
create trigger update_orders_updated_at before update on public.orders for each row execute procedure public.update_updated_at_column();
create trigger update_reviews_updated_at before update on public.reviews for each row execute procedure public.update_updated_at_column();
create trigger update_cart_items_updated_at before update on public.cart_items for each row execute procedure public.update_updated_at_column();

-- ── 16. HELPER FUNCTIONS FOR SECURITY POLICY CHECKS ──────────────────────────
create or replace function public.is_admin()
returns boolean security definer language plpgsql as $$
begin
  return exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
end;
$$;

-- ── 17. ROW LEVEL SECURITY (RLS) ACTIVATION ──────────────────────────────────
alter table public.profiles enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_images enable row level security;
alter table public.product_variants enable row level security;
alter table public.chocolate_types enable row level security;
alter table public.toppings enable row level security;
alter table public.addons enable row level security;
alter table public.settings enable row level security;
alter table public.coupons enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.reviews enable row level security;
alter table public.cart_items enable row level security;

-- ── 18. SECURITY POLICIES ────────────────────────────────────────────────────

-- PROFILES Policies
create policy "Allow users to read own profile" on public.profiles
  for select using (auth.uid() = id or public.is_admin());

create policy "Allow users to update own profile" on public.profiles
  for update using (auth.uid() = id or public.is_admin());

create policy "Allow system/admins to insert profiles" on public.profiles
  for insert with check (auth.uid() = id or public.is_admin());

-- CATEGORIES Policies
create policy "Allow public read of active categories" on public.categories
  for select using (active = true or public.is_admin());

create policy "Admins have full access to categories" on public.categories
  for all using (public.is_admin());

-- PRODUCTS Policies
create policy "Allow public read of active products" on public.products
  for select using (active = true or public.is_admin());

create policy "Admins have full access to products" on public.products
  for all using (public.is_admin());

-- PRODUCT IMAGES Policies
create policy "Allow public read of product images" on public.product_images
  for select using (exists (
    select 1 from public.products where products.id = product_images.product_id and products.active = true
  ) or public.is_admin());

create policy "Admins have full access to product images" on public.product_images
  for all using (public.is_admin());

-- PRODUCT VARIANTS Policies
create policy "Allow public read of active variants" on public.product_variants
  for select using (active = true or public.is_admin());

create policy "Admins have full access to variants" on public.product_variants
  for all using (public.is_admin());

-- CHOCOLATE TYPES Policies
create policy "Allow public read of active chocolate types" on public.chocolate_types
  for select using (active = true or public.is_admin());

create policy "Admins have full access to chocolate types" on public.chocolate_types
  for all using (public.is_admin());

-- TOPPINGS Policies
create policy "Allow public read of active toppings" on public.toppings
  for select using (active = true or public.is_admin());

create policy "Admins have full access to toppings" on public.toppings
  for all using (public.is_admin());

-- ADD-ONS Policies
create policy "Allow public read of active addons" on public.addons
  for select using (active = true or public.is_admin());

create policy "Admins have full access to addons" on public.addons
  for all using (public.is_admin());

-- SETTINGS Policies
create policy "Allow public read of settings" on public.settings
  for select using (true);

create policy "Admins have full access to settings" on public.settings
  for all using (public.is_admin());

-- COUPONS Policies
create policy "Allow admins full access to coupons" on public.coupons
  for all using (public.is_admin());

create policy "Allow authenticated users to read active coupons" on public.coupons
  for select using (auth.uid() is not null and active = true);

-- ORDERS Policies
create policy "Allow admins full access to orders" on public.orders
  for all using (public.is_admin());

create policy "Allow users to read own orders" on public.orders
  for select using (auth.uid() = user_id);

create policy "Allow any user to insert orders (guest or customer)" on public.orders
  for insert with check (true);

-- ORDER ITEMS Policies
create policy "Allow admins full access to order items" on public.order_items
  for all using (public.is_admin());

create policy "Allow users to read own order items" on public.order_items
  for select using (exists (
    select 1 from public.orders where orders.id = order_items.order_id and (orders.user_id = auth.uid())
  ));

create policy "Allow any user to insert order items" on public.order_items
  for insert with check (true);

-- REVIEWS Policies
create policy "Allow public read of approved reviews" on public.reviews
  for select using (approved = true or auth.uid() = user_id or public.is_admin());

create policy "Allow authenticated users to create reviews" on public.reviews
  for insert with check (auth.uid() = user_id);

create policy "Allow users to update own reviews" on public.reviews
  for update using (auth.uid() = user_id or public.is_admin());

create policy "Allow admins to delete reviews" on public.reviews
  for delete using (public.is_admin());

-- CART ITEMS Policies
create policy "Allow users to manage own cart items" on public.cart_items
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── 19. DATABASE INDEXES ──────────────────────────────────────────────────────
create index idx_products_slug on public.products(slug);
create index idx_products_category_id on public.products(category_id);
create index idx_products_active_featured on public.products(active, featured);
create index idx_product_images_product_id on public.product_images(product_id);
create index idx_product_variants_product_id on public.product_variants(product_id);
create index idx_toppings_active on public.toppings(active);
create index idx_orders_user_id on public.orders(user_id);
create index idx_orders_order_number on public.orders(order_number);
create index idx_orders_status_payment on public.orders(status, payment_status);
create index idx_orders_created_at on public.orders(created_at desc);
create index idx_order_items_order_id on public.order_items(order_id);
create index idx_reviews_product_id on public.reviews(product_id);
create index idx_reviews_user_id on public.reviews(user_id);
create index idx_coupons_code on public.coupons(code);
create index idx_cart_items_user_id on public.cart_items(user_id);
