import Link from "next/link";
import { SITE_NAME } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-[#172337] text-gray-300 mt-8">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div><h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">About</h3><ul className="space-y-2 text-xs"><li><Link href="/about" className="hover:text-white transition-colors">Contact Us</Link></li><li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li><li><Link href="/about" className="hover:text-white transition-colors">Careers</Link></li></ul></div>
          <div><h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Help</h3><ul className="space-y-2 text-xs"><li><Link href="/about" className="hover:text-white transition-colors">Payments</Link></li><li><Link href="/about" className="hover:text-white transition-colors">Shipping</Link></li><li><Link href="/about" className="hover:text-white transition-colors">FAQ</Link></li></ul></div>
          <div><h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Policy</h3><ul className="space-y-2 text-xs"><li><Link href="/about" className="hover:text-white transition-colors">Return Policy</Link></li><li><Link href="/about" className="hover:text-white transition-colors">Terms Of Use</Link></li><li><Link href="/about" className="hover:text-white transition-colors">Privacy</Link></li></ul></div>
          <div><h3 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">Connect</h3><ul className="space-y-2 text-xs"><li><a href="#" className="hover:text-white transition-colors">Facebook</a></li><li><a href="#" className="hover:text-white transition-colors">Instagram</a></li><li><a href="#" className="hover:text-white transition-colors">YouTube</a></li></ul></div>
        </div>
        <hr className="border-gray-600 my-8" />
        <p className="text-xs text-gray-500 text-center">© {new Date().getFullYear()} {SITE_NAME}. All rights reserved.</p>
      </div>
    </footer>
  );
}
