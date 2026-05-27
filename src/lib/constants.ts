export const SITE_NAME = "GenZShop";
export const SITE_DESCRIPTION = "India's Trendiest Online Shopping Destination";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const CATEGORIES = [
  { name: "Electronics", slug: "electronics", icon: "📱", image: "/categories/electronics.jpg" },
  { name: "Fashion", slug: "fashion", icon: "👕", image: "/categories/fashion.jpg" },
  { name: "Home & Living", slug: "home-living", icon: "🏠", image: "/categories/home.jpg" },
  { name: "Beauty", slug: "beauty", icon: "💄", image: "/categories/beauty.jpg" },
  { name: "Sports", slug: "sports", icon: "⚽", image: "/categories/sports.jpg" },
  { name: "Books", slug: "books", icon: "📚", image: "/categories/books.jpg" },
  { name: "Toys & Games", slug: "toys-games", icon: "🎮", image: "/categories/toys.jpg" },
  { name: "Groceries", slug: "groceries", icon: "🛒", image: "/categories/groceries.jpg" },
];

export const SORT_OPTIONS = [
  { label: "Relevance", value: "" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Rating", value: "rating" },
  { label: "Newest First", value: "newest" },
  { label: "Discount", value: "discount" },
];

export const ORDER_STATUSES = {
  pending: { label: "Order Placed", color: "text-yellow-600", bg: "bg-yellow-50" },
  confirmed: { label: "Confirmed", color: "text-blue-600", bg: "bg-blue-50" },
  shipped: { label: "Shipped", color: "text-purple-600", bg: "bg-purple-50" },
  delivered: { label: "Delivered", color: "text-green-600", bg: "bg-green-50" },
  cancelled: { label: "Cancelled", color: "text-red-600", bg: "bg-red-50" },
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Electronics", href: "/products?category=electronics" },
  { label: "Fashion", href: "/products?category=fashion" },
  { label: "Home & Living", href: "/products?category=home-living" },
  { label: "Beauty", href: "/products?category=beauty" },
  { label: "Sports", href: "/products?category=sports" },
];
