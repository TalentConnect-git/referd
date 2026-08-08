"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import logo from "@/assets/icon.png";
import { Moon, Sun, ChevronDown, BookOpen } from "lucide-react";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Referrals", href: "#referrals" },
  { label: "Network", href: "/network" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Blogs", href: "/blogs" },
];

// Theme toggle component using ThemeContext with error handling
function ThemeToggle() {
  let theme = "dark";
  let toggleTheme = () => {};

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch (error) {
    console.warn("ThemeProvider not found, using localStorage fallback");
  }

  const handleToggle = () => {
    try {
      toggleTheme();
    } catch {
      const currentTheme =
        document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      window.dispatchEvent(new Event("themeChange"));
    }
  };

  useEffect(() => {
    const handleThemeChange = () => {
      const savedTheme = localStorage.getItem("theme") as
        | "light"
        | "dark"
        | null;
      if (savedTheme) {
        document.documentElement.setAttribute("data-theme", savedTheme);
      }
    };

    window.addEventListener("themeChange", handleThemeChange);
    return () => window.removeEventListener("themeChange", handleThemeChange);
  }, []);

  return (
    <button
      onClick={handleToggle}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)] hover:shadow-sm focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2"
      aria-label="Toggle theme"
    >
      {theme === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </button>
  );
}

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

  const getNetworkRoute = () => {
    return `/${userType}/alumani-network`;
  };

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <header className="global-navbar fixed left-0 top-0 z-50 w-full">
      <nav className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo Section */}
        <div className="flex items-center gap-8 lg:gap-10">
          <Link href="/" className="flex items-center gap-1.5 group">
            <div className="relative h-6 w-6 flex-shrink-0 transition-transform duration-200 group-hover:scale-105">
              <Image
                src={logo}
                alt="Referd Logo"
                fill
                className="object-contain"
                priority
              />
            </div>

            <span className="text-sm font-medium tracking-tight text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)]">
              referd
              <span className="text-[var(--primary)]">.</span>
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => {
              if (link.label === "Network") {
                return (
                  <Link
                    key={link.href}
                    href={getNetworkRoute()}
                    className="text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 hover:text-[var(--text-primary)] hover:scale-105"
                  >
                    {link.label}
                  </Link>
                );
              }
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 hover:text-[var(--text-primary)] hover:scale-105"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Blog Icon - Mobile & Desktop */}
          <Link
            href="/blogs"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--card)] text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--card-hover)] hover:text-[var(--primary)] hover:shadow-sm lg:hidden"
            aria-label="Blogs"
          >
            <BookOpen className="h-4 w-4" />
          </Link>

          <ThemeToggle />

          {!isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="hidden text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 hover:text-[var(--text-primary)] hover:scale-105 sm:inline-flex"
              >
                Sign in
              </Link>

              <Link
                href="/signup"
                className="btn-primary rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 hover:scale-105 active:scale-95"
              >
                Get Started
              </Link>
            </>
          ) : (
            <>
              {/* Removed the separate Dashboard button - user can access from dropdown */}

              {/* User Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--card)] px-2 py-1.5 pr-2 text-[var(--text-primary)] transition-all duration-200 hover:bg-[var(--card-hover)] hover:border-[var(--border-strong)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 sm:px-3 sm:py-2"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--primary-soft)] text-sm font-semibold text-[var(--primary)]">
                    {displayName.charAt(0).toUpperCase()}
                  </span>
                  <span className="hidden max-w-[80px] truncate text-sm font-medium sm:inline-block">
                    {displayName}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-[var(--text-muted)] transition-transform duration-200 ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {dropdownOpen && (
                  <div className="animate-slide-in-up absolute right-0 mt-2 w-56 origin-top-right rounded-xl border border-[var(--border)] bg-[var(--card)] shadow-lg">
                    <div className="border-b border-[var(--border)] px-4 py-3">
                      <p className="text-xs font-medium text-[var(--text-muted)]">
                        Logged in as
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-[var(--text-primary)] truncate">
                        {displayName}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] truncate">
                        {displayEmail}
                      </p>
                    </div>

                    <div className="py-2">
                      <Link
                        href={getDashboardRoute()}
                        onClick={() => setDropdownOpen(false)}
                        className="sidebar-item px-4 py-2.5 text-sm"
                      >
                        <span className="text-base">📊</span>
                        Dashboard
                      </Link>

                      <Link
                        href={getProfileRoute()}
                        onClick={() => setDropdownOpen(false)}
                        className="sidebar-item px-4 py-2.5 text-sm"
                      >
                        <span className="text-base">👤</span>
                        Profile
                      </Link>

                      <Link
                        href="/saved-blogs"
                        onClick={() => setDropdownOpen(false)}
                        className="sidebar-item px-4 py-2.5 text-sm"
                      >
                        <span className="text-base">🔖</span>
                        Saved Blogs
                      </Link>
                    </div>

                    <div className="border-t border-[var(--border)] py-2">
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-2.5 text-left text-sm text-[var(--danger)] transition-all duration-200 hover:bg-[var(--danger-soft)]"
                      >
                        <span className="mr-2">🚪</span>
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}