import Link from "next/link";
import { LayoutDashboard, Package, ShoppingBag, Users, Settings } from "lucide-react";
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (<div className="min-h-screen flex">
    <aside className="w-64 bg-[#1e293b] text-white hidden md:block"><div className="p-6 border-b border-gray-700"><h1 className="text-lg font-bold">GenZShop Admin</h1></div><nav className="p-4 space-y-1"><Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 rounded-lg"><LayoutDashboard size={18} />Dashboard</Link><Link href="/admin/products" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 rounded-lg"><Package size={18} />Products</Link><Link href="/admin/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 rounded-lg"><ShoppingBag size={18} />Orders</Link><Link href="/admin/users" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/10 rounded-lg"><Users size={18} />Customers</Link><hr className="border-gray-700 my-4" /><Link href="/" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-400 hover:bg-white/10 rounded-lg"><Settings size={18} />Back to Store</Link></nav></aside>
    <main className="flex-1 bg-gray-100 overflow-auto"><div className="p-6">{children}</div></main>
  </div>);
}
