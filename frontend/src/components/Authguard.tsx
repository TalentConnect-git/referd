"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, role, loading } = useAuth();

  const [fromLogo, setFromLogo] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const logoClicked = sessionStorage.getItem("fromLogo") === "true";

    setFromLogo(logoClicked);

    if (logoClicked) {
      sessionStorage.removeItem("fromLogo");
    }

    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized || loading) return;

    if (user && !fromLogo) {
      router.replace(`/${role}/dashboard`);
    }
  }, [initialized, loading, user, role, fromLogo, router]);

  if (!initialized || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  if (user && !fromLogo) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}