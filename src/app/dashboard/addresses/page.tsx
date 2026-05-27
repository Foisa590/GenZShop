"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { EmptyState } from "@/components/ui/EmptyState";
import { MapPin, Plus, Trash2, Edit2 } from "lucide-react";
import toast from "react-hot-toast";

const EMPTY_FORM = { full_name: "", phone: "", address_line1: "", address_line2: "", city: "", state: "", pincode: "" };

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .order("is_default", { ascending: false });
      if (error) console.error("Addresses error:", error.message);
      setAddresses(data || []);
    } catch (err) {
      console.error("Failed to load addresses:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push("/login?redirect=/dashboard/addresses");
      return;
    }

    load();

    const timer = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timer);
  }, [user, authLoading, load, router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    try {
      const supabase = createClient();
      if (editingId) {
        const { error } = await supabase.from("addresses").update(form).eq("id", editingId);
        if (error) throw error;
        toast.success("Updated!");
      } else {
        const { error } = await supabase
          .from("addresses")
          .insert({ ...form, user_id: user.id, is_default: addresses.length === 0 });
        if (error) throw error;
        toast.success("Added!");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      load();
    } catch (err: any) {
      toast.error(err?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this address?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("addresses").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    load();
  };

  if (authLoading || loading) {
    return (
      <div className="bg-white rounded-sm shadow-sm p-8 animate-pulse">
        <div className="h-6 w-40 bg-gray-200 rounded mb-4" />
        <div className="space-y-3">
          <div className="h-20 bg-gray-100 rounded" />
          <div className="h-20 bg-gray-100 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-sm shadow-sm p-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">My Addresses</h1>
          <p className="text-xs text-gray-500 mt-0.5">আমার ঠিকানা</p>
        </div>
        <Button
          onClick={() => {
            setForm(EMPTY_FORM);
            setEditingId(null);
            setShowForm(!showForm);
          }}
          size="sm"
        >
          <Plus size={16} /> {showForm ? "Close" : "Add"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
          <h3 className="font-semibold mb-3 text-sm">{editingId ? "Edit Address" : "New Address"}</h3>
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <Input label="Full Name" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} required />
            <Input label="Phone (01XXX-XXXXXX)" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            <div className="md:col-span-2">
              <Input label="Address (House, Road, Area)" value={form.address_line1} onChange={(e) => setForm({ ...form, address_line1: e.target.value })} required />
            </div>
            <Input label="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
            <Input label="District" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
            <Input label="Postcode" value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} required />
            <div className="md:col-span-2 flex gap-3">
              <Button type="submit" loading={saving}>{editingId ? "UPDATE" : "SAVE"}</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      {addresses.length === 0 && !showForm ? (
        <EmptyState
          icon={<MapPin size={80} className="text-gray-300" />}
          title="No addresses"
          description="ঠিকানা নেই • Add one for faster checkout"
        />
      ) : (
        addresses.map((a) => (
          <div key={a.id} className="bg-white rounded-sm shadow-sm p-4">
            <p className="text-sm font-bold">
              {a.full_name}
              {a.is_default && (
                <span className="text-xs bg-blue-50 text-[#2874f0] px-2 py-0.5 rounded ml-2">Default</span>
              )}
            </p>
            <p className="text-sm text-gray-600 mt-1">
              {a.address_line1}, {a.city}, {a.state} - {a.pincode}
            </p>
            <p className="text-xs text-gray-500 mt-1">Phone: {a.phone}</p>
            <div className="flex gap-4 mt-3 pt-3 border-t">
              <button
                onClick={() => {
                  setForm({
                    full_name: a.full_name,
                    phone: a.phone,
                    address_line1: a.address_line1,
                    address_line2: a.address_line2 || "",
                    city: a.city,
                    state: a.state,
                    pincode: a.pincode,
                  });
                  setEditingId(a.id);
                  setShowForm(true);
                }}
                className="text-xs text-[#2874f0] font-medium"
              >
                <Edit2 size={12} className="inline mr-1" />
                Edit
              </button>
              <button onClick={() => handleDelete(a.id)} className="text-xs text-red-500 font-medium">
                <Trash2 size={12} className="inline mr-1" />
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
