import Link from "next/link";
import { User, Package, MapPin, LogOut, Heart } from "lucide-react";
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-4"><div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <aside className="md:col-span-1"><div className="bg-white rounded-sm shadow-sm sticky top-20 overflow-hidden"><div className="bg-[#2874f0] p-4 text-white"><p className="text-sm font-semibold">My Account</p></div><nav className="p-2">
        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2874f0] rounded"><User size={18} />My Profile</Link>
        <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2874f0] rounded"><Package size={18} />My Orders</Link>
        <Link href="/dashboard/addresses" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2874f0] rounded"><MapPin size={18} />Addresses</Link>
        <Link href="/wishlist" className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-blue-50 hover:text-[#2874f0] rounded"><Heart size={18} />Wishlist</Link>
        <hr className="my-2" /><Link href="/logout" className="flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 rounded"><LogOut size={18} />Logout</Link>
      </nav></div></aside>
      <main className="md:col-span-3">{children}</main>
    </div></div>
  );
}
