-- COCOCRAFT Development Seed Data

-- ── 1. SEED CATEGORIES ────────────────────────────────────────────────────────
insert into public.categories (name, slug, description, image_url, active, sort_order) values
('Signature Bars', 'signature-bars', 'Our classically designed artisanal chocolate bars.', null, true, 1),
('Custom Creations', 'custom-creations', 'Custom design your own chocolate bars with unique toppings.', null, true, 2),
('Gift Boxes', 'gift-boxes', 'Pre-curated luxury chocolate gift hampers for all occasions.', null, true, 3),
('Vegan Delights', 'vegan-delights', 'Dairy-free premium vegan chocolate bars.', null, true, 4),
('Mini Bites', 'mini-bites', 'Bite-sized gourmet chocolate treats.', null, true, 5);

-- ── 2. SEED PRODUCTS ──────────────────────────────────────────────────────────
insert into public.products (category_id, name, slug, description, short_description, base_price, compare_at_price, sku, main_image, ingredients, allergens, weight, shelf_life, storage_instructions, stock_quantity, featured, active, is_customizable) values
(1, 'Classic Milk Silk', 'classic-milk-silk', 'Smooth Belgian couverture milk chocolate bar with a velvety finish.', 'Velvety smooth milk chocolate bar.', 299.00, 349.00, 'BAR-MILK-CLS', null, 'Sugar, Cocoa Butter, Whole Milk Powder, Cocoa Mass, Soy Lecithin', 'Milk, Soy', 80, '6 Months', 'Store in a cool, dry place between 15-20°C', 150, true, true, false),
(1, 'Dark Temptation 70%', 'dark-temptation-70', 'Rich, robust 70% dark chocolate bar with strong cocoa notes and fruit undertones.', 'Rich 70% bittersweet dark chocolate.', 349.00, 399.00, 'BAR-DARK-70', null, 'Cocoa Mass, Sugar, Cocoa Butter, Soy Lecithin', 'Soy', 80, '9 Months', 'Store in a cool, dry place between 15-20°C', 200, true, true, false),
(1, 'Velvet White & Vanilla', 'velvet-white-vanilla', 'Sweet, creamy white chocolate bar infused with Madagascar bourbon vanilla seeds.', 'Sweet creamy white chocolate with vanilla seeds.', 329.00, 379.00, 'BAR-WHITE-VAN', null, 'Sugar, Cocoa Butter, Whole Milk Powder, Bourbon Vanilla, Soy Lecithin', 'Milk, Soy', 80, '6 Months', 'Store in a cool, dry place between 15-20°C', 100, false, true, false),
(2, 'Design-Your-Own Bar', 'design-your-own-bar', 'Become a chocolate artist. Choose your base chocolate and custom top it with up to 5 gourmet ingredients of your choice.', 'Create your personalized custom chocolate bar.', 399.00, null, 'BAR-CUSTOM-BYO', null, 'Depends on selected options', 'May contain nuts, gluten, soy, milk', 100, '3 Months', 'Store in a cool, dry place between 15-18°C', 9999, true, true, true),
(3, 'Celebration Gift Assortment', 'celebration-gift-assortment', 'An elegant gift box containing an assortment of 12 premium handpicked chocolate truffles.', 'Premium truffles gift box (12 pcs).', 899.00, 999.00, 'GFT-TRF-12', null, 'Sugar, Cocoa Mass, Cocoa Butter, Milk Powder, Nuts, Natural Flavours', 'Milk, Soy, Tree Nuts', 240, '3 Months', 'Store in a cool, dry place between 15-18°C', 50, true, true, false),
(3, 'Luxury Corporate Hamper', 'luxury-corporate-hamper', 'A grand curation featuring 4 signature chocolate bars, a pouch of chocolate nuts, and a greetings card.', 'Grand chocolate gift hamper box.', 1499.00, 1699.00, 'GFT-HMP-LUX', null, 'Mixed ingredients', 'Milk, Soy, Tree Nuts, Gluten', 450, '3 Months', 'Store in a cool, dry place between 15-18°C', 30, false, true, false),
(4, 'Vegan Almond Dark', 'vegan-almond-dark', 'Dairy-free 55% dark chocolate bar studded with roasted California almonds and sea salt.', 'Vegan dark chocolate with roasted almonds.', 379.00, null, 'BAR-VEG-ALM', null, 'Cocoa Mass, Sugar, Cocoa Butter, Almonds, Sea Salt, Soy Lecithin', 'Tree Nuts, Soy', 80, '9 Months', 'Store in a cool, dry place between 15-20°C', 80, false, true, false),
(5, 'Salted Caramel Bites', 'salted-caramel-bites', 'Bite-sized milk chocolate shells filled with liquid salted caramel.', 'Milk chocolate bites with liquid salted caramel.', 249.00, 299.00, 'BIT-SLT-CAR', null, 'Sugar, Milk Powder, Cocoa Butter, Cocoa Mass, Liquid Caramel, Sea Salt', 'Milk, Soy', 100, '4 Months', 'Store in a cool, dry place between 15-18°C', 120, true, true, false);

