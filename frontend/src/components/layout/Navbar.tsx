"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useRef, useEffect } from "react";

const navLinks = [
  {
    label: "Product",
    href: "#product",
  },
  {
    label: "Referrals",
    href: "#referrals",
  },
  {
    label: "Network",
    href: "#network",
  },
  {
    label: "How it works",
    href: "#how-it-works",
  },
];

export default function Navbar() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();
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
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [dropdownOpen]);

  const getProfileRoute = () => {
    switch (user?.userType) {
      case "professional":
        return "/professional/profile";
      case "fresher":
        return "/fresher/profile";
      case "student":
      default:
        return "/student/profile";
    }
  };

  const getDashboardRoute = () => {
    switch (user?.userType) {
      case "professional":
        return "/professional/home";
      case "fresher":
        return "/fresher/home";
      case "student":
      default:
        return "/student/home";
    }
  };

  const displayName =
    user?.name || (user?.email ? user.email.split("@")[0] : "User");

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <header className="fixed left-0 top-0 z-50 w-full border-b border-[var(--border)] bg-[var(--background)]/75 backdrop-blur-xl">
      <nav className="mx-auto flex h-13 max-w-7xl items-center justify-between px-5 sm:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-6 w-6 items-center  justify-center rounded-b-lg rounded-t-lg border border-[rgba(49,170,64,0.35)] bg-[var(--primary-soft)]">
              <span className="h-2.5 w-2.5 rounded-full bg-[var(--primary)]" />
            </div>

            <span className="text-[13px] font-bold tracking-tight text-white">
              Referd
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
                className="button-color rounded-lg  px-4 py-2 text-[13px] font-mono transition hover:opacity-90"
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
                      {user?.email}
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