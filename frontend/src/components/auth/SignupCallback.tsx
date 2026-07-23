"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SignupForm from "./SignupForm";
import SignupInfoPanel from "./SignupInfoPanel";

import { useAuth } from "@/context/AuthContext";
import type { AuthUser, UserType } from "@/services/auth.service";

const isUserType = (value: string | null): value is UserType => {
  return (
    value === "student" ||
    value === "fresher" ||
    value === "professional"
  );
};

export default function SignupCallback() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();
  const processedRef = useRef(false);

  const token = searchParams.get("token");
  const hasOAuthCallback = Boolean(token);

  useEffect(() => {
    if (!token || processedRef.current) return;

    processedRef.current = true;

    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const returnedUserType = searchParams.get("userType");
    const onboardingCompleted =
      searchParams.get("onboardingCompleted") === "true";

    if (!userId || !isUserType(returnedUserType)) {
      router.replace("/signup");
      return;
    }

    const user: AuthUser = {
      _id: userId,
      email: email || "",
      name: name || "",
      userType: returnedUserType,
      onboardingCompleted,
    };

    login(user, token);

    localStorage.setItem("selectedRole", returnedUserType);
    sessionStorage.removeItem("oauthSignupRole");

    router.replace("/onboarding/resume-upload");
  }, [token, searchParams, login, router]);

  if (hasOAuthCallback) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">
            Signing you in...
          </h2>

          <p className="mt-2 text-gray-400">
            Please wait while we complete your signup.
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 py-20">
      <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
        <SignupInfoPanel />
        <SignupForm />
      </div>
    </main>
  );
}