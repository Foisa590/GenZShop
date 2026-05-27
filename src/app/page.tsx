import { HeroBanner } from "@/components/home/HeroBanner";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { DealsSection } from "@/components/home/DealsSection";
import { FeaturedProducts } from "@/components/home/FeaturedProducts";
import { OfferBanner } from "@/components/home/OfferBanner";
import { getFeaturedProducts, getDealProducts } from "@/lib/supabase/queries";

export default async function HomePage() {
  let featuredProducts: any[] = [];
  let dealProducts: any[] = [];
  try {
    [featuredProducts, dealProducts] = await Promise.all([getFeaturedProducts(), getDealProducts()]);
  } catch (error) { console.log("Database not connected yet."); }
  return (
    <div className="space-y-4">
      <HeroBanner />
      <CategoryGrid />
      <DealsSection title="⚡ Deals of the Day" products={dealProducts} viewAllHref="/products?sort=discount" />
      <OfferBanner />
      <FeaturedProducts products={featuredProducts} />
      <section className="bg-white shadow-sm"><div className="max-w-7xl mx-auto px-4 py-8"><div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div className="flex flex-col items-center text-center"><div className="text-3xl mb-2">🚚</div><h3 className="text-sm font-semibold text-gray-800">Free Delivery</h3><p className="text-xs text-gray-500 mt-1">On orders above ₹499</p></div>
        <div className="flex flex-col items-center text-center"><div className="text-3xl mb-2">🔄</div><h3 className="text-sm font-semibold text-gray-800">Easy Returns</h3><p className="text-xs text-gray-500 mt-1">7-day return policy</p></div>
        <div className="flex flex-col items-center text-center"><div className="text-3xl mb-2">🛡️</div><h3 className="text-sm font-semibold text-gray-800">Secure Payment</h3><p className="text-xs text-gray-500 mt-1">100% secure checkout</p></div>
        <div className="flex flex-col items-center text-center"><div className="text-3xl mb-2">💬</div><h3 className="text-sm font-semibold text-gray-800">24/7 Support</h3><p className="text-xs text-gray-500 mt-1">Chat with us anytime</p></div>
      </div></div></section>
    </div>
  );
}
