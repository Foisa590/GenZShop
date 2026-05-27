import Link from "next/link";
import { CATEGORIES } from "@/lib/constants";
export function CategoryGrid() {
  return (
    <section className="bg-white py-6 shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} href={`/products?category=${cat.slug}`} className="flex flex-col items-center group">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-gray-50 rounded-full flex items-center justify-center text-2xl md:text-3xl group-hover:bg-blue-50 group-hover:scale-110 transition-all duration-200">{cat.icon}</div>
              <span className="text-xs md:text-sm font-medium text-gray-700 mt-2 text-center group-hover:text-[#2874f0] transition-colors">{cat.name}</span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
