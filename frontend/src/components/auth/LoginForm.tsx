"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, User, GraduationCap, Briefcase } from "lucide-react";
import { isAxiosError } from "axios";

import GoogleOAuthButton from "./GoogleOAuthButton";
import LinkedinLoginButton from "./LinkedinLoginButton";

import { loginUser, type UserType } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

const roles: { value: UserType; label: string; icon: React.ReactNode }[] = [
  { value: "student", label: "Student", icon: <GraduationCap size={16} /> },
  { value: "fresher", label: "Fresher", icon: <User size={16} /> },
  {
    value: "professional",
    label: "Professional",
    icon: <Briefcase size={16} />,
  },
];

const dashboardMap: Record<UserType, string> = {
  student: "/student/dashboard",
  fresher: "/fresher/dashboard",
  professional: "/professional/dashboard",
};

// Email regex - validates standard email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password regex - requires at least 8 characters, one uppercase, one lowercase, one number, and one special character
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,128}$/;

const persistSelectedRole = (role: UserType) => {
  if (typeof window === "undefined") return;

  localStorage.setItem("selectedRole", role);

  sessionStorage.setItem("oauthSelectedRole", role);
};

export default function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<UserType>("student");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");

  const handleRoleChange = (selectedRole: UserType) => {
    if (isLoading) return;

    setRole(selectedRole);
    persistSelectedRole(selectedRole);
    setError("");
  };

  const handleLinkedInLogin = () => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!backendUrl) {
      setError("Backend URL is not configured.");

      console.error("NEXT_PUBLIC_API_URL is not defined");

      return;
    }

    persistSelectedRole(role);

    window.location.href =
      `${backendUrl}/api/auth/linkedin` +
      `?userType=${encodeURIComponent(role)}`;
  };

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    const cleanedEmail = email.trim().toLowerCase();

    if (!cleanedEmail) {
      setError("Please enter your email.");
      return;
    }

    // Email validation
    if (!emailRegex.test(cleanedEmail)) {
      setError("Please enter a valid email address (e.g., user@example.com).");
      return;
    }

    if (!password) {
      setError("Please enter your password.");
      return;
    }

    // Password validation
    if (!passwordRegex.test(password)) {
      setError(
        "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character."
      );
      return;
    }

    try {
      setIsLoading(true);

      const data = await loginUser({
        email: cleanedEmail,
        password,
      });

      const authenticatedRole = data.user.userType;

      const allowedRoles: UserType[] = ["student", "fresher", "professional"];

      if (!allowedRoles.includes(authenticatedRole as UserType)) {
        setError(
          "You are not authorized to log in to this portal. Only Student, Fresher, and Professional accounts are allowed.",
        );
        return;
      }

      login(data.user, data.token);

      localStorage.setItem("selectedRole", authenticatedRole);

      sessionStorage.removeItem("oauthSelectedRole");

      if (!data.user.onboardingCompleted) {
        router.replace("/onboarding/resume-upload");
        return;
      }

      router.replace(dashboardMap[authenticatedRole]);
    } catch (error: unknown) {
      const message = isAxiosError<{
        message?: string;
      }>(error)
        ? error.response?.data?.message
        : error instanceof Error
          ? error.message
          : null;

      setError(message || "Invalid email or password.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full border border-[var(--border)] bg-[var(--card)] px-5 py-6 text-[var(--text-primary)] backdrop-blur-sm sm:px-6 sm:py-8 lg:w-[58%] lg:rounded-r-3xl lg:border-l-0 lg:px-10">
      <div className="space-y-1.5">
        <h2 className="text-2xl font-bold tracking-[-0.02em] text-[var(--text-primary)] sm:text-[28px] lg:text-[32px]">
          Welcome back
        </h2>

        <p className="text-sm text-[var(--text-secondary)]">
          Login to continue your journey with Referd
        </p>
      </div>

      

      {/* OAuth buttons */}
      <div className="mt-6 space-y-3 sm:mt-8">
        <LinkedinLoginButton onClick={handleLinkedInLogin} />

        <GoogleOAuthButton key={role} userType={role} />
      </div>

      <div className="my-6 flex items-center gap-3 sm:my-7">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

        <span className="whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)] sm:text-[11px]">
          Or continue with email
        </span>

        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      </div>

      {error && (
        <div
          role="alert"
          className="mb-4 rounded-xl border border-[var(--danger-border)] bg-[var(--danger-soft)] px-4 py-3 text-sm text-[var(--danger)]"
        >
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label
            htmlFor="login-email"
            className="text-xs font-medium text-[var(--text-secondary)]"
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
            className="input-field h-11 w-full rounded-xl px-4 text-sm placeholder:text-sm placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
          />
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label
              htmlFor="login-password"
              className="text-xs font-medium text-[var(--text-secondary)]"
            >
              Password
            </label>

            <Link
              href="/reset-password"
              className="text-xs text-[var(--text-muted)] transition-all duration-200 hover:text-[var(--text-primary)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <div className="relative">
            <input
              id="login-password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              disabled={isLoading}
              onChange={(event) => {
                setPassword(event.target.value);
                setError("");
              }}
              className="input-field h-11 w-full rounded-xl px-4 pr-12 text-sm placeholder:text-sm placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--focus-ring)] disabled:cursor-not-allowed disabled:opacity-60"
            />

            <button
              type="button"
              disabled={isLoading}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
              onClick={() => setShowPassword((current) => !current)}
              className="absolute right-0 top-0 flex h-11 w-11 items-center justify-center text-[var(--text-muted)] transition hover:text-[var(--text-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Password requirements hint */}
          <p className="text-[10px] leading-4 text-[var(--text-muted)]">
            Password must contain: 8+ chars, uppercase, lowercase, number, and special character
          </p>
        </div>

        {/* Login button */}
        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary group relative mt-2 h-11 w-full overflow-hidden rounded-xl bg-gradient-to-r from-[var(--primary)] to-[var(--primary-hover)] text-sm font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_22px_rgba(49,170,64,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
        >
          <span
            className={`flex items-center justify-center gap-2 transition-opacity duration-200 ${
              isLoading ? "opacity-0" : "opacity-100"
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

      <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent sm:my-7" />

      <p className="text-center text-sm text-[var(--text-secondary)]">
        Don&apos;t have an account?{" "}
        <Link
          href="/signup"
          className="ml-1 font-semibold text-[var(--primary)] underline-offset-4 transition-all duration-200 hover:text-[var(--primary-hover)] hover:underline"
        >
          Create account
        </Link>
      </p>
    </div>
  );
}