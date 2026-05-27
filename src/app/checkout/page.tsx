"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { MapPin, CreditCard, Check, Plus, ShoppingBag, Shield } from "lucide-react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, getTotalSavings, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [newAddr, setNewAddr] = useState({ full_name: "", phone: "", address_line1: "", city: "", state: "", pincode: "" });
  const [showNew, setShowNew] = useState(false);
  const totalPrice = getTotalPrice(); const totalSavings = getTotalSavings();
  const deliveryFee = totalPrice >= 499 ? 0 : 40; const finalAmount = totalPrice + deliveryFee;

  useEffect(() => { (async () => { try { const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) { router.push("/login?redirect=/checkout"); return; } const { data } = await supabase.from("addresses").select("*").eq("user_id", user.id).order("is_default", { ascending: false }); setAddresses(data || []); if (data && data.length > 0) setSelectedAddress(data[0]); } catch {} finally { setLoading(false); } })(); }, [router]);

  const saveNewAddr = async () => { try { const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return; const { data } = await supabase.from("addresses").insert({ ...newAddr, address_line2: "", user_id: user.id, is_default: addresses.length === 0 }).select().single(); if (data) { setAddresses([...addresses, data]); setSelectedAddress(data); setShowNew(false); toast.success("Address saved!"); } } catch { toast.error("Failed"); } };

  const placeOrder = async () => { if (!selectedAddress) { toast.error("Select address"); return; } setPlacing(true); try { const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return; const { data: order, error } = await supabase.from("orders").insert({ user_id: user.id, total_amount: finalAmount, shipping_address: selectedAddress, status: "pending", payment_method: paymentMethod, payment_status: paymentMethod === "cod" ? "pending" : "paid" }).select().single(); if (error) throw error; await supabase.from("order_items").insert(items.map((i) => ({ order_id: order.id, product_id: i.product.id, product_name: i.product.name, product_image: i.product.images[0] || "", quantity: i.quantity, price: i.product.price }))); clearCart(); toast.success("Order placed!"); router.push(`/order-success?id=${order.id}`); } catch { toast.error("Failed to place order"); } finally { setPlacing(false); } };

  if (items.length === 0) return <div className="max-w-4xl mx-auto px-4 py-8"><EmptyState icon={<ShoppingBag size={80} className="text-gray-300" />} title="Cart is empty" description="Add products first." actionLabel="Shop Now" actionHref="/products" /></div>;
  if (loading) return <div className="max-w-5xl mx-auto px-4 py-8"><div className="bg-white rounded-sm shadow-sm p-8 animate-pulse"><div className="h-6 w-48 bg-gray-200 rounded" /></div></div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="bg-white rounded-sm shadow-sm p-4 mb-6"><div className="flex items-center justify-center gap-2">{[{n:1,l:"Address",i:MapPin},{n:2,l:"Payment",i:CreditCard},{n:3,l:"Review",i:Check}].map((s,i) => <div key={s.n} className="flex items-center"><button onClick={() => s.n < step && setStep(s.n)} className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${step >= s.n ? "bg-[#2874f0] text-white" : "bg-gray-100 text-gray-500"}`}><s.i size={16} /><span className="hidden sm:inline">{s.l}</span></button>{i < 2 && <div className={`w-8 md:w-16 h-0.5 mx-1 ${step > s.n ? "bg-[#2874f0]" : "bg-gray-200"}`} />}</div>)}</div></div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {step === 1 && <div className="bg-white rounded-sm shadow-sm p-6"><h2 className="text-lg font-bold mb-4">Select Address</h2>{addresses.map((a) => <label key={a.id} className={`flex items-start gap-3 p-4 border rounded mb-3 cursor-pointer ${selectedAddress?.id === a.id ? "border-[#2874f0] bg-blue-50" : "border-gray-200"}`}><input type="radio" checked={selectedAddress?.id === a.id} onChange={() => setSelectedAddress(a)} /><div><p className="font-semibold text-sm">{a.full_name}</p><p className="text-sm text-gray-600">{a.address_line1}, {a.city}, {a.state} - {a.pincode}</p></div></label>)}
            <button onClick={() => setShowNew(!showNew)} className="text-sm text-[#2874f0] font-medium flex items-center gap-1"><Plus size={14} /> Add New</button>
            {showNew && <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 border rounded p-4"><Input placeholder="Full Name" value={newAddr.full_name} onChange={(e) => setNewAddr({...newAddr, full_name: e.target.value})} /><Input placeholder="Phone" value={newAddr.phone} onChange={(e) => setNewAddr({...newAddr, phone: e.target.value})} /><div className="md:col-span-2"><Input placeholder="Address" value={newAddr.address_line1} onChange={(e) => setNewAddr({...newAddr, address_line1: e.target.value})} /></div><Input placeholder="City" value={newAddr.city} onChange={(e) => setNewAddr({...newAddr, city: e.target.value})} /><Input placeholder="State" value={newAddr.state} onChange={(e) => setNewAddr({...newAddr, state: e.target.value})} /><Input placeholder="Pincode" value={newAddr.pincode} onChange={(e) => setNewAddr({...newAddr, pincode: e.target.value})} /><Button onClick={saveNewAddr} size="sm">Save</Button></div>}
            <div className="mt-6 flex justify-end"><Button onClick={() => setStep(2)} disabled={!selectedAddress}>CONTINUE</Button></div></div>}
          {step === 2 && <div className="bg-white rounded-sm shadow-sm p-6"><h2 className="text-lg font-bold mb-4">Payment Method</h2>{[{id:"cod",l:"Cash on Delivery",e:"💵"},{id:"upi",l:"UPI",e:"📱"},{id:"card",l:"Card",e:"💳"}].map((m) => <label key={m.id} className={`flex items-center gap-4 p-4 border rounded mb-3 cursor-pointer ${paymentMethod === m.id ? "border-[#2874f0] bg-blue-50" : "border-gray-200"}`}><input type="radio" checked={paymentMethod === m.id} onChange={() => setPaymentMethod(m.id)} /><span className="text-2xl">{m.e}</span><span className="text-sm font-semibold">{m.l}</span></label>)}<div className="mt-6 flex justify-between"><Button variant="ghost" onClick={() => setStep(1)}>← Back</Button><Button onClick={() => setStep(3)}>CONTINUE</Button></div></div>}
          {step === 3 && <div className="bg-white rounded-sm shadow-sm p-6"><h2 className="text-lg font-bold mb-4">Order Summary</h2><div className="border rounded p-4 mb-4"><p className="text-xs font-bold text-gray-500 uppercase mb-1">Deliver To</p><p className="text-sm font-semibold">{selectedAddress?.full_name}</p><p className="text-sm text-gray-600">{selectedAddress?.address_line1}, {selectedAddress?.city}, {selectedAddress?.state}</p></div><div className="mt-6 flex justify-between"><Button variant="ghost" onClick={() => setStep(2)}>← Back</Button><Button onClick={placeOrder} variant="secondary" size="lg" loading={placing}>PLACE ORDER — {formatPrice(finalAmount)}</Button></div></div>}
        </div>
        <div className="lg:col-span-1"><div className="bg-white rounded-sm shadow-sm p-4 sticky top-20"><h3 className="text-sm font-bold text-gray-500 uppercase border-b pb-3 mb-4">Price Details</h3><div className="space-y-3"><div className="flex justify-between text-sm"><span>Price ({items.length} items)</span><span>{formatPrice(totalPrice + totalSavings)}</span></div>{totalSavings > 0 && <div className="flex justify-between text-sm"><span>Discount</span><span className="text-green-600">- {formatPrice(totalSavings)}</span></div>}<div className="flex justify-between text-sm"><span>Delivery</span><span className={deliveryFee === 0 ? "text-green-600" : ""}>{deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}</span></div><hr /><div className="flex justify-between font-bold"><span>Total</span><span>{formatPrice(finalAmount)}</span></div></div><div className="flex items-center gap-2 mt-4 text-xs text-gray-500 justify-center"><Shield size={14} /><span>Safe & Secure</span></div></div></div>
      </div>
    </div>
  );
}
