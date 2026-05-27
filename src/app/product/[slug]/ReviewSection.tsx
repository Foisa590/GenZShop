"use client";
import { useState } from "react";
import { Star } from "lucide-react";
import { Product, Review } from "@/types";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { timeAgo } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";

export function ReviewSection({ reviews, product }: { reviews: Review[]; product: Product }) {
  const [showForm, setShowForm] = useState(false); const [rating, setRating] = useState(5); const [title, setTitle] = useState(""); const [comment, setComment] = useState(""); const [submitting, setSubmitting] = useState(false);
  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : product.rating;
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setSubmitting(true);
    try { const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) { toast.error("Please login"); setSubmitting(false); return; }
      const { error } = await supabase.from("reviews").insert({ user_id: user.id, product_id: product.id, rating, title, comment, user_name: user.user_metadata?.full_name || "User" });
      if (error) throw error; toast.success("Review submitted!"); setShowForm(false); setTitle(""); setComment(""); window.location.reload();
    } catch { toast.error("Failed to submit"); } finally { setSubmitting(false); }
  };
  return (
    <section className="bg-white rounded-sm shadow-sm mt-6 p-6">
      <div className="flex items-center justify-between mb-6"><h2 className="text-lg font-bold text-gray-900">Ratings & Reviews</h2><Button onClick={() => setShowForm(!showForm)} variant="outline" size="sm">Rate Product</Button></div>
      <div className="flex items-center gap-2 mb-6"><span className="text-4xl font-bold">{avgRating}</span><Star size={28} className="text-yellow-400 fill-yellow-400" /><span className="text-sm text-gray-500 ml-2">{reviews.length > 0 ? `${reviews.length} Reviews` : `${product.rating_count} Ratings`}</span></div>
      {showForm && <form onSubmit={handleSubmit} className="border rounded p-4 mb-6 bg-gray-50"><h3 className="font-semibold mb-4">Write a Review</h3><div className="mb-4 flex gap-1">{[1,2,3,4,5].map((s) => <button key={s} type="button" onClick={() => setRating(s)}><Star size={24} className={s <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} /></button>)}</div><Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} className="mb-3" /><textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Your review..." className="w-full px-3 py-2.5 border rounded-sm text-sm focus:outline-none focus:ring-2 focus:ring-[#2874f0] min-h-[80px] mb-4" required /><div className="flex gap-3"><Button type="submit" loading={submitting}>Submit</Button><Button type="button" variant="ghost" onClick={() => setShowForm(false)}>Cancel</Button></div></form>}
      <div className="divide-y">{reviews.length === 0 ? <p className="text-center text-gray-500 py-8">No reviews yet. Be the first!</p> : reviews.map((r) => <div key={r.id} className="py-4"><div className="flex items-center gap-3 mb-2"><span className="inline-flex items-center gap-1 bg-green-600 text-white text-xs font-bold px-1.5 py-0.5 rounded">{r.rating} <Star size={10} fill="white" /></span><span className="text-sm font-medium">{r.title || "Great"}</span></div><p className="text-sm text-gray-600 mb-2">{r.comment}</p><div className="text-xs text-gray-500">{r.user_name} • {timeAgo(r.created_at)}</div></div>)}</div>
    </section>
  );
}
