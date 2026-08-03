// components/AuthGuard.tsx
"use client";

import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  useEffect(() => {
    // Wait for auth to load
    if (loading) return;

    // Case 1: User is logged in and on auth route (login/signup)
    if (user) {
      router.replace(`/${role}/dashboard`);
      return;
    }
  }, [user, role, loading]);

  // Show loading state while checking auth
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
