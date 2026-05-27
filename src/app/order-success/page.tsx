"use client";
import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { CheckCircle, Package, Home } from "lucide-react";
export default function OrderSuccessPage() { return <Suspense fallback={<div />}><Content /></Suspense>; }
function Content() {
  const searchParams = useSearchParams(); const orderId = searchParams.get("id");
  return (<div className="min-h-[70vh] flex items-center justify-center px-4 py-8"><div className="text-center max-w-md">
    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><CheckCircle size={48} className="text-green-500" /></div>
    <h1 className="text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h1>
    <p className="text-gray-600 mb-2">Thank you for your purchase.</p>
    {orderId && <p className="text-sm text-gray-500 mb-6">Order ID: {orderId.substring(0, 8)}...</p>}
    <div className="flex flex-col sm:flex-row gap-3 justify-center"><Link href="/dashboard/orders"><Button><Package size={16} /> View Orders</Button></Link><Link href="/"><Button variant="outline"><Home size={16} /> Continue Shopping</Button></Link></div>
  </div></div>);
}
