"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { SITE_NAME } from "@/lib/constants";
import { Mail, User, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
export default function SignupPage() {
  const [fullName, setFullName] = useState(""); const [email, setEmail] = useState(""); const [password, setPassword] = useState(""); const [confirmPassword, setConfirmPassword] = useState(""); const [showPassword, setShowPassword] = useState(false); const [loading, setLoading] = useState(false); const router = useRouter();
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault(); if (password !== confirmPassword) { toast.error("Passwords don't match!"); return; } if (password.length < 6) { toast.error("Password must be at least 6 characters"); return; } setLoading(true);
    try { const supabase = createClient(); const { error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName } } }); if (error) { toast.error(error.message); return; } toast.success("Account created! Check your email."); router.push("/login"); } catch { toast.error("Something went wrong."); } finally { setLoading(false); }
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8"><div className="w-full max-w-md"><div className="bg-white rounded-sm shadow-lg overflow-hidden">
      <div className="bg-[#2874f0] p-8 text-white"><h1 className="text-2xl font-bold mb-2">Create Account</h1><p className="text-sm text-blue-100">Sign up to get exclusive deals & more</p></div>
      <div className="p-8"><form onSubmit={handleSignup} className="space-y-4">
        <div className="relative"><Input id="fullName" label="Full Name" placeholder="Enter your full name" value={fullName} onChange={(e) => setFullName(e.target.value)} required /><User size={16} className="absolute right-3 top-9 text-gray-400" /></div>
        <div className="relative"><Input id="email" type="email" label="Email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required /><Mail size={16} className="absolute right-3 top-9 text-gray-400" /></div>
        <div className="relative"><Input id="password" type={showPassword ? "text" : "password"} label="Password" placeholder="Min 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
        <Input id="confirmPassword" type="password" label="Confirm Password" placeholder="Re-enter password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} error={confirmPassword && password !== confirmPassword ? "Passwords don't match" : undefined} required />
        <Button type="submit" className="w-full" size="lg" loading={loading}>CREATE ACCOUNT</Button>
      </form>
      <div className="text-center mt-6"><p className="text-sm text-gray-600">Already have an account? <Link href="/login" className="text-[#2874f0] font-semibold hover:underline">Login</Link></p></div>
    </div></div></div></div>
  );
}
