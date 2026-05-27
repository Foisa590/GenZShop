"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SITE_NAME } from "@/lib/constants";
import { Mail, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";

export default function LoginPage() { return <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full" /></div>}><LoginContent /></Suspense>; }

function LoginContent() {
  const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [showPassword, setShowPassword] = useState(false); const [loading, setLoading] = useState(false);
  const router = useRouter(); const searchParams = useSearchParams(); const redirect = searchParams.get("redirect") || "/";
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true);
    try { const supabase = createClient(); const { error } = await supabase.auth.signInWithPassword({ email, password }); if (error) { toast.error(error.message); return; } toast.success("Welcome back!"); router.push(redirect); router.refresh(); } catch { toast.error("Something went wrong."); } finally { setLoading(false); }
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8"><div className="w-full max-w-md"><div className="bg-white rounded-sm shadow-lg overflow-hidden">
      <div className="bg-[#2874f0] p-8 text-white"><h1 className="text-2xl font-bold mb-2">Login</h1><p className="text-sm text-blue-100">Get access to your Orders, Wishlist and Recommendations</p></div>
      <div className="p-8"><form onSubmit={handleLogin} className="space-y-4">
        <div className="relative"><Input id="email" type="email" label="Email Address" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required /><Mail size={16} className="absolute right-3 top-9 text-gray-400" /></div>
        <div className="relative"><Input id="password" type={showPassword ? "text" : "password"} label="Password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
        <div className="text-right"><Link href="/forgot-password" className="text-xs text-[#2874f0] hover:underline">Forgot Password?</Link></div>
        <Button type="submit" className="w-full" size="lg" loading={loading}>LOGIN</Button>
      </form>
      <div className="flex items-center gap-4 my-6"><hr className="flex-1" /><span className="text-xs text-gray-500">OR</span><hr className="flex-1" /></div>
      <div className="text-center"><p className="text-sm text-gray-600">New to {SITE_NAME}? <Link href="/signup" className="text-[#2874f0] font-semibold hover:underline">Create an account</Link></p></div>
    </div></div></div></div>
  );
}
