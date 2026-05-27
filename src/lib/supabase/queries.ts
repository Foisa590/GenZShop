import { createServerSupabaseClient } from "./server";
import { ProductFilters } from "@/types";

export async function getProducts(filters?: ProductFilters) {
  const supabase = await createServerSupabaseClient();
  let query = supabase.from("products").select("*");
  if (filters?.category) query = query.eq("category", filters.category);
  if (filters?.brand) query = query.eq("brand", filters.brand);
  if (filters?.minPrice) query = query.gte("price", filters.minPrice);
  if (filters?.maxPrice) query = query.lte("price", filters.maxPrice);
  if (filters?.rating) query = query.gte("rating", filters.rating);
  if (filters?.search) query = query.ilike("name", `%${filters.search}%`);
  switch (filters?.sortBy) {
    case "price_asc": query = query.order("price", { ascending: true }); break;
    case "price_desc": query = query.order("price", { ascending: false }); break;
    case "rating": query = query.order("rating", { ascending: false }); break;
    case "newest": query = query.order("created_at", { ascending: false }); break;
    case "discount": query = query.order("discount_percent", { ascending: false }); break;
    default: query = query.order("created_at", { ascending: false });
  }
  const page = filters?.page || 1;
  const limit = filters?.limit || 20;
  const from = (page - 1) * limit;
  query = query.range(from, from + limit - 1);
  const { data, error } = await query;
  if (error) { console.error("Error fetching products:", error); return []; }
  return data || [];
}

export async function getProductBySlug(slug: string) {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.from("products").select("*").eq("slug", slug).single();
  if (error) return null;
  return data;
}

export async function getFeaturedProducts() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("products").select("*").eq("is_featured", true).order("rating", { ascending: false }).limit(8);
  return data || [];
}

export async function getDealProducts() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("products").select("*").eq("is_deal", true).order("discount_percent", { ascending: false }).limit(10);
  return data || [];
}

export async function getCategories() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("categories").select("*").order("name");
  return data || [];
}

export async function getProductReviews(productId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("reviews").select("*").eq("product_id", productId).order("created_at", { ascending: false });
  return data || [];
}

export async function getUserOrders(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("orders").select("*, order_items(*)").eq("user_id", userId).order("created_at", { ascending: false });
  return data || [];
}

export async function getUserAddresses(userId: string) {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("addresses").select("*").eq("user_id", userId).order("is_default", { ascending: false });
  return data || [];
}

export async function getAllOrders() {
  const supabase = await createServerSupabaseClient();
  const { data } = await supabase.from("orders").select("*, order_items(*), profiles(full_name, email)").order("created_at", { ascending: false });
  return data || [];
}

export async function getAdminStats() {
  const supabase = await createServerSupabaseClient();
  const [products, orders, users] = await Promise.all([
    supabase.from("products").select("id", { count: "exact" }),
    supabase.from("orders").select("id, total_amount"),
    supabase.from("profiles").select("id", { count: "exact" }),
  ]);
  const totalRevenue = orders.data?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0;
  return { totalProducts: products.count || 0, totalOrders: orders.data?.length || 0, totalUsers: users.count || 0, totalRevenue };
}
