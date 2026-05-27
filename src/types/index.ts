export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number;
  discount_percent: number;
  category: string;
  brand: string;
  images: string[];
  rating: number;
  rating_count: number;
  stock: number;
  is_featured: boolean;
  is_deal: boolean;
  specifications: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description: string;
  product_count: number;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  avatar_url: string;
  role: 'customer' | 'admin';
  created_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2: string;
  city: string;
  state: string;
  pincode: string;
  is_default: boolean;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  shipping_address: Address;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method: string;
  payment_status: 'pending' | 'paid' | 'failed';
  tracking_id: string;
  created_at: string;
  updated_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string;
  quantity: number;
  price: number;
}

export interface Review {
  id: string;
  user_id: string;
  product_id: string;
  rating: number;
  title: string;
  comment: string;
  user_name: string;
  created_at: string;
}

export interface WishlistItem {
  id: string;
  user_id: string;
  product_id: string;
  product: Product;
  created_at: string;
}

export interface ProductFilters {
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'discount';
  search?: string;
  page?: number;
  limit?: number;
}
