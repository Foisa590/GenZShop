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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full" /></div>}>
      <LoginContent />
    </Suspense>
  );
}

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { toast.error(error.message); return; }
      toast.success("Welcome back!");
      router.push(redirect);
      router.refresh();
    } catch {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      });
      if (error) { toast.error(error.message); setGoogleLoading(false); }
    } catch {
      toast.error("Google login failed");
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-sm shadow-lg overflow-hidden">
          <div className="bg-[#2874f0] p-6 sm:p-8 text-white">
            <h1 className="text-2xl font-bold mb-2">Login</h1>
            <p className="text-sm text-blue-100">Get access to your Orders, Wishlist and Recommendations</p>
          </div>
          <div className="p-6 sm:p-8">
            {/* Google Login Button */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={googleLoading}
              className="w-full flex items-center justify-center gap-3 py-3 border border-gray-300 rounded-sm hover:bg-gray-50 transition-colors disabled:opacity-50 mb-4"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-sm font-medium text-gray-700">{googleLoading ? "Connecting..." : "Continue with Google"}</span>
            </button>

            <div className="flex items-center gap-4 my-4">
              <hr className="flex-1" />
              <span className="text-xs text-gray-500">OR LOGIN WITH EMAIL</span>
              <hr className="flex-1" />
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Input id="email" type="email" label="Email Address" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Mail size={16} className="absolute right-3 top-9 text-gray-400" />
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} label="Password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-9 text-gray-400">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              <div className="text-right">
                <Link href="/forgot-password" className="text-xs text-[#2874f0] hover:underline">Forgot Password?</Link>
              </div>
              <Button type="submit" className="w-full" size="lg" loading={loading}>LOGIN</Button>
            </form>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-600">
                New to {SITE_NAME}?{" "}
                <Link href="/signup" className="text-[#2874f0] font-semibold hover:underline">Create an account</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
