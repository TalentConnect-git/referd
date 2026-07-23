"use client";

import {
  FormEvent,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { isAxiosError } from "axios";

import GoogleOAuthButton from "./GoogleOAuthButton";
import LinkedinLoginButton from "./LinkedinLoginButton";

import {
  loginUser,
  type UserType,
} from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

const roles: UserType[] = [
  "student",
  "fresher",
  "professional",
];

const dashboardMap: Record<UserType, string> = {
  student: "/student/dashboard",
  fresher: "/fresher/dashboard",
  professional: "/professional/dashboard",
};

const persistSelectedRole = (
  role: UserType,
) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    "selectedRole",
    role,
  );

  sessionStorage.setItem(
    "oauthSelectedRole",
    role,
  );
};

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  /*
   * Use one role state only.
   * This role is passed to both OAuth buttons.
   */
  const [role, setRole] =
    useState<UserType>("student");

  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");

  const [
    showPassword,
    setShowPassword,
  ] = useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const handleRoleChange = (
    selectedRole: UserType,
  ) => {
    if (isLoading) return;

    setRole(selectedRole);
    persistSelectedRole(selectedRole);
    setError("");
  };

  const handleLinkedInLogin = () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL;

    if (!backendUrl) {
      setError(
        "Backend URL is not configured.",
      );

      console.error(
        "NEXT_PUBLIC_API_URL is not defined",
      );

      return;
    }

    persistSelectedRole(role);

    window.location.href =
      `${backendUrl}/api/auth/linkedin` +
      `?userType=${encodeURIComponent(role)}`;
  };

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setError("");

    const cleanedEmail = email
      .trim()
      .toLowerCase();

    if (!cleanedEmail) {
      setError(
        "Please enter your email.",
      );
      return;
    }

    if (!password) {
      setError(
        "Please enter your password.",
      );
      return;
    }

    try {
      setIsLoading(true);

      const data = await loginUser({
        email: cleanedEmail,
        password,
      });

      /*
       * For email login, the backend role is
       * always the source of truth.
       */
      const authenticatedRole =
        data.user.userType;

      login(data.user, data.token);

      localStorage.setItem(
        "selectedRole",
        authenticatedRole,
      );

      sessionStorage.removeItem(
        "oauthSelectedRole",
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
      const message =
        isAxiosError<{
          message?: string;
        }>(error)
          ? error.response?.data?.message
          : error instanceof Error
            ? error.message
            : null;

      setError(
        message ||
          "Invalid email or password.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full border border-[var(--border)] bg-[var(--background)] px-7 py-8 text-white backdrop-blur-sm lg:w-[58%] lg:rounded-r-3xl lg:border-l-0 lg:px-10">
      <div className="space-y-1.5">
        <h2 className="text-[28px] font-bold tracking-[-0.02em] text-white lg:text-[32px]">
          Welcome back
        </h2>

        <p className="text-[14px] text-[var(--text-primary)]">
          Login to continue your journey
          with Referd
        </p>
      </div>

      {/* Role selection */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {roles.map((item) => {
          const isSelected =
            role === item;

          return (
            <button
              key={item}
              type="button"
              disabled={isLoading}
              aria-pressed={isSelected}
              onClick={() =>
                handleRoleChange(item)
              }
              className={`h-10 rounded-lg border font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-60 ${
                isSelected
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] text-white"
                  : "border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-white/25 hover:text-white"
              }`}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* OAuth buttons */}
      <div className="mt-8 space-y-3">
        <LinkedinLoginButton
          onClick={handleLinkedInLogin}
        />

        {/*
         * key={role} ensures that the Google
         * component is recreated after changing role.
         */}
        <GoogleOAuthButton
          key={role}
          userType={role}
        />
      </div>

      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Or continue with email
        </span>

        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-[13px] text-red-300"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={handleLogin}
        className="space-y-4"
      >
        {/* Email */}
        <div className="space-y-2">
          <label
            htmlFor="login-email"
            className="text-[12px] font-medium text-[var(--text-primary)]"
          >
            Email
          </label>

          <input
            id="login-email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="Enter your email"
            value={email}
            disabled={isLoading}
            onChange={(event) => {
              setEmail(event.target.value);
              setError("");
            }}
            className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-[14px] text-white outline-none transition-all duration-200 placeholder:text-[13px] placeholder:text-[var(--text-muted)] hover:border-white/20 focus:border-[var(--primary)] focus:bg-white/8 focus:ring-2 focus:ring-[var(--primary)]/20 disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Password */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-[12px] font-medium text-[var(--text-primary)]"
            >
              Password
            </label>

            <Link
              href="/reset-password"
              className="text-[12px] text-[var(--text-muted)] transition-all duration-200 hover:text-[var(--primary)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              disabled={isLoading}
              onChange={(event) => {
                setPassword(
                  event.target.value,
                );
                setError("");
              }}
              className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 pr-12 text-[14px] text-white outline-none transition-all duration-200 placeholder:text-[13px] placeholder:text-[var(--text-muted)] hover:border-white/20 focus:border-[var(--primary)] focus:bg-white/8 focus:ring-2 focus:ring-[var(--primary)]/20 disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              disabled={isLoading}
              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
              aria-pressed={showPassword}
              onClick={() =>
                setShowPassword(
                  (current) => !current,
                )
              }
              className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-[var(--text-muted)] transition hover:text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showPassword ? (
                <EyeOff size={18} />
              ) : (
                <Eye size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={isLoading}
          className="group relative mt-2 h-11 w-full overflow-hidden rounded-lg bg-gradient-to-r from-[var(--primary)] to-[#2d9e3e] text-[14px] font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_22px_rgba(49,170,64,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
        >
          <span
            className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${
              isLoading
                ? "opacity-0"
                : "opacity-100"
            }`}
          >
            Login
          </span>

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-5 w-5 animate-spin text-black"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />

                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </button>
      </form>

      <div className="my-7 h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      <p className="text-center text-[13px] text-[var(--text-primary)]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="ml-1 font-semibold text-white underline-offset-4 transition-all duration-200 hover:text-[var(--primary)] hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}