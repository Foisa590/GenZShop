"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { MapPin, CreditCard, Check, Plus, ShoppingBag, Shield } from "lucide-react";
import toast from "react-hot-toast";

const PAYMENT_METHODS = [
  { id: "bkash", label: "bKash", icon: "📱", color: "#E2136E", description: "Send money to our bKash merchant", info: "01XXX-XXXXXX" },
  { id: "nagad", label: "Nagad", icon: "💰", color: "#EC1C24", description: "Pay via Nagad mobile banking", info: "01XXX-XXXXXX" },
  { id: "rocket", label: "Rocket", icon: "🚀", color: "#8E24AA", description: "Dutch-Bangla Rocket payment", info: "01XXX-XXXXXX-1" },
  { id: "upay", label: "Upay", icon: "💳", color: "#F58220", description: "UCB Upay digital wallet", info: "01XXX-XXXXXX" },
  { id: "cod", label: "Cash on Delivery", icon: "💵", color: "#388E3C", description: "Pay when you receive your order" },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { items, getTotalPrice, getTotalSavings, clearCart } = useCartStore();
  const [step, setStep] = useState(1);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [newAddr, setNewAddr] = useState({
    full_name: "", phone: "", address_line1: "", city: "", state: "", pincode: ""
  });

  const totalPrice = getTotalPrice();
  const totalSavings = getTotalSavings();
  const deliveryFee = totalPrice >= 1000 ? 0 : 60;
  const finalAmount = totalPrice + deliveryFee;

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push("/login?redirect=/checkout");
      return;
    }

    let mounted = true;
    (async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .order("is_default", { ascending: false });
        if (error) console.error("Address load error:", error.message);
        if (mounted) {
          setAddresses(data || []);
          if (data && data.length > 0) setSelectedAddress(data[0]);
        }
      } catch (err) {
        console.error("Checkout load error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    const safetyTimer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 5000);

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
    };
  }, [user, authLoading, router]);

  const saveNewAddr = async () => {
    if (!user) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase.from("addresses").insert({
        ...newAddr, address_line2: "", user_id: user.id, is_default: addresses.length === 0
      }).select().single();
      if (error) throw error;
      if (data) {
        setAddresses([...addresses, data]);
        setSelectedAddress(data);
        setShowNew(false);
        toast.success("Address saved!");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    }
  };

  const placeOrder = async () => {
    if (!user) {
      toast.error("Please login");
      return;
    }
    if (!selectedAddress) {
      toast.error("Select address");
      return;
    }
    if (paymentMethod !== "cod" && !transactionId.trim()) {
      toast.error("Please enter your transaction ID");
      return;
    }
    setPlacing(true);
    try {
      const supabase = createClient();
      const { data: order, error } = await supabase.from("orders").insert({
        user_id: user.id,
        total_amount: finalAmount,
        shipping_address: selectedAddress,
        status: "pending",
        payment_method: paymentMethod,
        payment_status: paymentMethod === "cod" ? "pending" : "paid",
        tracking_id: transactionId || ""
      }).select().single();
      if (error) throw error;
      await supabase.from("order_items").insert(items.map((i) => ({
        order_id: order.id,
        product_id: i.product.id,
        product_name: i.product.name,
        product_image: i.product.images[0] || "",
        quantity: i.quantity,
        price: i.product.price
      })));
      clearCart();
      toast.success("Order placed!");
      router.push(`/order-success?id=${order.id}`);
    } catch { toast.error("Failed to place order"); } finally { setPlacing(false); }
  };

  if (items.length === 0) return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <EmptyState icon={<ShoppingBag size={80} className="text-gray-300" />} title="Cart is empty" description="Add products first." actionLabel="Shop Now" actionHref="/products" />
    </div>
  );

  if (authLoading || loading) return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="bg-white rounded-sm shadow-sm p-8 animate-pulse"><div className="h-6 w-48 bg-gray-200 rounded" /></div>
    </div>
  );

  const selectedPayment = PAYMENT_METHODS.find((m) => m.id === paymentMethod);

  return (
    <div className="max-w-5xl mx-auto px-4 py-4">
      <div className="bg-white rounded-sm shadow-sm p-3 sm:p-4 mb-4 sm:mb-6">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {[
            { n: 1, l: "Address", i: MapPin },
            { n: 2, l: "Payment", i: CreditCard },
            { n: 3, l: "Review", i: Check }
          ].map((s, i) => (
            <div key={s.n} className="flex items-center">
              <button
                onClick={() => s.n < step && setStep(s.n)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-colors ${
                  step >= s.n ? "bg-[#2874f0] text-white" : "bg-gray-100 text-gray-500"
                }`}
              >
                <s.i size={14} className="sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">{s.l}</span>
              </button>
              {i < 2 && <div className={`w-6 sm:w-16 h-0.5 mx-1 ${step > s.n ? "bg-[#2874f0]" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        <div className="lg:col-span-2">
          {step === 1 && (
            <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-[#2874f0]" /> Delivery Address
              </h2>
              {addresses.length === 0 && !showNew ? (
                <div className="text-center py-6">
                  <p className="text-gray-500 mb-4 text-sm">No saved addresses.</p>
                  <Button onClick={() => setShowNew(true)}><Plus size={16} /> Add Address</Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {addresses.map((a) => (
                    <label
                      key={a.id}
                      className={`flex items-start gap-3 p-3 sm:p-4 border rounded cursor-pointer transition-all ${
                        selectedAddress?.id === a.id ? "border-[#2874f0] bg-blue-50" : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <input type="radio" checked={selectedAddress?.id === a.id} onChange={() => setSelectedAddress(a)} className="mt-1" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm">{a.full_name}</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          {a.address_line1}, {a.city}, {a.state} - {a.pincode}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">📞 {a.phone}</p>
                      </div>
                    </label>
                  ))}
                  <button
                    onClick={() => setShowNew(!showNew)}
                    className="text-sm text-[#2874f0] font-medium flex items-center gap-1 p-3 border border-dashed border-[#2874f0] rounded w-full justify-center hover:bg-blue-50"
                  >
                    <Plus size={14} /> Add New Address
                  </button>
                </div>
              )}

              {showNew && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 border rounded p-4 bg-gray-50">
                  <Input placeholder="Full Name" value={newAddr.full_name} onChange={(e) => setNewAddr({ ...newAddr, full_name: e.target.value })} />
                  <Input placeholder="Phone (e.g. 01XXX-XXXXXX)" value={newAddr.phone} onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })} />
                  <div className="sm:col-span-2">
                    <Input placeholder="Address (House, Road, Area)" value={newAddr.address_line1} onChange={(e) => setNewAddr({ ...newAddr, address_line1: e.target.value })} />
                  </div>
                  <Input placeholder="City (e.g. Dhaka)" value={newAddr.city} onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })} />
                  <Input placeholder="District" value={newAddr.state} onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })} />
                  <Input placeholder="Postcode" value={newAddr.pincode} onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })} />
                  <div className="sm:col-span-2 flex gap-3">
                    <Button onClick={saveNewAddr} size="sm">Save & Use</Button>
                    <Button variant="ghost" size="sm" onClick={() => setShowNew(false)}>Cancel</Button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <Button onClick={() => setStep(2)} disabled={!selectedAddress}>CONTINUE →</Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                <CreditCard size={18} className="text-[#2874f0]" /> Payment Method
              </h2>

              <div className="space-y-3">
                {PAYMENT_METHODS.map((m) => (
                  <label
                    key={m.id}
                    className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 border-2 rounded cursor-pointer transition-all ${
                      paymentMethod === m.id ? "bg-blue-50" : "border-gray-200 hover:border-gray-400"
                    }`}
                    style={paymentMethod === m.id ? { borderColor: m.color } : {}}
                  >
                    <input
                      type="radio"
                      checked={paymentMethod === m.id}
                      onChange={() => { setPaymentMethod(m.id); setTransactionId(""); }}
                    />
                    <div
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg flex items-center justify-center text-xl sm:text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${m.color}15` }}
                    >
                      {m.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm sm:text-base font-semibold" style={{ color: m.color }}>{m.label}</p>
                      <p className="text-xs text-gray-500">{m.description}</p>
                    </div>
                  </label>
                ))}
              </div>

              {paymentMethod !== "cod" && selectedPayment && (
                <div className="mt-4 p-4 rounded-sm border-2" style={{ borderColor: selectedPayment.color, backgroundColor: `${selectedPayment.color}08` }}>
                  <p className="text-sm font-semibold mb-2" style={{ color: selectedPayment.color }}>
                    📲 {selectedPayment.label} Payment Instructions
                  </p>
                  <ol className="text-xs sm:text-sm text-gray-700 space-y-1 list-decimal list-inside mb-3">
                    <li>Open your {selectedPayment.label} app</li>
                    <li>Send <strong>{formatPrice(finalAmount)}</strong> to: <strong>{selectedPayment.info}</strong></li>
                    <li>Use reference: <strong>GENZ-{Date.now().toString().slice(-6)}</strong></li>
                    <li>Enter the Transaction ID below</li>
                  </ol>
                  <Input
                    label="Transaction ID (TrxID)"
                    placeholder={`Enter ${selectedPayment.label} Transaction ID`}
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                  />
                </div>
              )}

              <div className="mt-6 flex justify-between">
                <Button variant="ghost" onClick={() => setStep(1)}>← Back</Button>
                <Button onClick={() => setStep(3)} disabled={paymentMethod !== "cod" && !transactionId.trim()}>
                  CONTINUE →
                </Button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
              <h2 className="text-base sm:text-lg font-bold mb-4 flex items-center gap-2">
                <Check size={18} className="text-[#2874f0]" /> Order Summary
              </h2>

              <div className="border rounded p-3 sm:p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">Deliver To</p>
                  <button onClick={() => setStep(1)} className="text-xs text-[#2874f0] font-medium">Change</button>
                </div>
                <p className="text-sm font-semibold">{selectedAddress?.full_name}</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {selectedAddress?.address_line1}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}
                </p>
                <p className="text-xs text-gray-500 mt-1">📞 {selectedAddress?.phone}</p>
              </div>

              <div className="border rounded p-3 sm:p-4 mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-bold text-gray-500 uppercase">Payment</p>
                  <button onClick={() => setStep(2)} className="text-xs text-[#2874f0] font-medium">Change</button>
                </div>
                <p className="text-sm font-semibold flex items-center gap-2">
                  <span className="text-xl">{selectedPayment?.icon}</span>
                  <span style={{ color: selectedPayment?.color }}>{selectedPayment?.label}</span>
                </p>
                {transactionId && <p className="text-xs text-gray-500 mt-1">TrxID: {transactionId}</p>}
              </div>

              <div className="border rounded p-3 sm:p-4">
                <p className="text-xs font-bold text-gray-500 uppercase mb-3">Items ({items.length})</p>
                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 text-sm">
                      <div className="flex-1 min-w-0 truncate text-gray-700">
                        {item.product.name} <span className="text-gray-400">× {item.quantity}</span>
                      </div>
                      <span className="font-semibold flex-shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3">
                <Button variant="ghost" onClick={() => setStep(2)}>← Back</Button>
                <Button onClick={placeOrder} variant="secondary" size="lg" loading={placing} className="w-full sm:w-auto">
                  PLACE ORDER — {formatPrice(finalAmount)}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-sm shadow-sm p-4 lg:sticky lg:top-20">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider border-b pb-3 mb-4">
              Price Details
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Price ({items.length} items)</span>
                <span>{formatPrice(totalPrice + totalSavings)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600 font-medium">- {formatPrice(totalSavings)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className={deliveryFee === 0 ? "text-green-600 font-medium" : ""}>
                  {deliveryFee === 0 ? "FREE" : formatPrice(deliveryFee)}
                </span>
              </div>
              <hr />
              <div className="flex justify-between text-base font-bold">
                <span>Total</span>
                <span>{formatPrice(finalAmount)}</span>
              </div>
              {totalSavings > 0 && (
                <div className="bg-green-50 border border-green-200 rounded p-3 text-xs sm:text-sm text-green-700 font-medium">
                  🎉 You save {formatPrice(totalSavings)} on this order
                </div>
              )}
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 justify-center">
              <Shield size={14} /><span>100% Secure Payment</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
