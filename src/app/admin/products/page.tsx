"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, Edit2, Trash2, Search, Package, X } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";

const EMPTY_FORM = {
  name: "", slug: "", description: "", price: "", original_price: "", discount_percent: "",
  category: "", brand: "", images: "", stock: "", is_featured: false, is_deal: false
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);

  const load = async () => {
    try {
      const supabase = createClient();
      const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
      setProducts(data || []);
    } catch {} finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createClient();
      const d = {
        name: form.name,
        slug: form.slug || form.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
        description: form.description,
        price: Number(form.price),
        original_price: Number(form.original_price) || Number(form.price),
        discount_percent: Number(form.discount_percent) || 0,
        category: form.category,
        brand: form.brand,
        images: form.images.split(",").map(s => s.trim()).filter(Boolean),
        stock: Number(form.stock) || 0,
        is_featured: form.is_featured,
        is_deal: form.is_deal,
      };
      if (editingId) {
        const { error } = await supabase.from("products").update(d).eq("id", editingId).select();
        if (error) throw error;
        toast.success("Product updated!");
      } else {
        const { error } = await supabase.from("products").insert(d);
        if (error) throw error;
        toast.success("Product added!");
      }
      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      load();
    } catch (e: any) {
      toast.error(e?.message || "Failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Deleted");
    load();
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.brand?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-10 bg-white rounded w-48" />
        <div className="h-64 bg-white rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h1>
          <p className="text-xs text-gray-500 mt-0.5">প্রোডাক্ট • {products.length} total</p>
        </div>
        <Button
          onClick={() => {
            setForm(EMPTY_FORM);
            setEditingId(null);
            setShowForm(!showForm);
          }}
        >
          <Plus size={16} /> {showForm ? "Close" : "Add Product"}
        </Button>
      </div>

      {showForm && (
        <div className="bg-white rounded-xl shadow-sm border p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">{editingId ? "Edit Product" : "Add New Product"}</h2>
            <button onClick={() => setShowForm(false)} className="p-1 hover:bg-gray-100 rounded">
              <X size={18} />
            </button>
          </div>
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div className="sm:col-span-2">
              <Input label="Product Name *" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <Input label="Category *" value={form.category} onChange={e => setForm({...form, category: e.target.value})} placeholder="electronics, fashion, ..." required />
            <Input label="Brand" value={form.brand} onChange={e => setForm({...form, brand: e.target.value})} />
            <Input label="Price (৳) *" type="number" value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            <Input label="Original Price (৳)" type="number" value={form.original_price} onChange={e => setForm({...form, original_price: e.target.value})} />
            <Input label="Discount %" type="number" value={form.discount_percent} onChange={e => setForm({...form, discount_percent: e.target.value})} />
            <Input label="Stock" type="number" value={form.stock} onChange={e => setForm({...form, stock: e.target.value})} />
            <div className="sm:col-span-2">
              <Input label="Images (comma separated URLs)" value={form.images} onChange={e => setForm({...form, images: e.target.value})} placeholder="https://image1.jpg, https://image2.jpg" />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={form.description}
                onChange={e => setForm({...form, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="sm:col-span-2 flex flex-wrap gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_featured} onChange={e => setForm({...form, is_featured: e.target.checked})} className="w-4 h-4" />
                <span className="text-sm">Featured Product</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.is_deal} onChange={e => setForm({...form, is_deal: e.target.checked})} className="w-4 h-4" />
                <span className="text-sm">Deal of the Day</span>
              </label>
            </div>
            <div className="sm:col-span-2 flex gap-3">
              <Button type="submit" loading={saving}>{editingId ? "UPDATE" : "ADD"}</Button>
              <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border p-3 sm:p-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        </div>
      </div>

      {/* Mobile: Card View */}
      <div className="sm:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <Package size={40} className="mx-auto text-gray-300 mb-2" />
            <p className="text-sm text-gray-500">No products found</p>
          </div>
        ) : (
          filtered.map(p => (
            <div key={p.id} className="bg-white rounded-xl shadow-sm border p-3 flex gap-3">
              <div className="relative w-16 h-16 bg-gray-100 rounded flex-shrink-0">
                <Image src={p.images?.[0] || "/placeholder.png"} alt={p.name} fill className="object-contain p-1" sizes="64px" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-900 line-clamp-2">{p.name}</p>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">{p.category} • {p.brand}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-sm font-bold">{formatPrice(p.price)}</span>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-1.5 py-0.5 rounded ${p.stock === 0 ? "bg-red-100 text-red-700" : p.stock < 10 ? "bg-yellow-100 text-yellow-700" : "bg-green-100 text-green-700"}`}>
                      Stock: {p.stock}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => {
                      setForm({
                        name: p.name, slug: p.slug, description: p.description || "",
                        price: String(p.price), original_price: String(p.original_price),
                        discount_percent: String(p.discount_percent), category: p.category,
                        brand: p.brand || "", images: (p.images || []).join(", "),
                        stock: String(p.stock), is_featured: p.is_featured, is_deal: p.is_deal,
                      });
                      setEditingId(p.id);
                      setShowForm(true);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    className="flex-1 text-xs py-1.5 bg-blue-50 text-blue-700 rounded font-medium"
                  >
                    <Edit2 size={12} className="inline mr-1" />Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="flex-1 text-xs py-1.5 bg-red-50 text-red-600 rounded font-medium"
                  >
                    <Trash2 size={12} className="inline mr-1" />Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Desktop: Table View */}
      <div className="hidden sm:block bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="text-left px-4 py-3">Product</th>
                <th className="text-left px-4 py-3">Category</th>
                <th className="text-left px-4 py-3">Price</th>
                <th className="text-left px-4 py-3">Stock</th>
                <th className="text-left px-4 py-3">Tags</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-12">
                    <Package size={40} className="mx-auto text-gray-300 mb-2" />
                    No products found
                  </td>
                </tr>
              ) : filtered.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 bg-gray-100 rounded">
                        <Image src={p.images?.[0] || "/placeholder.png"} alt={p.name} fill className="object-contain p-1" sizes="40px" />
                      </div>
                      <div>
                        <p className="font-medium line-clamp-1 max-w-[200px]">{p.name}</p>
                        <p className="text-xs text-gray-500">{p.brand}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize">{p.category}</td>
                  <td className="px-4 py-3 font-medium">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock === 0 ? "text-red-600 font-medium" : p.stock < 10 ? "text-yellow-600" : "text-green-600"}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1">
                      {p.is_featured && <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">★</span>}
                      {p.is_deal && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">Deal</span>}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setForm({
                            name: p.name, slug: p.slug, description: p.description || "",
                            price: String(p.price), original_price: String(p.original_price),
                            discount_percent: String(p.discount_percent), category: p.category,
                            brand: p.brand || "", images: (p.images || []).join(", "),
                            stock: String(p.stock), is_featured: p.is_featured, is_deal: p.is_deal,
                          });
                          setEditingId(p.id);
                          setShowForm(true);
                        }}
                        className="text-blue-500 hover:text-blue-700 p-1"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button onClick={() => handleDelete(p.id)} className="text-red-400 hover:text-red-600 p-1">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
