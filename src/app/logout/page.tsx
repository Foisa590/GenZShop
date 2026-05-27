"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
export default function LogoutPage() {
  const router = useRouter();
  useEffect(() => { const logout = async () => { const supabase = createClient(); await supabase.auth.signOut(); toast.success("Logged out"); router.push("/"); router.refresh(); }; logout(); }, [router]);
  return <div className="min-h-[60vh] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full" /></div>;
}
