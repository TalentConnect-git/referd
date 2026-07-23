"use client";

import { useRef, useState } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import Image from "next/image";
import toast from "react-hot-toast";
import { isAxiosError } from "axios";

import { useAuth } from "@/context/AuthContext";
import axiosInstance from "@/lib/axiosInstance";
import type {
  AuthUser,
  UserType,
} from "@/services/auth.service";

interface GoogleOAuthButtonProps {
  userType: UserType;
}

interface GoogleAuthResponse {
  success: boolean;
  message?: string;
  token: string;
  user: AuthUser;
}

const dashboardMap: Record<UserType, string> = {
  student: "/student/dashboard",
  fresher: "/fresher/dashboard",
  professional: "/professional/dashboard",
};

const isUserType = (
  value: unknown,
): value is UserType => {
  return (
    value === "student" ||
    value === "fresher" ||
    value === "professional"
  );
};

export default function GoogleOAuthButton({
  userType,
}: GoogleOAuthButtonProps) {
  const { login } = useAuth();
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  /*
   * Always holds the latest role received from
   * SignupForm or LoginForm.
   */
  const latestUserTypeRef =
    useRef<UserType>(userType);

  latestUserTypeRef.current = userType;

  const handleGoogleLogin = useGoogleLogin({
    flow: "auth-code",

    onSuccess: async (codeResponse) => {
      try {
        setLoading(true);

        const requestedUserType =
          latestUserTypeRef.current;

        console.log(
          "Role sent to Google API:",
          requestedUserType,
        );

        const { data } =
          await axiosInstance.post<GoogleAuthResponse>(
            "/api/auth/google",
            {
              code: codeResponse.code,
              userType: requestedUserType,
            },
          );

        if (
          !data.success ||
          !data.user ||
          !data.token
        ) {
          toast.error(
            data.message ||
              "Google login failed",
          );
          return;
        }

        if (
          !isUserType(data.user.userType)
        ) {
          toast.error(
            "Invalid user role returned by the server.",
          );
          return;
        }

        /*
         * The backend role is the final source
         * of truth, especially for existing users.
         */
        const authenticatedRole =
          data.user.userType;

        console.log(
          "Role returned by backend:",
          authenticatedRole,
        );

        login(data.user, data.token);

        localStorage.setItem(
          "selectedRole",
          authenticatedRole,
        );

        sessionStorage.removeItem(
          "oauthSelectedRole",
        );

        toast.success(
          "Google authentication successful!",
        );

        if (
          !data.user.onboardingCompleted
        ) {
          router.replace(
            "/onboarding/resume-upload",
          );
          return;
        }

        router.replace(
          dashboardMap[authenticatedRole],
        );
      } catch (error: unknown) {
        console.error(
          "Google authentication error:",
          error,
        );

        const message =
          isAxiosError<{
            message?: string;
          }>(error)
            ? error.response?.data?.message
            : error instanceof Error
              ? error.message
              : null;

        toast.error(
          message ||
            "Google sign-in failed",
        );
      } finally {
        setLoading(false);
      }
    },

    onError: () => {
      setLoading(false);

      toast.error(
        "Google sign-in popup was closed or authentication failed.",
      );
    },
  });

  const startGoogleLogin = () => {
    const selectedRole =
      latestUserTypeRef.current;

    /*
     * Persist before opening Google.
     */
    localStorage.setItem(
      "selectedRole",
      selectedRole,
    );

    sessionStorage.setItem(
      "oauthSelectedRole",
      selectedRole,
    );

    console.log(
      "Starting Google login with role:",
      selectedRole,
    );

    handleGoogleLogin();
  };

  return (
    <button
      type="button"
      onClick={startGoogleLogin}
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