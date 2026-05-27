-- ============================================
-- GenZShop - Supabase Database Schema
-- Complete e-commerce database setup
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. PROFILES TABLE (extends auth.users)
-- ============================================
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  phone TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. AUTO-CREATE PROFILE ON SIGNUP TRIGGER
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- ============================================
-- 3. CATEGORIES TABLE
-- ============================================
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  image TEXT,
  description TEXT,
  product_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. PRODUCTS TABLE
-- ============================================
CREATE TABLE public.products (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount_percent INTEGER DEFAULT 0,
  category TEXT NOT NULL,
  brand TEXT,
  images TEXT[] DEFAULT '{}',
  rating DECIMAL(2,1) DEFAULT 0.0,
  rating_count INTEGER DEFAULT 0,
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_deal BOOLEAN DEFAULT FALSE,
  specifications JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- 5. ADDRESSES TABLE
-- ============================================
CREATE TABLE public.addresses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address_line1 TEXT NOT NULL,
  address_line2 TEXT,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  pincode TEXT NOT NULL,
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 6. ORDERS TABLE
-- ============================================
CREATE TABLE public.orders (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  shipping_address JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  payment_method TEXT,
  payment_status TEXT DEFAULT 'pending',
  tracking_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);


-- ============================================
-- 7. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE public.order_items (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. REVIEWS TABLE
-- ============================================
CREATE TABLE public.reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  user_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 9. WISHLIST TABLE
-- ============================================
CREATE TABLE public.wishlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);


-- ============================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- PROFILES policies
CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- CATEGORIES policies
CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert categories"
  ON public.categories FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update categories"
  ON public.categories FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete categories"
  ON public.categories FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );


-- PRODUCTS policies
CREATE POLICY "Products are viewable by everyone"
  ON public.products FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert products"
  ON public.products FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update products"
  ON public.products FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete products"
  ON public.products FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ADDRESSES policies
CREATE POLICY "Users can view their own addresses"
  ON public.addresses FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own addresses"
  ON public.addresses FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own addresses"
  ON public.addresses FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own addresses"
  ON public.addresses FOR DELETE
  USING (auth.uid() = user_id);


-- ORDERS policies
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update any order"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ORDER ITEMS policies
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND (orders.user_id = auth.uid() OR EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin'))
    )
  );

CREATE POLICY "Users can insert their own order items"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- REVIEWS policies
CREATE POLICY "Reviews are viewable by everyone"
  ON public.reviews FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON public.reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON public.reviews FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON public.reviews FOR DELETE
  USING (auth.uid() = user_id);


-- WISHLIST policies
CREATE POLICY "Users can view their own wishlist"
  ON public.wishlist FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add to their own wishlist"
  ON public.wishlist FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove from their own wishlist"
  ON public.wishlist FOR DELETE
  USING (auth.uid() = user_id);

