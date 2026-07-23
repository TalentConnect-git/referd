"use client";

import { useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";

type UserRole = "student" | "fresher" | "professional";

interface GoogleOAuthButtonProps {
  userType?: UserRole;
}

export default function GoogleOAuthButton({ userType }: GoogleOAuthButtonProps) {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",
    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);

        const { data } = await axiosInstance.post("/api/auth/google", {
          code: codeResponse.code,
          userType,
        });

        if (!data.success) {
          toast.error(data.message || "Google login failed");
          return;
        }

        localStorage.setItem("selectedRole", userType || "student");

        login(data.user, data.token);
        toast.success("Login successful!");

        if (!data.user.onboardingCompleted) {
          router.push("/onboarding/resume-upload");
        } else {
          const dashboardMap: Record<UserRole, string> = {
            student: "/student/dashboard",
            fresher: "/fresher/dashboard",
            professional: "/professional/dashboard",
          };
          router.replace(
            dashboardMap[data.user.userType as UserRole] || "/student/dashboard"
          );
        }
      } catch (error: any) {
        console.error("Google auth error:", error);
        toast.error(error?.response?.data?.message || "Google sign-in failed");
      } finally {
        setLoading(false);
      }
    },
    onError: () => {
      toast.error("Google sign-in popup closed or failed");
    },
  });

  return (
    <button
      type="button"
      onClick={() => handleGoogleLogin()}
      disabled={loading}
      className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-white/10 bg-white/5 text-[14px] font-semibold text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? (
        "Connecting..."
      ) : (
        <>
          <Image
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            width={18}
            height={18}
          />
          Continue with Google
        </>
      )}
    </button>
  );
}