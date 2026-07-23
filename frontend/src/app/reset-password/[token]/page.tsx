"use client";

import { FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Loader2,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  resetPassword,
  validateResetToken,
} from "@/services/auth.service";

export default function ResetPasswordPage() {
  const router = useRouter();
  const params = useParams<{ token: string }>();

  const token = params?.token;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [validating, setValidating] = useState(true);
  const [validToken, setValidToken] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // New state for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      if (!token) {
        toast.error("No reset token provided");
        setValidating(false);
        setValidToken(false);
        return;
      }

      try {
        setValidating(true);

        const response = await validateResetToken(token);

        if (response.success) {
          setValidToken(true);
          setEmail(response.email || "");
        } else {
          setValidToken(false);
          toast.error(response.message || "Invalid reset link");
        }
      } catch (error) {
        setValidToken(false);

        toast.error(
          error instanceof Error
            ? error.message
            : "Invalid or expired reset link",
        );
      } finally {
        setValidating(false);
      }
    };

    checkToken();
  }, [token]);

  const validatePassword = () => {
    if (!password.trim()) {
      setPasswordError("Please enter your new password");
      return false;
    }

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      return false;
    }

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }

    setPasswordError("");
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error("Reset token missing");
      return;
    }

    if (!validatePassword()) return;

    try {
      setLoading(true);

      const response = await resetPassword(token, password);

      if (response.success) {
        toast.success(response.message || "Password reset successfully");

        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } else {
        toast.error(response.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to reset password. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[var(--background)] px-5 text-white">
        <div className="text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--primary)]" />
          <p className="mt-4 text-sm text-[var(--text-primary)]">
            Validating reset link...
          </p>
        </div>
      </main>
    );
  }

  if (!validToken) {
    return (
      <main className="min-h-screen bg-[var(--background)] px-5 py-10 text-white">
        <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-md flex-col justify-center">
          <div className="rounded-3xl border border-[var(--border)] bg-white/[0.02] p-7 text-center shadow-2xl">
            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500/10">
              <AlertCircle className="h-7 w-7 text-red-500" />
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.04em]">
              Invalid Reset Link
            </h1>

            <p className="mt-2 text-sm text-[var(--text-primary)]">
              This reset link is invalid, expired, or already used.
            </p>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.03] p-4 text-left">
              <p className="text-xs font-semibold">Common reasons:</p>

              <ul className="mt-2 space-y-1 text-xs text-[var(--text-primary)]">
                <li>• Link expired after 15 minutes</li>
                <li>• Link already used</li>
                <li>• Invalid or malformed token</li>
              </ul>
            </div>

            <div className="mt-6 space-y-3">
              <Link
                href="/forgot-password"
                className="button-color flex h-11 w-full items-center justify-center rounded-lg text-[13px] font-semibold text-black"
              >
                Request New Reset Link
              </Link>

              <Link
                href="/login"
                className="flex h-11 w-full items-center justify-center rounded-lg border border-white/10 text-[13px] font-semibold hover:bg-white/10"
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-10 text-white">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-md flex-col justify-center">
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mb-6 flex w-fit items-center gap-2 text-sm font-medium text-[var(--text-primary)] transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>

        <div className="w-full rounded-3xl border border-[var(--border)] bg-white/[0.02] p-7 shadow-2xl">
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)]">
              <Lock className="h-7 w-7 text-[var(--primary)]" />
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.04em]">
              Create New Password
            </h1>

            <p className="mt-2 text-sm text-[var(--text-primary)]">
              Enter your new password below.
            </p>

            {email && (
              <p className="mt-3 break-all rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-[var(--primary)]">
                {email}
              </p>
            )}

            <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-green-500/10 px-3 py-1 text-xs font-semibold text-green-400">
              <CheckCircle className="h-3.5 w-3.5" />
              Valid reset link
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Password input with eye icon */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                disabled={loading}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Enter new password"
                className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 pr-11 text-[13px] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-primary)] transition hover:text-white"
                disabled={loading}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Confirm password input with eye icon */}
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                disabled={loading}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  setPasswordError("");
                }}
                placeholder="Confirm new password"
                className="h-11 w-full rounded-lg border border-white/10 bg-white/[0.03] px-4 pr-11 text-[13px] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-primary)] transition hover:text-white"
                disabled={loading}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>

            {passwordError && (
              <p className="rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-xs text-red-400">
                {passwordError}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="button-color flex h-11 w-full items-center justify-center rounded-lg text-[13px] font-semibold text-black disabled:opacity-60"
            >
              {loading ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}