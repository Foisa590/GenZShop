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
        // Use maybeSingle instead of single - returns null if no row instead of throwing
        const { data, error } = await supabase
          .from("profiles")
          .select("full_name, role, avatar_url")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error("Profile fetch error:", error.message);
          return null;
        }

        // If profile doesn't exist, create it (for OAuth users or trigger failures)
        if (!data) {
          console.log("Profile not found, creating...");
          const { data: newProfile, error: insertError } = await supabase
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

          if (insertError) {
            console.error("Profile creation error:", insertError.message);
            return { full_name: userMeta?.full_name || "", role: "customer", avatar_url: "" };
          }
          return newProfile || { full_name: userMeta?.full_name || "", role: "customer", avatar_url: "" };
        }

        return data;
      } catch (err) {
        console.error("Unexpected profile error:", err);
        return null;
      }
    };

    const loadUser = async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();

        if (!mounted) return;

        if (error) {
          console.error("Auth error:", error.message);
          setUser(null);
          setProfile(null);
        } else if (currentUser) {
          setUser(currentUser);
          const profileData = await fetchProfile(
            currentUser.id,
            currentUser.email || "",
            currentUser.user_metadata
          );
          if (mounted) setProfile(profileData);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error("Load user error:", err);
        if (mounted) {
          setUser(null);
          setProfile(null);
        }
      } finally {
        // CRITICAL: Always set loading to false
        if (mounted) setLoading(false);
      }
    };

    loadUser();

    // Safety: force-stop loading after 5 seconds even if queries hang
    const safetyTimer = setTimeout(() => {
      if (mounted) {
        console.warn("useAuth safety timeout reached - stopping loading");
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
        console.error("Auth state change error:", err);
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
