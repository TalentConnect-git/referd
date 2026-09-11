"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

type AuthGuardProps = {
  children: ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, loading, isAuthenticated } = useAuth();

  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't require authentication
  const publicRoutes = ["/referral-request"];

  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (loading || isPublicRoute) {
      return;
    }

    if (!isAuthenticated || !user) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;

      router.replace(loginUrl);
    }
  }, [
    loading,
    isAuthenticated,
    user,
    pathname,
    router,
    isPublicRoute,
  ]);

  // Public route doesn't need auth check
  if (isPublicRoute) {
    return <>{children}</>;
  }

  /*
   * Wait until AuthContext has checked
   * localStorage/backend.
   */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}