-- ── 3. SEED PRODUCT IMAGES ───────────────────────────────────────────────────
-- Placeholders for future storage assets
insert into public.product_images (product_id, image_url, alt_text, sort_order) values
(1, 'placeholder_milk.jpg', 'Classic Milk Silk Chocolate Bar', 1),
(2, 'placeholder_dark.jpg', 'Dark Temptation 70% Chocolate Bar', 1),
(3, 'placeholder_white.jpg', 'Velvet White Bar', 1);

-- ── 4. SEED PRODUCT VARIANTS ─────────────────────────────────────────────────
insert into public.product_variants (product_id, name, description, price_modifier, sku, stock_quantity, weight, active, sort_order) values
(4, 'Standard Bar (100g)', 'Standard sized customized chocolate bar', 0.00, 'BAR-CUSTOM-BYO-ST', 9999, 100, true, 1),
(4, 'Large Bar (180g)', 'Extra large custom bar for sharing', 149.00, 'BAR-CUSTOM-BYO-LG', 9999, 180, true, 2),
(4, 'Giant Gifting Slab (300g)', 'Massive custom chocolate slab ideal for birthday or anniversary gifting', 349.00, 'BAR-CUSTOM-BYO-GT', 9999, 300, true, 3);

-- ── 5. SEED CHOCOLATE TYPES ──────────────────────────────────────────────────
insert into public.chocolate_types (name, slug, description, image_url, price_modifier, active, sort_order) values
('Milk Couverture (34% Cocoa)', 'milk-couverture', 'Creamy, sweet Belgian milk chocolate base.', null, 0.00, true, 1),
('Dark Couverture (70% Cocoa)', 'dark-couverture', 'Bittersweet, bold Belgian dark chocolate base.', null, 29.00, true, 2),
('White Couverture (28% Cocoa)', 'white-couverture', 'Sweet, buttery Belgian white chocolate base.', null, 19.00, true, 3);

-- ── 6. SEED TOPPINGS ─────────────────────────────────────────────────────────
insert into public.toppings (name, slug, description, image_url, price, category, max_quantity, active, sort_order) values
-- Nuts
('Roasted Almonds', 'roasted-almonds', 'Whole roasted almonds.', null, 40.00, 'nuts', 2, true, 1),
('Roasted Hazelnuts', 'roasted-hazelnuts', 'Crunchy Turkish hazelnuts.', null, 50.00, 'nuts', 2, true, 2),
('Salted Pistachios', 'salted-pistachios', 'Crushed Iranian salted pistachios.', null, 60.00, 'nuts', 1, true, 3),
('Cashew Halves', 'cashew-halves', 'Roasted cashew nut halves.', null, 40.00, 'nuts', 2, true, 4),
-- Fruits
('Dried Cranberries', 'dried-cranberries', 'Tart and sweet dried cranberries.', null, 30.00, 'fruits', 2, true, 5),
('Dehydrated Strawberries', 'dehydrated-strawberries', 'Premium sweet strawberry slices.', null, 45.00, 'fruits', 2, true, 6),
('Raisins', 'raisins', 'Sweet black raisins.', null, 25.00, 'fruits', 2, true, 7),
-- Crunch
('Oreo Crumbs', 'oreo-crumbs', 'Crushed chocolate Oreo biscuit pieces.', null, 30.00, 'crunch', 3, true, 8),
('Butterscotch Crumbles', 'butterscotch-crumbles', 'Sweet caramel butterscotch crunch.', null, 25.00, 'crunch', 3, true, 9),
('Salted Pretzel Bits', 'salted-pretzel-bits', 'Salty, crunchy pretzel pieces.', null, 35.00, 'crunch', 2, true, 10),
-- Sweets & Sprinkles
('Rainbow Sprinkles', 'rainbow-sprinkles', 'Colorful sugar sprinkles.', null, 20.00, 'sweets', 1, true, 11),
('Mini Marshmallows', 'mini-marshmallows', 'Soft, fluffy vanilla marshmallows.', null, 30.00, 'sweets', 2, true, 12),
('Chocolate Chips', 'chocolate-chips', 'Gourmet dark chocolate chips.', null, 30.00, 'sweets', 3, true, 13),
('Sea Salt Flakes', 'sea-salt-flakes', 'Maldon sea salt flakes.', null, 15.00, 'sweets', 1, true, 14),
('Edible Gold Flakes', 'edible-gold-flakes', 'Pure 24k edible gold dust flakes.', null, 120.00, 'sweets', 1, true, 15);

-- ── 7. SEED ADD-ONS ──────────────────────────────────────────────────────────
insert into public.addons (name, slug, description, image_url, price, active, sort_order) values
('Premium Gift Box', 'premium-gift-box', 'Hardbound chocolate brown slide box with gold foil lettering.', null, 99.00, true, 1),
('Personalised Greeting Card', 'personalized-greeting-card', 'A custom greeting card with your handprinted message.', null, 49.00, true, 2),
('Satin Ribbon Wrap', 'satin-ribbon-wrap', 'A beautiful gold satin ribbon wrapped around the box.', null, 29.00, true, 3),
('Insulated Cold Packaging', 'insulated-cold-packaging', 'Insulated gel-pad packaging to prevent chocolate melting.', null, 79.00, true, 4);

