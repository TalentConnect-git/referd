"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import LoginForm from "@/components/auth/LoginForm";
import LoginInfoPanel from "@/components/auth/LoginInfoPanel";

import { useAuth } from "@/context/AuthContext";
import type { AuthUser, UserType } from "@/services/auth.service";

export default function LoginCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  const hasLinkedInCallback = searchParams.has("token");

  useEffect(() => {
    if (!hasLinkedInCallback) return;

    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const userType = searchParams.get("userType") as UserType | null;
    const onboardingCompleted =
      searchParams.get("onboardingCompleted");

    if (!token || !userId || !userType) {
      router.replace("/login");
      return;
    }

    const user: AuthUser = {
      _id: userId,
      email: email || "",
      name: name || "",
      userType,
      onboardingCompleted:
        onboardingCompleted === "true",
    };
    login(user, token);
    localStorage.setItem("selectedRole", userType);
    router.replace(`/${userType}/dashboard`);
  }, [hasLinkedInCallback, searchParams, login, router]);

  if (hasLinkedInCallback) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">
            Signing you in...
          </h2>
          <p className="mt-2 text-gray-400">
            Please wait while we complete your LinkedIn login.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 py-20">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
        <LoginInfoPanel />
        <LoginForm />
      </div>
    </main>
  );
}