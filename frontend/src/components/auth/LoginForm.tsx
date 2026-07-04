"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import GoogleOAuthButton from "./GoogleOAuthButton";
import LinkedinLoginButton from "./LinkedinLoginButton";

import { loginUser, UserType } from "@/services/auth.service";
import { useAuth } from "@/context/AuthContext";

type UserRole = "student" | "fresher" | "professional";

export default function LoginForm() {
  const roles: UserType[] = ["student", "fresher", "professional"];
  const [role, setRole] = useState<UserType>("student");
  const router = useRouter();
  const { login } = useAuth();

  // Email/password state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // User type selection – used for OAuth signups
  const [selectedRole, setSelectedRole] = useState<UserRole>("student");

  const getDashboardRoute = (role: UserRole) => {
    switch (role) {
      case "professional":
        return "/professional/dashboard";
      case "fresher":
        return "/fresher/dashboard";
      case "student":
      default:
        return "/student/dashboard";
    }
  };

  // Email/password login
  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    try {
      setIsLoading(true);
      const data = await loginUser({ email, password });
      login(data.user, data.token);
      router.replace(getDashboardRoute(data.user.userType));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  // Role options configuration
  const roleOptions: { value: UserRole; label: string;}[] = [
    { value: "student", label: "Student"},
    { value: "fresher", label: "Fresher"},
    { value: "professional", label: "Professional"},
  ];

  return (
    <div className="w-full border border-[var(--border)] bg-[var(--background)] px-7 py-8 text-white backdrop-blur-sm lg:w-[58%] lg:rounded-r-3xl lg:border-l-0 lg:px-10">
      <div className="space-y-1.5">
        <h2 className="text-[28px] font-bold tracking-[-0.02em] text-white lg:text-[32px]">
          Welcome back
        </h2>
        <p className="text-[14px] text-[var(--text-primary)]">
          Login to continue your journey with Referd
        </p>
      </div>

       <div className="mt-6 grid grid-cols-3 gap-3">
        {roles.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setRole(item)}
            className={`h-10 rounded-lg border font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-60 ${
              role === item
                ? "border-[var(--primary)] bg-[var(--primary-soft)] text-white"
                : "border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-white/25 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

       {/* <div className="mt-6 grid grid-cols-3 gap-3">
        {roles.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setRole(item)}
            className={`h-10 rounded-lg border font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-60 ${
              role === item
                ? "border-[var(--primary)] bg-[var(--primary-soft)] text-white"
                : "border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-white/25 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div> */}

      {/* User Type Selector - Row based selection */}
      {/* <div className="mt-4 mb-6"> */}
        {/* <label className="mb-2 block text-sm text-[var(--text-primary)]">
          I am a
        </label> */}

        {/* <div className="mt-6 grid grid-cols-3 gap-3">
          {roleOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setSelectedRole(option.value)}
              className={`h-10 rounded-lg border font-mono text-[10px] font-semibold uppercase tracking-[0.16em] transition disabled:cursor-not-allowed disabled:opacity-60 ${
                selectedRole === option.value
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] text-white"
                  : "border-[var(--border)] bg-transparent text-[var(--text-primary)] hover:border-white/25 hover:text-white"
              }`}
            >
             
              {option.label}
            </button>
          ))}
        </div> */}
      {/* </div> */}

      {/* OAuth Buttons */}
      <div className="mt-8 space-y-3">
        <LinkedinLoginButton onClick={() => {window.location.href =
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/linkedin?userType=${role}`;
        }} />
        {/* <LinkedinLoginButton userType={selectedRole} /> */}
        <GoogleOAuthButton userType={selectedRole} />
      </div>

      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Or continue with email
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      </div>

      {error && (
        <div className="mb-4 rounded-lg border border-red-400/30 bg-red-400/10 px-4 py-3 text-[13px] text-red-300">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[12px] font-medium text-[var(--text-primary)]">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-[14px] text-white outline-none transition-all duration-200 placeholder:text-[13px] placeholder:text-[var(--text-muted)] hover:border-white/20 focus:border-[var(--primary)] focus:bg-white/8 focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-[var(--text-primary)]">
              Password
            </label>
            <Link
              href="/reset-password"
              className="text-[12px] text-[var(--text-muted)] transition-all duration-200 hover:text-[var(--primary)] hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-11 w-full rounded-lg border border-white/10 bg-white/5 px-4 text-[14px] text-white outline-none transition-all duration-200 placeholder:text-[13px] placeholder:text-[var(--text-muted)] hover:border-white/20 focus:border-[var(--primary)] focus:bg-white/8 focus:ring-2 focus:ring-[var(--primary)]/20"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="group relative mt-2 h-11 w-full overflow-hidden rounded-lg bg-gradient-to-r from-[var(--primary)] to-[#2d9e3e] text-[14px] font-semibold text-black transition-all duration-300 hover:scale-[1.02] hover:brightness-110 hover:shadow-[0_0_22px_rgba(49,170,64,0.35)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
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
