"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import GoogleLoginButton from "./GoogleLoginButton";
import LinkedinLoginButton from "./LinkedinLoginButton";

type UserRole = "student" | "fresher" | "professional";

export default function LoginForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userType] = useState<UserRole>("student");
  const [isLoading, setIsLoading] = useState(false);

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

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate async auth
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // replace later with backend auth
    router.push(getDashboardRoute(userType));
    setIsLoading(false);
  };

  return (
    <div
      className="
        w-full
        border
        border-[var(--border)]
        bg-[var(--background)]
        px-7
        py-8
        text-white
        backdrop-blur-sm
        lg:w-[58%]
        lg:rounded-r-3xl
        lg:border-l-0
        lg:px-10
      "
    >
      {/* Header Section */}
      <div className="space-y-1.5">
        <h2 className="text-[28px] font-bold tracking-[-0.02em] text-white lg:text-[32px]">
          Welcome back
        </h2>
        <p className="text-[14px] text-[var(--text-primary)]">
          Login to continue your journey with Referd
        </p>
      </div>

      {/* Social Login Buttons */}
      <div className="mt-8 space-y-3">
        <LinkedinLoginButton
          onClick={() => router.push(getDashboardRoute(userType))}
        />
        <GoogleLoginButton
          onClick={() => router.push(getDashboardRoute(userType))}
        />
      </div>

      {/* Divider */}
      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
        <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[var(--text-muted)]">
          Or continue with email
        </span>
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
      </div>

      {/* Email Login Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-2">
          <label className="text-[12px] font-medium text-[var(--text-primary)]">
            Username / Email
          </label>
          <input
            type="text"
            placeholder="Enter your username or email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="
              h-11
              w-full
              rounded-lg
              border
              border-white/10
              bg-white/5
              px-4
              text-[14px]
              text-white
              outline-none
              transition-all
              duration-200
              placeholder:text-[13px]
              placeholder:text-[var(--text-muted)]
              focus:border-[var(--primary)]
              focus:bg-white/8
              focus:ring-2
              focus:ring-[var(--primary)]/20
              hover:border-white/20
            "
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-[12px] font-medium text-[var(--text-primary)]">
              Password
            </label>
            <Link
              href="#"
              className="
                text-[12px]
                text-[var(--text-muted)]
                transition-all
                duration-200
                hover:text-[var(--primary)]
                hover:underline
              "
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
            className="
              h-11
              w-full
              rounded-lg
              border
              border-white/10
              bg-white/5
              px-4
              text-[14px]
              text-white
              outline-none
              transition-all
              duration-200
              placeholder:text-[13px]
              placeholder:text-[var(--text-muted)]
              focus:border-[var(--primary)]
              focus:bg-white/8
              focus:ring-2
              focus:ring-[var(--primary)]/20
              hover:border-white/20
            "
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="
            group
            relative
            mt-2
            h-11
            w-full
            overflow-hidden
            rounded-lg
            bg-gradient-to-r
            from-[var(--primary)]
            to-[#2d9e3e]
            text-[14px]
            font-semibold
            text-black
            transition-all
            duration-300
            hover:brightness-110
            hover:shadow-[0_0_22px_rgba(49,170,64,0.35)]
            hover:scale-[1.02]
            active:scale-[0.98]
            disabled:cursor-not-allowed
            disabled:opacity-70
            disabled:hover:scale-100
          "
        >
          <span className={`flex items-center hover:cursor-pointer justify-center gap-2 transition-opacity duration-200 ${isLoading ? "opacity-0" : "opacity-100"}`}>
            Login
          </span>
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="h-5 w-5 animate-spin text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="my-7 h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

      {/* Sign Up Link */}
      <p className="text-center text-[13px] text-[var(--text-primary)]">
        Don't have an account?{" "}
        <Link
          href="/signup"
          className="
            ml-1
            font-semibold
            text-white
            transition-all
            duration-200
            hover:text-[var(--primary)]
            hover:underline
            underline-offset-4
          "
        >
          Create account
        </Link>
      </p>
    </div>
  );
}