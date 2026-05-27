import { getProducts, getCategories } from "@/lib/supabase/queries";
import { ProductFilters } from "@/types";
import { ProductGrid } from "./ProductGrid";
import { FilterSidebar } from "./FilterSidebar";

interface Props { searchParams: Promise<{ category?: string; brand?: string; minPrice?: string; maxPrice?: string; rating?: string; sort?: string; search?: string; page?: string; }>; }

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const filters: ProductFilters = { category: params.category, brand: params.brand, minPrice: params.minPrice ? Number(params.minPrice) : undefined, maxPrice: params.maxPrice ? Number(params.maxPrice) : undefined, rating: params.rating ? Number(params.rating) : undefined, sortBy: (params.sort as ProductFilters["sortBy"]) || undefined, search: params.search, page: params.page ? Number(params.page) : 1, limit: 20 };
  let products: any[] = []; let categories: any[] = [];
  try { [products, categories] = await Promise.all([getProducts(filters), getCategories()]); } catch { console.log("DB not connected."); }
  const pageTitle = params.search ? `Search results for "${params.search}"` : params.category ? `${params.category.charAt(0).toUpperCase() + params.category.slice(1).replace("-", " & ")}` : "All Products";
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="text-sm text-gray-500 mb-4"><span>Home</span><span className="mx-2">/</span><span className="text-gray-800 font-medium">{pageTitle}</span></div>
      <div className="flex gap-6">
        <FilterSidebar categories={categories} currentFilters={params} />
        <div className="flex-1">
          <div className="bg-white p-4 rounded-sm shadow-sm mb-4"><h1 className="text-lg font-bold text-gray-900">{pageTitle}</h1><p className="text-xs text-gray-500 mt-1">Showing {products.length} results</p></div>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
