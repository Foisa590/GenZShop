"use client";
import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";

export default function LogoutPage() {
  const { signOut } = useAuth();

  useEffect(() => {
    signOut();
  }, [signOut]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin w-8 h-8 border-4 border-[#2874f0] border-t-transparent rounded-full mx-auto mb-3" />
        <p className="text-sm text-gray-500">Logging out...</p>
      </div>
    </div>
  );
}
