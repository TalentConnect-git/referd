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

  useEffect(() => {
    if (loading) {
      return;
    }

    if (!isAuthenticated || !user) {
      const loginUrl = `/login?redirect=${encodeURIComponent(pathname)}`;

      router.replace(loginUrl);
    }
  }, [loading, isAuthenticated, user, pathname, router]);

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
