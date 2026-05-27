"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState(""); const [loading, setLoading] = useState(false); const [sent, setSent] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); setLoading(true); try { const supabase = createClient(); const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` }); if (error) { toast.error(error.message); return; } setSent(true); toast.success("Reset link sent!"); } catch { toast.error("Something went wrong."); } finally { setLoading(false); } };
  return (<div className="min-h-[80vh] flex items-center justify-center px-4 py-8"><div className="w-full max-w-md"><div className="bg-white rounded-sm shadow-lg p-8">
    <Link href="/login" className="flex items-center gap-1 text-sm text-gray-500 hover:text-[#2874f0] mb-6"><ArrowLeft size={16} />Back to Login</Link>
    <h1 className="text-2xl font-bold text-gray-900 mb-2">Forgot Password?</h1><p className="text-sm text-gray-500 mb-6">Enter your email for a reset link.</p>
    {sent ? <div className="text-center py-8"><div className="text-5xl mb-4">📧</div><h2 className="text-lg font-semibold">Check your email</h2><p className="text-sm text-gray-600 mt-2">Reset link sent to <strong>{email}</strong></p></div> :
    <form onSubmit={handleSubmit} className="space-y-4"><Input id="email" type="email" label="Email Address" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required /><Button type="submit" className="w-full" size="lg" loading={loading}>SEND RESET LINK</Button></form>}
  </div></div></div>);
}
