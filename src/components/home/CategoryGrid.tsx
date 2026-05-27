import Link from "next/link";

const CATEGORIES = [
  { name: "Electronics", banglaName: "ইলেকট্রনিক্স", slug: "electronics", icon: "📱", color: "from-blue-100 to-blue-200" },
  { name: "Fashion", banglaName: "ফ্যাশন", slug: "fashion", icon: "👕", color: "from-pink-100 to-pink-200" },
  { name: "Home", banglaName: "ঘর", slug: "home-living", icon: "🏠", color: "from-amber-100 to-amber-200" },
  { name: "Beauty", banglaName: "বিউটি", slug: "beauty", icon: "💄", color: "from-rose-100 to-rose-200" },
  { name: "Sports", banglaName: "খেলাধুলা", slug: "sports", icon: "⚽", color: "from-green-100 to-green-200" },
  { name: "Books", banglaName: "বই", slug: "books", icon: "📚", color: "from-purple-100 to-purple-200" },
  { name: "Toys", banglaName: "খেলনা", slug: "toys-games", icon: "🎮", color: "from-indigo-100 to-indigo-200" },
  { name: "Grocery", banglaName: "মুদি", slug: "groceries", icon: "🛒", color: "from-emerald-100 to-emerald-200" },
];

export function CategoryGrid() {
  return (
    <section className="bg-white py-4 sm:py-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="mb-3 sm:hidden">
          <h2 className="text-sm font-bold text-gray-900">Shop by Category</h2>
          <p className="text-[10px] text-gray-500">ক্যাটাগরি অনুযায়ী কিনুন</p>
        </div>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3 sm:gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="flex flex-col items-center group">
              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-gradient-to-br ${cat.color} rounded-2xl flex items-center justify-center text-xl sm:text-2xl md:text-3xl group-hover:scale-110 transition-all duration-200 shadow-sm`}>
                {cat.icon}
              </div>
              <span className="text-[11px] sm:text-xs md:text-sm font-medium text-gray-700 mt-1.5 sm:mt-2 text-center group-hover:text-[#2874f0]">
                {cat.name}
              </span>
              <span className="text-[9px] sm:text-[10px] text-gray-400 leading-tight">{cat.banglaName}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
