"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

interface ProfileData {
  full_name?: string;
  role?: string;
  avatar_url?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    const fetchProfile = async (userId: string, userEmail: string, userMeta?: any) => {
      try {
        // Use maybeSingle - returns null if no row instead of throwing
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, role, avatar_url")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error("Profile fetch error:", error.message);
          return null;
        }

        // Auto-create profile if missing (for OAuth users or trigger failures)
        if (!data) {
          const { data: newProfile } = await supabase
            .from("profiles")
            .insert({
              id: userId,
              email: userEmail,
              full_name: userMeta?.full_name || userMeta?.name || "",
              avatar_url: userMeta?.avatar_url || "",
              role: "customer",
            })
            .select("full_name, role, avatar_url")
            .maybeSingle();

          return newProfile || { full_name: userMeta?.full_name || "", role: "customer", avatar_url: "" };
        }

        return data;
      } catch (err) {
        console.error("Profile error:", err);
        return null;
      }
    };

    const loadUser = async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        if (!mounted) return;

        if (error || !currentUser) {
          setUser(null);
          setProfile(null);
        } else {
          setUser(currentUser);
          const profileData = await fetchProfile(
            currentUser.id,
            currentUser.email || "",
            currentUser.user_metadata
          );
          if (mounted) setProfile(profileData);
        }
      } catch (err) {
        console.error("Auth load error:", err);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadUser();

    // Safety: force-stop loading after 5 seconds
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        console.warn("useAuth safety timeout reached");
        setLoading(false);
      }
    }, 5000);

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;
      try {
        if (session?.user) {
          setUser(session.user);
          const profileData = await fetchProfile(
            session.user.id,
            session.user.email || "",
            session.user.user_metadata
          );
          if (mounted) setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Auth change error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      authListener?.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading, isAdmin: profile?.role === "admin" };
}
