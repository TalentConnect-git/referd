"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import {
  sendSignupOtp,
  signupUser,
  type UserType,
} from "@/services/auth.service";

import GoogleOAuthButton from "./GoogleOAuthButton";
import LinkedinLoginButton from "./LinkedinLoginButton";

const roles: UserType[] = [
  "student",
  "fresher",
  "professional",
];

const isUserType = (
  value: string | null,
): value is UserType => {
  return (
    value === "student" ||
    value === "fresher" ||
    value === "professional"
  );
};

const persistSelectedRole = (
  selectedRole: UserType,
) => {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    "selectedRole",
    selectedRole,
  );

  sessionStorage.setItem(
    "oauthSignupRole",
    selectedRole,
  );
};

export default function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const queryRole = searchParams.get("role");

  const [role, setRole] = useState<UserType>(() => {
    return isUserType(queryRole)
      ? queryRole
      : "student";
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] =
    useState("");
  const [
    confirmPassword,
    setConfirmPassword,
  ] = useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [showOtpField, setShowOtpField] =
    useState(false);

  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] =
    useState("");
  const [loading, setLoading] =
    useState(false);

  /*
   * Handle role received through query parameter.
   * Example: /signup?role=professional
   */
  useEffect(() => {
    if (isUserType(queryRole)) {
      setRole(queryRole);
      persistSelectedRole(queryRole);
    }
  }, [queryRole]);

  const handleRoleChange = (
    selectedRole: UserType,
  ) => {
    if (showOtpField || loading) return;

    setRole(selectedRole);
    setOtpError("");
    persistSelectedRole(selectedRole);
  };

  const handleLinkedInSignup = () => {
    const backendUrl =
      process.env.NEXT_PUBLIC_API_URL;

    if (!backendUrl) {
      setOtpError(
        "Backend URL is not configured.",
      );

      console.error(
        "NEXT_PUBLIC_API_URL is not defined",
      );

      return;
    }

    // Store the role before leaving the website.
    persistSelectedRole(role);

    window.location.href =
      `${backendUrl}/api/auth/linkedin` +
      `?userType=${encodeURIComponent(role)}`;
  };

  const handleSignup = async (
    event: FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setOtpError("");

    try {
      setLoading(true);

      /*
       * First step: validate details and send OTP.
       */
      if (!showOtpField) {
        const cleanedEmail = email
          .trim()
          .toLowerCase();

        if (!cleanedEmail) {
          setOtpError(
            "Please enter your email.",
          );
          return;
        }

        if (!password) {
          setOtpError(
            "Please enter a password.",
          );
          return;
        }

        if (password.length < 6) {
          setOtpError(
            "Password must contain at least 6 characters.",
          );
          return;
        }

        if (!confirmPassword) {
          setOtpError(
            "Please confirm your password.",
          );
          return;
        }

        if (password !== confirmPassword) {
          setOtpError(
            "Passwords do not match.",
          );
          return;
        }

        setEmail(cleanedEmail);

        await sendSignupOtp(cleanedEmail);

        setShowOtpField(true);
        setOtp("");
        return;
      }

      /*
       * Second step: verify OTP and create account.
       */
      if (!/^\d{6}$/.test(otp)) {
        setOtpError(
          "Please enter a valid 6-digit OTP.",
        );
        return;
      }

      // Store it immediately before signup.
      persistSelectedRole(role);

      const data = await signupUser({
        email: email.trim().toLowerCase(),
        password,
        userType: role,
        otp,
      });

      /*
       * Use the role returned by the backend as
       * the final source of truth.
       */
      const authenticatedRole =
        data.user.userType;

      login(data.user, data.token);

      persistSelectedRole(
        authenticatedRole,
      );

      router.replace(
        "/onboarding/resume-upload",
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.";

      setOtpError(message);
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

      {/* Role selection */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {roles.map((item) => {
          const isSelected = role === item;

          return (
            <button
              key={item}
              type="button"
              disabled={
                showOtpField || loading
              }
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

      {/* Social signup */}
      <div className="mt-6 space-y-3">
        <LinkedinLoginButton
          onClick={handleLinkedInSignup}
        />

        {/*
         * key={role} remounts the Google component
         * when the selected role changes.
         *
         * onClickCapture saves the role before the
         * Google button's own click handler executes.
         */}
        <div
          onClickCapture={() =>
            persistSelectedRole(role)
          }
        >
          <GoogleOAuthButton
            key={role}
            userType={role}
          />
        </div>
      </div>

      <div className="my-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-[var(--border)]" />

        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-primary)]">
          Or manual entry
        </span>

        <div className="h-px flex-1 bg-[var(--border)]" />
      </div>

      <form
        onSubmit={handleSignup}
        className="space-y-3"
      >
        {!showOtpField ? (
          <>
            {/* Email */}
            <input
              type="email"
              name="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              disabled={loading}
              onChange={(event) => {
                setEmail(event.target.value);
                setOtpError("");
              }}
              className="h-10 w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 text-[13px] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 disabled:opacity-60"
            />

            {/* Password */}
            <div className="relative">
              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                name="password"
                autoComplete="new-password"
                placeholder="Password"
                value={password}
                disabled={loading}
                onChange={(event) => {
                  setPassword(
                    event.target.value,
                  );
                  setOtpError("");
                }}
                className="h-10 w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 pr-12 text-[13px] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 disabled:opacity-60"
              />

              <button
                type="button"
                disabled={loading}
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
                className="absolute right-0 top-0 flex h-10 w-11 items-center justify-center text-[var(--text-muted)] transition hover:text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            {/* Confirm password */}
            <div className="relative">
              <input
                type={
                  showConfirmPassword
                    ? "text"
                    : "password"
                }
                name="confirmPassword"
                autoComplete="new-password"
                placeholder="Confirm Password"
                value={confirmPassword}
                disabled={loading}
                onChange={(event) => {
                  setConfirmPassword(
                    event.target.value,
                  );
                  setOtpError("");
                }}
                className="h-10 w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 pr-12 text-[13px] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 disabled:opacity-60"
              />

              <button
                type="button"
                disabled={loading}
                aria-label={
                  showConfirmPassword
                    ? "Hide confirm password"
                    : "Show confirm password"
                }
                aria-pressed={
                  showConfirmPassword
                }
                onClick={() =>
                  setShowConfirmPassword(
                    (current) => !current,
                  )
                }
                className="absolute right-0 top-0 flex h-10 w-11 items-center justify-center text-[var(--text-muted)] transition hover:text-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="text-[12px] leading-5 text-[var(--text-primary)]">
              We sent a verification OTP
              to{" "}
              <span className="font-semibold text-white">
                {email}
              </span>
            </p>

            <input
              type="text"
              name="otp"
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="123456"
              value={otp}
              maxLength={6}
              disabled={loading}
              onChange={(event) => {
                const numericValue =
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                setOtp(numericValue);
                setOtpError("");
              }}
              className="h-10 w-full rounded-lg border border-white/10 bg-[var(--background)] px-4 text-center font-mono text-[14px] tracking-[0.35em] text-white outline-none transition placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary)]/15 disabled:opacity-60"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setShowOtpField(false);
                setOtp("");
                setOtpError("");
              }}
              className="text-[12px] text-[var(--text-primary)] transition hover:text-[var(--primary)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Change email or password
            </button>
          </>
        )}

        {/* Validation/API error */}
        {otpError && (
          <p
            role="alert"
            className="text-[12px] text-red-400"
          >
            {otpError}
          </p>
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