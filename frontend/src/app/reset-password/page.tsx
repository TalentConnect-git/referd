"use client";

import { FormEvent, useState } from "react";
import { Mail, CheckCircle, RotateCcw, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { requestPasswordReset } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await requestPasswordReset(trimmedEmail);

      if (response.success) {
        toast.success(response.message || "Reset link sent to your email");
        setSubmitted(true);
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send reset link. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[var(--background)] px-5 py-10">
      <div className="mx-auto flex min-h-[calc(100vh-80px)] w-full max-w-md flex-col justify-center">
        {/* Back Button */}
        <button
          type="button"
          onClick={() => router.push("/login")}
          className="mb-6 flex w-fit items-center gap-2 text-sm font-medium text-[var(--text-secondary)] transition-all hover:text-[var(--text-primary)] hover:gap-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Login
        </button>

        {/* Main Card */}
        <div className="surface-card w-full p-7 shadow-lg">
          {/* Header Section */}
          <div className="mb-7 text-center">
            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)]">
              {submitted ? (
                <CheckCircle className="h-7 w-7 text-[var(--primary)]" />
              ) : (
                <Mail className="h-7 w-7 text-[var(--primary)]" />
              )}
            </div>

            <h1 className="text-2xl font-bold tracking-[-0.04em] text-[var(--text-primary)]">
              {submitted ? "Check Your Email" : "Reset Password"}
            </h1>

            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {submitted
                ? "We have sent password reset instructions to your email."
                : "Enter your email to receive a password reset link."}
            </p>
          </div>

          {/* Form or Success Message */}
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label 
                  htmlFor="email"
                  className="form-label"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  disabled={loading}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="input-field"
                />
              </div>

              <p className="text-xs text-[var(--text-muted)]">
                This reset link will be valid for 15 minutes only.
              </p>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    Sending...
                  </span>
                ) : (
                  "Get Reset Link"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5 text-center">
              {/* Success Message Box */}
              <div className="rounded-2xl border border-[var(--primary-border)] bg-[var(--primary-soft)] p-4">
                <p className="text-sm font-medium text-[var(--text-secondary)]">
                  Reset link sent to:
                </p>

                <p className="mt-1 break-all text-sm font-semibold text-[var(--primary)]">
                  {email}
                </p>
              </div>

              {/* Info Box */}
              <div className="rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-4 text-left">
                <p className="text-xs leading-5 text-[var(--text-secondary)]">
                  The password reset link will be valid for{" "}
                  <span className="font-semibold text-[var(--text-primary)]">15 minutes</span>.
                  Please also check your spam folder.
                </p>
              </div>

              {/* Resend Button */}
              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="btn-secondary w-full"
              >
                <RotateCcw className="h-4 w-4" />
                Send Again Reset Link
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}