"use client";

import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from "react";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface ProfileData {
  id?: string;
  email?: string;
  full_name?: string;
  role?: string;
  avatar_url?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  profile: ProfileData | null;
  loading: boolean;
  isAdmin: boolean;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileData = useCallback(
    async (userId: string, userEmail: string, userMeta?: any): Promise<ProfileData | null> => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("profiles")
          .select("id, email, full_name, role, avatar_url, phone")
          .eq("id", userId)
          .maybeSingle();

        if (error) {
          console.error("Profile fetch error:", error.message);
          return null;
        }

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
            .select("id, email, full_name, role, avatar_url, phone")
            .maybeSingle();
          return newProfile || null;
        }

        return data;
      } catch (err) {
        console.error("Profile error:", err);
        return null;
      }
    },
    []
  );

  const refresh = useCallback(async () => {
    try {
      const supabase = createClient();
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        setUser(currentUser);
        const profileData = await fetchProfileData(
          currentUser.id,
          currentUser.email || "",
          currentUser.user_metadata
        );
        setProfile(profileData);
      } else {
        setUser(null);
        setProfile(null);
      }
    } catch (err) {
      console.error("Refresh error:", err);
    }
  }, [fetchProfileData]);

  const signOut = useCallback(async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setUser(null);
      setProfile(null);
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    const init = async () => {
      try {
        const { data: { user: currentUser }, error } = await supabase.auth.getUser();
        if (!mounted) return;

        if (error || !currentUser) {
          setUser(null);
          setProfile(null);
        } else {
          setUser(currentUser);
          const profileData = await fetchProfileData(
            currentUser.id,
            currentUser.email || "",
            currentUser.user_metadata
          );
          if (mounted) setProfile(profileData);
        }
      } catch (err) {
        console.error("Auth init error:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    init();

    const safetyTimer = setTimeout(() => {
      if (mounted) {
        console.warn("Auth safety timeout reached");
        setLoading(false);
      }
    }, 4000);

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;

      if (event === "SIGNED_OUT" || !session?.user) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      if (session?.user) {
        setUser(session.user);
        const profileData = await fetchProfileData(
          session.user.id,
          session.user.email || "",
          session.user.user_metadata
        );
        if (mounted) {
          setProfile(profileData);
          setLoading(false);
        }
      }
    });

    return () => {
      mounted = false;
      clearTimeout(safetyTimer);
      authListener?.subscription.unsubscribe();
    };
  }, [fetchProfileData]);

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        isAdmin: profile?.role === "admin",
        signOut,
        refresh,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