-- ── 8. SEED SETTINGS (STORE SETTINGS + FAQs + TESTIMONIALS) ──────────────────
insert into public.settings (key, value, description) values
('store_settings', '{
  "store_name": "COCOCRAFT",
  "currency": "INR",
  "shipping_threshold": 999.00,
  "default_shipping_fee": 99.00,
  "support_email": "hello@cococraft.in",
  "support_phone": "+91 98765 43210",
  "whatsapp": "919876543210",
  "instagram": "cococraft.in",
  "max_toppings": 5,
  "max_personalization_chars": 40
}'::jsonb, 'Central store settings and configurations.'),

('faqs', '[
  {"question": "How long will my custom chocolate order take to ship?", "answer": "Since each custom chocolate bar is made to order, it takes 24-48 hours to craft and temper, followed by 2-4 days in transit depending on your location in India."},
  {"question": "How do you prevent chocolate from melting during transit?", "answer": "We pack all orders in insulated bubble wrap along with reusable food-grade ice gel packs. We highly recommend adding our cold pack option at checkout for warm weather areas."},
  {"question": "Can I edit or cancel my custom order once it is placed?", "answer": "Customized bars go into production immediately after validation. You can cancel or modify your order within 2 hours of placement by contacting customer support."},
  {"question": "What chocolate base do you use?", "answer": "We use premium Belgian couverture chocolate made of pure cocoa butter and premium grade cocoa beans, ensuring superior melt and texture compared to compound chocolate."},
  {"question": "Are your chocolates gluten-free?", "answer": "Most of our bases (milk, dark, white) are gluten-free. However, certain toppings (like Oreos or pretzel bits) contain gluten. All chocolates are processed in a facility handling wheat, nuts, and dairy."},
  {"question": "Do you accept Cash on Delivery (COD)?", "answer": "Since our custom chocolates are personalized with names and custom toppings, we do not accept COD for custom bars. However, pre-made signature bars can be purchased via COD."},
  {"question": "Do you offer corporate or bulk discounts?", "answer": "Yes! We offer bulk corporate customization packaging and pricing. Please contact us at corporate@cococraft.in for quotes."},
  {"question": "Is the gold flake topping safe to eat?", "answer": "Yes, we use certified 24-karat edible gold leaf which is completely non-toxic, tasteless, and safe for consumption."},
  {"question": "How long can I store the custom chocolates?", "answer": "Our chocolate bars have a shelf life of 6-9 months. Bars with fresh nuts or soft fillings are best consumed within 3 months of crafting."},
  {"question": "Do you ship internationally?", "answer": "Currently, we only ship orders within India to preserve freshness and prevent transit melting."}
]'::jsonb, 'List of frequently asked questions.'),

('testimonials', '[
  {"name": "Priya Sharma", "role": "Gourmet Enthusiast", "rating": 5, "text": "The customizer is brilliant! I designed a dark chocolate bar with cranberries, hazelnuts, and gold flakes for my mother. She loved it! Beautifully packed."},
  {"name": "Rohan Mehta", "role": "Corporate Gifting Manager", "rating": 5, "text": "Ordered 150 luxury hampers with custom branding for our clients. Exceptional service, fast delivery in thermocol boxes, and delicious Belgian couverture."},
  {"name": "Ananya Sen", "role": "Reviewer", "rating": 4, "text": "Very premium chocolate quality. The dark couverture is perfectly bitter and smooth. Loved the greeting card touch."},
  {"name": "Vikram Adve", "role": "Customer", "rating": 5, "text": "Handcrafted to perfection. The salted pretzel crumbs and sea salt on milk chocolate base was the perfect combination. Definitely ordering again!"},
  {"name": "Meera Joshi", "role": "Designer", "rating": 5, "text": "COCOCRAFT is my new favorite gift option. It feels so personalized and premium. The gold lettering on the box looks very classy."},
  {"name": "Amit Patel", "role": "Chocoholic", "rating": 4, "text": "Excellent truffles. The caramel bites are rich. Packaging is highly protective."},
  {"name": "Siddhi Naik", "role": "Customer", "rating": 5, "text": "Loved the vegan options. The vegan almond dark bar is simply amazing! Hard to find good vegan chocolate this rich."},
  {"name": "Kabir Grover", "role": "Gift Giver", "rating": 5, "text": "I gifted a customized white chocolate bar with cookie crumbs and strawberries to my girlfriend. It arrived perfectly cold and not melted at all!"},
  {"name": "Neha Kapoor", "role": "Blogger", "rating": 4, "text": "A premium artisan feel. The branding is neat and the taste is authentic Belgian couverture chocolate."},
  {"name": "Rahul Verma", "role": "Tech Lead", "rating": 5, "text": "Excellent UI/UX. The preview builder made creating my custom bar super easy, and the delivery was on time."}
]'::jsonb, 'Customer review testimonials for social proof.');
