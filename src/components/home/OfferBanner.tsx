import Link from "next/link";

export function OfferBanner() {
  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
        <Link href="/products?category=electronics" className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-4 sm:p-6 text-white hover:shadow-xl transition-all hover:-translate-y-0.5">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-80">Limited Time</p>
          <h3 className="text-base sm:text-lg font-bold mt-1">Electronics Fest</h3>
          <p className="text-xs opacity-80">ইলেকট্রনিক্স উৎসব</p>
          <p className="text-xl sm:text-2xl font-bold mt-2">Up to 70% Off</p>
        </Link>
        <Link href="/products?category=fashion" className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 sm:p-6 text-white hover:shadow-xl transition-all hover:-translate-y-0.5">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-80">Trending Now</p>
          <h3 className="text-base sm:text-lg font-bold mt-1">Fashion Week</h3>
          <p className="text-xs opacity-80">ফ্যাশন উইক</p>
          <p className="text-xl sm:text-2xl font-bold mt-2">Min 40% Off</p>
        </Link>
        <Link href="/products?category=beauty" className="bg-gradient-to-br from-rose-400 to-red-600 rounded-xl p-4 sm:p-6 text-white hover:shadow-xl transition-all hover:-translate-y-0.5">
          <p className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider opacity-80">New Launch</p>
          <h3 className="text-base sm:text-lg font-bold mt-1">Beauty Deals</h3>
          <p className="text-xs opacity-80">বিউটি ডিল</p>
          <p className="text-xl sm:text-2xl font-bold mt-2">Flat 50% Off</p>
        </Link>
      </div>
    </div>
  );
}
