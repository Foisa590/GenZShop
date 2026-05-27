"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Mail, Phone } from "lucide-react";
import { getInitials } from "@/lib/utils";
import toast from "react-hot-toast";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ full_name: "", email: "", phone: "" });
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const supabase = createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
          if (mounted) router.push("/login");
          return;
        }

        // Use maybeSingle to avoid throwing on missing row
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("Profile load error:", error.message);
        }

        // Auto-create profile if missing
        if (!data) {
          await supabase.from("profiles").insert({
            id: user.id,
            email: user.email,
            full_name: user.user_metadata?.full_name || "",
            role: "customer",
          });
        }

        if (mounted) {
          setProfile({
            full_name: data?.full_name || user.user_metadata?.full_name || "",
            email: data?.email || user.email || "",
            phone: data?.phone || "",
          });
        }
      } catch (err) {
        console.error("Profile fetch failed:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => { mounted = false; };
  }, [router]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Please login first");
        return;
      }
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: profile.full_name, phone: profile.phone })
        .eq("id", user.id);
      if (error) throw error;
      toast.success("Profile updated!");
    } catch (e: any) {
      toast.error(e?.message || "Failed to update");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-sm shadow-sm p-8 animate-pulse">
        <div className="h-6 w-32 bg-gray-200 rounded mb-6" />
        <div className="space-y-4">
          <div className="h-10 bg-gray-200 rounded" />
          <div className="h-10 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
        <div className="flex items-center gap-3 sm:gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-br from-[#2874f0] to-purple-600 flex items-center justify-center text-white text-lg sm:text-xl font-bold flex-shrink-0">
            {getInitials(profile.full_name || profile.email || "U")}
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-lg font-bold truncate">{profile.full_name || "User"}</h1>
            <p className="text-xs sm:text-sm text-gray-500 truncate">{profile.email}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm shadow-sm p-4 sm:p-6">
        <h2 className="text-base font-bold mb-4 sm:mb-6">
          Personal Information <span className="text-gray-400 text-sm font-normal">/ ব্যক্তিগত তথ্য</span>
        </h2>
        <form onSubmit={handleSave} className="space-y-4 max-w-lg">
          <div className="relative">
            <Input
              label="Full Name / পূর্ণ নাম"
              value={profile.full_name}
              onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
              placeholder="Enter your full name"
            />
            <User size={16} className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Input label="Email" value={profile.email} disabled />
            <Mail size={16} className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <Input
              label="Phone / ফোন"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              placeholder="01XXX-XXXXXX"
            />
            <Phone size={16} className="absolute right-3 top-9 text-gray-400 pointer-events-none" />
          </div>
          <Button type="submit" loading={saving}>SAVE CHANGES</Button>
        </form>
      </div>
    </div>
  );
}
