"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { User, Mail, Phone } from "lucide-react";
import { getInitials } from "@/lib/utils";
import toast from "react-hot-toast";
export default function ProfilePage() {
  const [loading, setLoading] = useState(true); const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({ full_name: "", email: "", phone: "" });
  useEffect(() => { (async () => { try { const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (user) { const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single(); setProfile({ full_name: data?.full_name || "", email: data?.email || user.email || "", phone: data?.phone || "" }); } } catch {} finally { setLoading(false); } })(); }, []);
  const handleSave = async (e: React.FormEvent) => { e.preventDefault(); setSaving(true); try { const supabase = createClient(); const { data: { user } } = await supabase.auth.getUser(); if (!user) return; await supabase.from("profiles").update({ full_name: profile.full_name, phone: profile.phone }).eq("id", user.id); toast.success("Profile updated!"); } catch { toast.error("Failed"); } finally { setSaving(false); } };
  if (loading) return <div className="bg-white rounded-sm shadow-sm p-8 animate-pulse"><div className="h-6 w-32 bg-gray-200 rounded mb-6" /><div className="space-y-4"><div className="h-10 bg-gray-200 rounded" /><div className="h-10 bg-gray-200 rounded" /></div></div>;
  return (<div className="space-y-6">
    <div className="bg-white rounded-sm shadow-sm p-6"><div className="flex items-center gap-4"><div className="w-16 h-16 rounded-full bg-[#2874f0] flex items-center justify-center text-white text-xl font-bold">{getInitials(profile.full_name || "U")}</div><div><h1 className="text-lg font-bold">{profile.full_name || "User"}</h1><p className="text-sm text-gray-500">{profile.email}</p></div></div></div>
    <div className="bg-white rounded-sm shadow-sm p-6"><h2 className="text-base font-bold mb-6">Personal Information</h2><form onSubmit={handleSave} className="space-y-4 max-w-lg"><Input label="Full Name" value={profile.full_name} onChange={(e) => setProfile({ ...profile, full_name: e.target.value })} /><Input label="Email" value={profile.email} disabled /><Input label="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} /><Button type="submit" loading={saving}>SAVE CHANGES</Button></form></div>
  </div>);
}
