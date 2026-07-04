// import SignupForm from "@/components/auth/SignupForm";
// import SignupInfoPanel from "@/components/auth/SignupInfoPanel";

// export default function SignupPage() {
//   return (
//     <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 py-20">
//       <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl">
//         <SignupInfoPanel />
//         <SignupForm />
//       </div>
//     </main>
//   );
// }


"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import SignupForm from "@/components/auth/SignupForm";
import SignupInfoPanel from "@/components/auth/SignupInfoPanel";

import { useAuth } from "@/context/AuthContext";
import type { AuthUser, UserType } from "@/services/auth.service";

export default function SignupPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login } = useAuth();

  const hasLinkedinCallback = searchParams.has("token");

  useEffect(() => {
    if (!hasLinkedinCallback) return;

    const token = searchParams.get("token");
    const userId = searchParams.get("userId");
    const email = searchParams.get("email");
    const name = searchParams.get("name");
    const userType = searchParams.get("userType") as UserType | null;
    const onboardingCompleted =
      searchParams.get("onboardingCompleted");

    if (!token || !userId || !userType) {
      router.replace("/signup");
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
    console.log("User is ",user);
    console.log("ONboarding ",user.onboardingCompleted);

    // login(user, token);
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("selectedRole", userType);
    
    router.replace("/onboarding/resume-upload");
    
  }, [hasLinkedinCallback, searchParams, login, router]);

  // While processing LinkedIn callback, don't show signup form
  if (hasLinkedinCallback) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-white">
            Signing you in...
          </h2>
          <p className="mt-2 text-gray-400">
            Please wait while we complete your LinkedIn signup.
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