-- ============================================
-- 11. PERFORMANCE INDEXES
-- ============================================
CREATE INDEX idx_products_category ON public.products(category);
CREATE INDEX idx_products_brand ON public.products(brand);
CREATE INDEX idx_products_price ON public.products(price);
CREATE INDEX idx_products_rating ON public.products(rating DESC);
CREATE INDEX idx_products_slug ON public.products(slug);
CREATE INDEX idx_products_is_featured ON public.products(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_products_is_deal ON public.products(is_deal) WHERE is_deal = TRUE;
CREATE INDEX idx_orders_user_id ON public.orders(user_id);
CREATE INDEX idx_orders_status ON public.orders(status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX idx_order_items_product_id ON public.order_items(product_id);
CREATE INDEX idx_reviews_product_id ON public.reviews(product_id);
CREATE INDEX idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX idx_wishlist_user_id ON public.wishlist(user_id);
CREATE INDEX idx_wishlist_product_id ON public.wishlist(product_id);
CREATE INDEX idx_addresses_user_id ON public.addresses(user_id);
CREATE INDEX idx_categories_slug ON public.categories(slug);


-- ============================================
-- 12. SEED DATA - CATEGORIES
-- ============================================
INSERT INTO public.categories (name, slug, image, description, product_count) VALUES
('Electronics', 'electronics', 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400', 'Smartphones, laptops, audio gear and more', 5),
('Fashion', 'fashion', 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400', 'Trending styles for men and women', 3),
('Home & Living', 'home-living', 'https://images.unsplash.com/photo-1616486338812-3dadae5b4ace?w=400', 'Furniture, decor and smart home essentials', 2),
('Beauty', 'beauty', 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=400', 'Skincare, makeup and personal care', 1),
('Sports', 'sports', 'https://images.unsplash.com/photo-1461896836934-bd45ba688b23?w=400', 'Fitness equipment, sportswear and accessories', 2),
('Books', 'books', 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400', 'Bestsellers, self-help and academic books', 1),
('Toys & Games', 'toys-games', 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400', 'Gaming consoles, board games and toys', 1),
('Groceries', 'groceries', 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400', 'Fresh produce, snacks and daily essentials', 0);


-- ============================================
-- 13. SEED DATA - PRODUCTS
-- ============================================

-- Electronics
INSERT INTO public.products (name, slug, description, price, original_price, discount_percent, category, brand, images, rating, rating_count, stock, is_featured, is_deal, specifications) VALUES
(
  'iPhone 15 Pro Max',
  'iphone-15-pro-max',
  'The most powerful iPhone ever with A17 Pro chip, titanium design, and a 48MP camera system. Features USB-C, Action Button, and up to 29 hours of video playback.',
  134900.00,
  144900.00,
  7,
  'Electronics',
  'Apple',
  ARRAY['https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600', 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?w=600'],
  4.8,
  2847,
  45,
  TRUE,
  FALSE,
  '{"Display": "6.7-inch Super Retina XDR OLED", "Processor": "A17 Pro Bionic", "RAM": "8 GB", "Storage": "256 GB", "Camera": "48MP + 12MP + 12MP", "Battery": "4422 mAh", "OS": "iOS 17", "Connectivity": "5G, Wi-Fi 6E, USB-C"}'::jsonb
),
(
  'Samsung Galaxy S24 Ultra',
  'samsung-galaxy-s24-ultra',
  'Galaxy AI is here. The ultimate smartphone with built-in AI, a stunning 200MP camera, S Pen, and titanium frame. Powered by Snapdragon 8 Gen 3.',
  129999.00,
  144999.00,
  10,
  'Electronics',
  'Samsung',
  ARRAY['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600', 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600'],
  4.7,
  1923,
  62,
  TRUE,
  TRUE,
  '{"Display": "6.8-inch Dynamic AMOLED 2X", "Processor": "Snapdragon 8 Gen 3", "RAM": "12 GB", "Storage": "256 GB", "Camera": "200MP + 50MP + 12MP + 10MP", "Battery": "5000 mAh", "OS": "Android 14 + One UI 6.1", "Connectivity": "5G, Wi-Fi 7, S Pen"}'::jsonb
);


INSERT INTO public.products (name, slug, description, price, original_price, discount_percent, category, brand, images, rating, rating_count, stock, is_featured, is_deal, specifications) VALUES
(
  'MacBook Air M3 15-inch',
  'macbook-air-m3-15',
  'Supercharged by the M3 chip. The remarkably thin 15-inch MacBook Air with Liquid Retina display, 18 hours of battery life, and blazing-fast performance.',
  139900.00,
  154900.00,
  10,
  'Electronics',
  'Apple',
  ARRAY['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600', 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=600'],
  4.9,
  1456,
  30,
  TRUE,
  TRUE,
  '{"Display": "15.3-inch Liquid Retina", "Processor": "Apple M3 (8-core CPU, 10-core GPU)", "RAM": "8 GB Unified Memory", "Storage": "256 GB SSD", "Battery": "Up to 18 hours", "Weight": "1.51 kg", "Ports": "MagSafe, 2x Thunderbolt/USB 4, 3.5mm jack", "OS": "macOS Sonoma"}'::jsonb
),
(
  'Sony WH-1000XM5 Headphones',
  'sony-wh-1000xm5',
  'Industry-leading noise cancellation with Auto NC Optimizer. Crystal clear hands-free calling with 4 beamforming microphones. Up to 30 hours battery life.',
  24990.00,
  34990.00,
  29,
  'Electronics',
  'Sony',
  ARRAY['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600', 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600'],
  4.6,
  3421,
  120,
  FALSE,
  TRUE,
  '{"Type": "Over-ear Wireless", "Driver": "30mm", "Noise Cancellation": "Adaptive ANC", "Battery": "30 hours", "Connectivity": "Bluetooth 5.2, 3.5mm", "Weight": "250g", "Codec": "LDAC, AAC, SBC", "Features": "Multipoint, Speak-to-Chat, DSEE Extreme"}'::jsonb
),
(
  'boAt Rockerz 550 Headphones',
  'boat-rockerz-550',
  'Immersive 50mm drivers with Bluetooth v5.0. Features physical noise isolation, dual connectivity modes, and a foldable ergonomic design. 20 hours playback.',
  1799.00,
  3990.00,
  55,
  'Electronics',
  'boAt',
  ARRAY['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 'https://images.unsplash.com/photo-1487215078519-e21cc028cb29?w=600'],
  4.2,
  18742,
  500,
  FALSE,
  TRUE,
  '{"Type": "Over-ear Wireless", "Driver": "50mm", "Battery": "20 hours", "Connectivity": "Bluetooth 5.0, AUX", "Weight": "210g", "Charging": "USB Type-C", "Features": "Foldable, Physical Noise Isolation, Padded Ear Cushions"}'::jsonb
);


-- Fashion
INSERT INTO public.products (name, slug, description, price, original_price, discount_percent, category, brand, images, rating, rating_count, stock, is_featured, is_deal, specifications) VALUES
(
  'Nike Air Max 270 React',
  'nike-air-max-270-react',
  'Combining two of Nike''s best cushioning technologies - Max Air and React foam - for an impossibly soft ride. Features a sleek lifestyle design with breathable mesh upper.',
  12995.00,
  15995.00,
  19,
  'Fashion',
  'Nike',
  ARRAY['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600', 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600'],
  4.5,
  892,
  75,
  TRUE,
  FALSE,
  '{"Type": "Lifestyle/Running", "Upper": "Breathable Mesh + Synthetic", "Sole": "Max Air 270 + React Foam", "Closure": "Lace-up", "Weight": "310g (UK 9)", "Sizes Available": "UK 6-12", "Color": "Black/White/Hyper Blue"}'::jsonb
),
(
  'Levi''s 511 Slim Fit Jeans',
  'levis-511-slim-fit-jeans',
  'The 511 Slim Fit sits below the waist with a slim leg from hip to ankle. Made with stretch denim for all-day comfort. Classic five-pocket styling.',
  3299.00,
  4599.00,
  28,
  'Fashion',
  'Levi''s',
  ARRAY['https://images.unsplash.com/photo-1542272604-787c3835535d?w=600', 'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600'],
  4.4,
  2156,
  200,
  FALSE,
  TRUE,
  '{"Fit": "Slim (511)", "Material": "98% Cotton, 2% Elastane", "Rise": "Mid Rise", "Leg Opening": "14 inches", "Wash": "Dark Indigo", "Sizes Available": "28-40 waist", "Care": "Machine wash cold"}'::jsonb
),
(
  'Urban Oversized Drop Shoulder T-Shirt',
  'urban-oversized-tshirt',
  'Premium 240 GSM cotton oversized t-shirt with drop shoulders. Perfect streetwear essential with a relaxed boxy fit. Pre-shrunk and enzyme washed for a vintage feel.',
  799.00,
  1499.00,
  47,
  'Fashion',
  'Bewakoof',
  ARRAY['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600', 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600'],
  4.3,
  5678,
  350,
  FALSE,
  TRUE,
  '{"Material": "100% Cotton (240 GSM)", "Fit": "Oversized Drop Shoulder", "Neck": "Round Neck", "Sleeve": "Half Sleeve", "Wash": "Enzyme Washed", "Sizes Available": "S, M, L, XL, XXL", "Color": "Sage Green"}'::jsonb
);


-- Home & Living
INSERT INTO public.products (name, slug, description, price, original_price, discount_percent, category, brand, images, rating, rating_count, stock, is_featured, is_deal, specifications) VALUES
(
  'IKEA KALLAX Shelf Unit',
  'ikea-kallax-shelf-unit',
  'Versatile shelving unit that works as a room divider, sideboard, or storage wall. Each cube fits IKEA KALLAX inserts for customized storage. Durable particleboard with honeycomb structure.',
  7990.00,
  9990.00,
  20,
  'Home & Living',
  'IKEA',
  ARRAY['https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600'],
  4.5,
  743,
  40,
  FALSE,
  FALSE,
  '{"Dimensions": "147 x 77 x 39 cm", "Material": "Particleboard, Honeycomb paper filling", "Cubes": "8 (4x2)", "Max Load per Shelf": "13 kg", "Color": "White", "Assembly": "Self-assembly required", "Wall Mount": "Tip-over restraint included"}'::jsonb
),
(
  'Dreame L10s Ultra Robot Vacuum',
  'dreame-l10s-ultra-robot-vacuum',
  'Fully automated robot vacuum and mop with self-cleaning mop pads, auto-empty dustbin, and hot water washing. LiDAR navigation with 3D obstacle avoidance. 5300Pa suction.',
  49999.00,
  69999.00,
  29,
  'Home & Living',
  'Dreame',
  ARRAY['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600', 'https://images.unsplash.com/photo-1603796846097-bee99e4a601f?w=600'],
  4.6,
  567,
  25,
  TRUE,
  TRUE,
  '{"Suction Power": "5300Pa", "Navigation": "LiDAR + 3D Structured Light", "Battery": "5200 mAh (210 min)", "Dustbin": "350ml (Auto-Empty)", "Water Tank": "80ml (Auto-Refill)", "Noise Level": "65 dB", "Features": "Hot water mop cleaning, AI obstacle avoidance, Multi-floor mapping", "App Control": "Dreamehome (iOS/Android)"}'::jsonb
);


-- Beauty
INSERT INTO public.products (name, slug, description, price, original_price, discount_percent, category, brand, images, rating, rating_count, stock, is_featured, is_deal, specifications) VALUES
(
  'The Ordinary Niacinamide 10% + Zinc 1%',
  'the-ordinary-niacinamide-serum',
  'High-strength vitamin and mineral formula to reduce the appearance of blemishes and congestion. Water-based serum suitable for all skin types. Cruelty-free and vegan.',
  590.00,
  750.00,
  21,
  'Beauty',
  'The Ordinary',
  ARRAY['https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600', 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=600'],
  4.4,
  8934,
  300,
  FALSE,
  FALSE,
  '{"Volume": "30ml", "Key Ingredients": "Niacinamide 10%, Zinc PCA 1%", "Skin Type": "All skin types", "Concerns": "Blemishes, Oiliness, Pores", "Texture": "Lightweight Water-based Serum", "Usage": "AM and PM", "Free From": "Alcohol, Silicone, Oil, Parabens", "Cruelty Free": "Yes, Vegan"}'::jsonb
);

-- Sports
INSERT INTO public.products (name, slug, description, price, original_price, discount_percent, category, brand, images, rating, rating_count, stock, is_featured, is_deal, specifications) VALUES
(
  'Kore PVC 16 Kg Dumbbell Set',
  'kore-pvc-16kg-dumbbell-set',
  'Complete home gym dumbbell set with 16 kg PVC weight plates, 2 dumbbell rods with spin locks. Ideal for beginners and intermediate fitness enthusiasts. Anti-slip grip for safe workouts.',
  1499.00,
  2999.00,
  50,
  'Sports',
  'Kore',
  ARRAY['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=600'],
  4.1,
  4523,
  180,
  FALSE,
  TRUE,
  '{"Total Weight": "16 kg", "Plates": "2kg x 4, 2kg x 4", "Rod Length": "14 inches", "Material": "PVC coated cement", "Grip": "Anti-slip rubber", "Locks": "Star-shaped spin locks", "Includes": "2 Rods, 8 Plates, 4 Locks"}'::jsonb
),
(
  'Boldfit Yoga Mat 6mm',
  'boldfit-yoga-mat-6mm',
  'Premium anti-skid yoga mat with alignment lines. Made from eco-friendly TPE material with dual texture for grip and cushioning. Includes carrying strap. Perfect for yoga, pilates, and floor exercises.',
  999.00,
  1999.00,
  50,
  'Sports',
  'Boldfit',
  ARRAY['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600', 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600'],
  4.3,
  3267,
  250,
  FALSE,
  FALSE,
  '{"Thickness": "6mm", "Material": "Eco-friendly TPE", "Dimensions": "183 x 61 cm", "Weight": "800g", "Features": "Anti-skid, Alignment lines, Dual texture", "Includes": "Carrying strap", "Care": "Wipe clean with damp cloth", "Color": "Navy Blue/Grey"}'::jsonb
);


-- Books
INSERT INTO public.products (name, slug, description, price, original_price, discount_percent, category, brand, images, rating, rating_count, stock, is_featured, is_deal, specifications) VALUES
(
  'Atomic Habits by James Clear',
  'atomic-habits-james-clear',
  'The #1 New York Times bestseller. A revolutionary guide to building good habits and breaking bad ones. James Clear reveals practical strategies that will teach you how to form good habits and break bad ones.',
  399.00,
  699.00,
  43,
  'Books',
  'Penguin Random House',
  ARRAY['https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=600', 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=600'],
  4.7,
  12456,
  500,
  TRUE,
  TRUE,
  '{"Author": "James Clear", "Publisher": "Penguin Random House", "Pages": "320", "Language": "English", "Format": "Paperback", "ISBN": "978-0735211292", "Genre": "Self-Help / Productivity", "Edition": "International Edition"}'::jsonb
);

-- Toys & Games
INSERT INTO public.products (name, slug, description, price, original_price, discount_percent, category, brand, images, rating, rating_count, stock, is_featured, is_deal, specifications) VALUES
(
  'PlayStation 5 Console (Slim)',
  'playstation-5-slim',
  'Experience lightning-fast loading with an ultra-high speed SSD. Deeper immersion with haptic feedback, adaptive triggers, and 3D Audio. The PS5 Slim is 30% smaller with 1TB storage.',
  49990.00,
  54990.00,
  9,
  'Toys & Games',
  'Sony',
  ARRAY['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600', 'https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600'],
  4.8,
  6789,
  35,
  TRUE,
  FALSE,
  '{"Storage": "1 TB SSD", "CPU": "AMD Zen 2 (8 cores, 3.5 GHz)", "GPU": "AMD RDNA 2 (10.28 TFLOPS)", "RAM": "16 GB GDDR6", "Resolution": "Up to 4K @ 120fps", "Ray Tracing": "Yes", "Disc Drive": "4K UHD Blu-ray", "Connectivity": "Wi-Fi 6, Bluetooth 5.1, HDMI 2.1", "Includes": "DualSense Controller, HDMI Cable, USB-C Cable"}'::jsonb
);

-- ============================================
-- END OF SCHEMA
-- ============================================
