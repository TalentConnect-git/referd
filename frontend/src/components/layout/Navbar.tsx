"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import logo from "@/assets/icon.png";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Referrals", href: "#referrals" },
  { label: "Network", href: "#network" },
  { label: "How it works", href: "#how-it-works" },
];

export default function Navbar() {
  const router = useRouter();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  // ---------- Derived display values ----------
  const displayName = useMemo(() => {
    if (profile?.fullName) return profile.fullName;
    if (profile?.name) return profile.name;
    if (user?.name) return user.name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  }, [profile, user]);

  const displayEmail = useMemo(() => {
    return profile?.email || user?.email || "";
  }, [profile, user]);

  const userType = useMemo(() => {
    return profile?.profileType || user?.userType || "student";
  }, [profile, user]);

  // ---------- Routes ----------
  const getProfileRoute = () => {
    switch (userType) {
      case "professional":
        return "/professional/profile";
      case "fresher":
        return "/fresher/profile";
      default:
        return "/student/profile";
    }
  };

  const getDashboardRoute = () => {
    switch (userType) {
      case "professional":
        return "/professional/home";
      case "fresher":
        return "/fresher/home";
      case "student":
      default:
        return "/student/home";
    }
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-13 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-0.5 group">
            {/* Logo Image */}
            <div className="relative h-5 w-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Image
                src={logo}
                alt="Referd Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Text with dot */}
            <span className="text-[13px] font-medium tracking-tight text-white transition-colors duration-200 group-hover:text-[var(--primary)]">
              referd
              <span className="text-[var(--primary)]">.</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-[var(--text-primary)] transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-6">
          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="hidden text-[13px] font-medium text-[var(--text-primary)] transition hover:text-white sm:inline-flex"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="button-color rounded-lg px-4 py-2 text-[13px] font-mono transition hover:opacity-90"
              >
                Get Started
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--primary)] bg-[var(--primary-soft)] text-[13px] font-semibold text-white transition hover:border-[var(--primary)] hover:brightness-110"
              >
                {displayName.charAt(0).toUpperCase()}
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-[var(--border)] bg-[var(--background)] shadow-lg">
                  <div className="border-b border-[var(--border)] px-4 py-3">
                    <p className="text-[12px] text-[var(--text-muted)]">
                      Logged in as
                    </p>
                    <p className="text-[13px] font-semibold text-white truncate">
                      {displayName}
                    </p>
                    <p className="text-[12px] text-[var(--text-muted)] truncate">
                      {displayEmail}
                    </p>
                  </div>

                  <div className="py-2">
                    <Link
                      href={getDashboardRoute()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-[13px] text-[var(--text-primary)] transition hover:bg-white/5 hover:text-white"
                    >
                      📊 Dashboard
                    </Link>

                    <Link
                      href={getProfileRoute()}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center px-4 py-2 text-[13px] text-[var(--text-primary)] transition hover:bg-white/5 hover:text-white"
                    >
                      👤 Profile
                    </Link>
                  </div>

                  <div className="border-t border-[var(--border)] py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-[13px] text-red-400 transition hover:bg-red-400/10"
                    >
                      🚪 Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>
    </header>
  );
}
