"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { sendSignupOtp, signupUser, UserType } from "@/services/auth.service";

import GoogleOAuthButton from "./GoogleOAuthButton";
import LinkedinLoginButton from "./LinkedinLoginButton";

const roles: UserType[] = ["student", "fresher", "professional"];

export default function SignupForm() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<UserType>("student");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showOtpField, setShowOtpField] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [loading, setLoading] = useState(false);

  const getNextRoute = () => {
    return "/onboarding/resume-upload";
  };

  const handleSignup = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setOtpError("");

    try {
      setLoading(true);

      if (!showOtpField) {
        if (!email) {
          setOtpError("Please enter your email");
          return;
        }
        if (!password) {
          setOtpError("Please enter a password");
          return;
        }
        if (password !== confirmPassword) {
          setOtpError("Passwords do not match");
          return;
        }

        await sendSignupOtp(email);
        setShowOtpField(true);
        return;
      }

      if (otp.length !== 6) {
        setOtpError("Please enter a valid 6-digit OTP");
        return;
      }

      const data = await signupUser({
        email,
        password,
        userType: role,
        otp,
      });

      login(data.user, data.token);
      localStorage.setItem("selectedRole", role);

      router.push(getNextRoute());
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Something went wrong";

      setOtpError(message);
      alert(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full border border-[var(--border)] bg-[var(--background)] px-7 py-8 text-white lg:w-[60%] lg:rounded-r-3xl lg:border-l-0 lg:px-10">
      <h2 className="text-[24px] font-bold tracking-[-0.04em] text-white">
        Create your Referd account
      </h2>

      <p className="mt-1 text-[13px] text-[var(--text-primary)]">
        Choose your role and continue.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-3">
        {roles.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setRole(item)}
            disabled={showOtpField || loading}
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

      <div className="mt-6 space-y-3">
        <LinkedinLoginButton />
        <GoogleOAuthButton userType={role} />
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--border)]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-primary)]">
          Or manual entry
        </span>
        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form onSubmit={handleSignup} className="space-y-3">
        {!showOtpField ? (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="h-10 w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 text-[13px] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 disabled:opacity-60"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="h-10 w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 text-[13px] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 disabled:opacity-60"
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              disabled={loading}
              className="h-10 w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 text-[13px] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 disabled:opacity-60"
            />
          </>
        ) : (
          <>
            <p className="text-[12px] leading-5 text-[var(--text-primary)]">
              We sent a verification OTP to{" "}
              <span className="font-semibold text-white">{email}</span>
            </p>

            <input
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => {
                setOtp(e.target.value.replace(/\D/g, ""));
                setOtpError("");
              }}
              required
              maxLength={6}
              disabled={loading}
              className="h-10 w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 text-center font-mono text-[14px] tracking-[0.35em] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 disabled:opacity-60"
            />

            {otpError && <p className="text-[12px] text-red-400">{otpError}</p>}

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setShowOtpField(false);
                setOtp("");
                setOtpError("");
              }}
              className="text-[12px] text-[var(--text-primary)] transition hover:text-[var(--primary)] disabled:opacity-60"
            >
              Change email
            </button>
          </>
        )}

        <button
          type="submit"
          disabled={loading}
          className="button-color h-10 w-full rounded-lg text-[13px] font-semibold text-black transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_22px_rgba(49,170,64,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading
            ? showOtpField
              ? "Verifying..."
              : "Sending OTP..."
            : showOtpField
              ? "Verify OTP"
              : "Enter Portal"}
        </button>
      </form>

      <div className="my-6 h-px w-full bg-[var(--border)]" />

      <p className="text-center text-[12px] text-[var(--text-primary)]">
        Already have an account?{" "}
        <Link
          href="/login"
          className="font-semibold text-white transition hover:text-[var(--primary)]"
        >
          Log In
        </Link>
      </p>
    </div>
  );
}
