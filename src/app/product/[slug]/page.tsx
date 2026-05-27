import { getProductBySlug, getProductReviews } from "@/lib/supabase/queries";
import { notFound } from "next/navigation";
import { ProductImages } from "./ProductImages";
import { ProductInfo } from "./ProductInfo";
import { ReviewSection } from "./ReviewSection";
import type { Metadata } from "next";

interface Props { params: Promise<{ slug: string }>; }
export async function generateMetadata({ params }: Props): Promise<Metadata> { const { slug } = await params; let product = null; try { product = await getProductBySlug(slug); } catch {} return { title: product?.name || "Product", description: product?.description?.substring(0, 160) || "" }; }

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  let product = null; let reviews: any[] = [];
  try { product = await getProductBySlug(slug); if (product) reviews = await getProductReviews(product.id); } catch {}
  if (!product) notFound();
  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="text-sm text-gray-500 mb-4"><a href="/" className="hover:text-[#2874f0]">Home</a><span className="mx-2">/</span><a href={`/products?category=${product.category}`} className="hover:text-[#2874f0] capitalize">{product.category.replace("-", " & ")}</a><span className="mx-2">/</span><span className="text-gray-800">{product.name}</span></div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ProductImages images={product.images} name={product.name} />
        <ProductInfo product={product} />
      </div>
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <section className="bg-white rounded-sm shadow-sm mt-6 p-6"><h2 className="text-lg font-bold text-gray-900 mb-4">Specifications</h2><div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">{Object.entries(product.specifications).map(([key, value]) => <div key={key} className="flex border-b border-gray-100 pb-2"><span className="text-sm text-gray-500 w-40 flex-shrink-0">{key}</span><span className="text-sm text-gray-800 font-medium">{value as string}</span></div>)}</div></section>
      )}
      <ReviewSection reviews={reviews} product={product} />
    </div>
  );
}
