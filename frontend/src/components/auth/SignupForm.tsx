"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, User, GraduationCap, Briefcase } from "lucide-react";

import { useAuth } from "@/context/AuthContext";
import {
  sendSignupOtp,
  signupUser,
  type UserType,
} from "@/services/auth.service";

import GoogleOAuthButton from "./GoogleOAuthButton";
import LinkedinLoginButton from "./LinkedinLoginButton";

const roles: { value: UserType; label: string; icon: React.ReactNode }[] = [
  { value: "student", label: "Student", icon: <GraduationCap size={16} /> },
  { value: "fresher", label: "Fresher", icon: <User size={16} /> },
  { value: "professional", label: "Professional", icon: <Briefcase size={16} /> },
];

// Email regex - validates standard email format
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Password regex - requires at least 8 characters, one uppercase, one lowercase, one number, and one special character
const passwordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&^#()_\-+=])[A-Za-z\d@$!%*?&^#()_\-+=]{8,128}$/;

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
      : "professional";
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

        // Email validation
        if (!emailRegex.test(cleanedEmail)) {
          setOtpError(
            "Please enter a valid email address (e.g., user@example.com).",
          );
          return;
        }

        if (!password) {
          setOtpError(
            "Please enter a password.",
          );
          return;
        }

        // Password validation
        if (!passwordRegex.test(password)) {
          setOtpError(
            "Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.",
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

      if (!/^\d{6}$/.test(otp)) {
        setOtpError(
          "Please enter a valid 6-digit OTP.",
        );
        return;
      }

      persistSelectedRole(role);

      const data = await signupUser({
        email: email.trim().toLowerCase(),
        password,
        userType: role,
        otp,
      });

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
    <div className="w-full border border-[var(--border)] bg-[var(--card)] px-5 py-6 text-[var(--text-primary)] backdrop-blur-sm sm:px-6 sm:py-8 lg:w-[60%] lg:rounded-r-3xl lg:border-l-0 lg:px-10">
      <h2 className="text-2xl font-bold tracking-[-0.04em] text-[var(--text-primary)] sm:text-[24px]">
        Create your Referd account
      </h2>

      <p className="mt-1 text-sm text-[var(--text-secondary)]">
        Choose your role and continue.
      </p>

      {/* Role selection - Enhanced with icons */}
      <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-3">
        {roles.map((item) => {
          const isSelected = role === item.value;

          return (
            <button
              key={item.value}
              type="button"
              disabled={
                showOtpField || loading
              }
              aria-pressed={isSelected}
              onClick={() =>
                handleRoleChange(item.value)
              }
              className={`
                relative flex flex-col items-center justify-center gap-1.5
                rounded-xl border-2 px-3 py-3 text-center transition-all duration-200
                disabled:cursor-not-allowed disabled:opacity-60
                ${isSelected
                  ? "border-[var(--primary)] bg-[var(--primary-soft)] shadow-lg shadow-[var(--primary)]/10 scale-[1.02]"
                  : "border-[var(--border)] bg-[var(--background-soft)] hover:border-[var(--border-strong)] hover:bg-[var(--card-hover)] hover:scale-[1.01]"
                }
              `}
            >
              {/* Icon */}
              <span className={`transition-colors duration-200 ${
                isSelected ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
              }`}>
                {item.icon}
              </span>
              
              {/* Label */}
              <span className={`text-[10px] font-semibold uppercase tracking-[0.08em] transition-colors duration-200 sm:text-[11px] ${
                isSelected ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
              }`}>
                {item.label}
              </span>

              {/* Active indicator bar */}
              {isSelected && (
                <span className="absolute -bottom-[1px] left-1/2 h-0.5 w-8 -translate-x-1/2 rounded-full bg-[var(--primary)]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Social signup */}
      <div className="mt-6 space-y-3 sm:mt-8">
        <LinkedinLoginButton
          onClick={handleLinkedInSignup}
        />

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

      <div className="my-6 flex items-center gap-3 sm:my-7">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />

        <span className="whitespace-nowrap font-mono text-[10px] font-medium uppercase tracking-[0.18em] text-[var(--text-muted)] sm:text-[11px]">
          Or manual entry
        </span>

        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[var(--border)] to-transparent" />
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
              className="input-field h-10 w-full rounded-xl px-4 text-sm placeholder:text-sm placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-60"
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
                placeholder="Password (min 8 chars)"
                value={password}
                disabled={loading}
                onChange={(event) => {
                  setPassword(
                    event.target.value,
                  );
                  setOtpError("");
                }}
                className="input-field h-10 w-full rounded-xl px-4 pr-12 text-sm placeholder:text-sm placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-60"
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
                className="absolute right-0 top-0 flex h-10 w-11 items-center justify-center text-[var(--text-muted)] transition hover:text-[var(--text-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
                className="input-field h-10 w-full rounded-xl px-4 pr-12 text-sm placeholder:text-sm placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-60"
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
                className="absolute right-0 top-0 flex h-10 w-11 items-center justify-center text-[var(--text-muted)] transition hover:text-[var(--text-primary)] focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              >
                {showConfirmPassword ? (
                  <EyeOff size={17} />
                ) : (
                  <Eye size={17} />
                )}
              </button>
            </div>

            {/* Password requirements hint */}
            <p className="text-[10px] leading-4 text-[var(--text-muted)]">
              Password must contain: 8+ chars, uppercase, lowercase, number, and special character
            </p>
          </>
        ) : (
          <>
            <p className="text-xs leading-5 text-[var(--text-secondary)]">
              We sent a verification OTP
              to{" "}
              <span className="font-semibold text-[var(--text-primary)]">
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
              className="input-field h-10 w-full rounded-xl px-4 text-center font-mono text-sm tracking-[0.35em] placeholder:text-sm placeholder:text-[var(--text-muted)] focus:ring-2 focus:ring-[var(--focus-ring)] disabled:opacity-60"
            />

            <button
              type="button"
              disabled={loading}
              onClick={() => {
                setShowOtpField(false);
                setOtp("");
                setOtpError("");
              }}
              className="text-xs text-[var(--text-secondary)] transition hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Change email or password
            </button>
          </>
        )}

        {/* Validation/API error */}
        {otpError && (
          <p
            role="alert"
            className="text-xs text-[var(--danger)]"
          >
            {otpError}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="btn-primary h-10 w-full rounded-xl text-sm font-semibold text-black transition-all duration-300 hover:brightness-110 hover:shadow-[0_0_22px_rgba(49,170,64,0.28)] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
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

      <div className="my-6 h-px w-full bg-gradient-to-r from-transparent via-[var(--border)] to-transparent sm:my-7" />

      <p className="text-center text-xs text-[var(--text-secondary)]">
        Already have an account?{" "}
        <Link
          href="/login"
          style={{ color: "#16a34a" }}
          className="ml-1 font-semibold text-sm transition-colors duration-200 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}