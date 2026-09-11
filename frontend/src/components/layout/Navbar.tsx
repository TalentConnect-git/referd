"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import logo from "@/assets/icon.png";
import {
  Moon,
  Sun,
  ChevronDown,
  BookOpen,
  LayoutDashboard,
  User,
  Bookmark,
  LogOut,
  Smartphone,
} from "lucide-react";

/* =====================================================
   CONFIG — Play Store URL
   ===================================================== */
const PLAY_STORE_URL =
  "https://play.google.com/store/apps/details?id=com.app.rawrecruit&hl=en_IN";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "Referrals", href: "#referrals" },
  { label: "Network", href: "/network" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Blogs", href: "/blogs" },
  { label: "Trending jobs", href: "/trending-jobs" },
];

/* =====================================================
   THEME TOGGLE
   ===================================================== */
function ThemeToggle() {
  let theme = "dark";
  let toggleTheme = () => {};

  try {
    const themeContext = useTheme();
    theme = themeContext.theme;
    toggleTheme = themeContext.toggleTheme;
  } catch {
    // fallback below
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
      className="
        flex h-8 w-8 shrink-0 items-center justify-center
        rounded-lg
        border border-[var(--border)]
        bg-[var(--card)]
        text-[var(--text-secondary)]
        transition-colors duration-200
        hover:border-[var(--border-strong)]
        hover:bg-[var(--card-hover)]
        hover:text-[var(--text-primary)]
        focus-visible:ring-2
        focus-visible:ring-[var(--primary)]
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[var(--background)]
        sm:h-9 sm:w-9
      "
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

/* =====================================================
   NAVBAR
   ===================================================== */
export default function Navbar() {
  const router = useRouter();
  const { user, profile, isAuthenticated, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  /* ---------- Derived display values ---------- */
  const displayName = useMemo(() => {
    if (profile?.fullName) return profile.fullName;
    if (profile?.name) return profile.name;
    if (user?.name) return user.name;
    if (user?.email) return user.email.split("@")[0];
    return "User";
  }, [profile, user]);

  const displayEmail = useMemo(
    () => profile?.email || user?.email || "",
    [profile, user]
  );

  const userType = useMemo(
    () => profile?.profileType || user?.userType || "student",
    [profile, user]
  );

  /* ---------- Routes ---------- */
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

  const getNetworkRoute = () => `/${userType}/alumani-network`;

  const handleLogout = async () => {
    setDropdownOpen(false);
    await logout();
    router.push("/login");
  };

  return (
    <header className="global-navbar fixed left-0 top-0 z-50 w-full">
      <nav
        className="
          mx-auto flex h-14 max-w-7xl items-center justify-between
          gap-2 px-3
          sm:gap-3 sm:px-6
          lg:px-8
        "
      >
        {/* =====================================================
            LEFT — LOGO + NAV LINKS
        ====================================================== */}
        <div className="flex min-w-0 items-center gap-6 lg:gap-10">
          <Link href="/" className="group flex shrink-0 items-center gap-1.5">
            <div className="relative h-6 w-6 shrink-0 transition-transform duration-200 group-hover:scale-105">
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

          {/* Desktop navigation */}
          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.label === "Network" ? getNetworkRoute() : link.href}
                className="
                  text-sm font-medium
                  text-[var(--text-secondary)]
                  transition-colors duration-200
                  hover:text-[var(--text-primary)]
                "
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* =====================================================
            RIGHT — ACTIONS
        ====================================================== */}
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
          {/* Blogs — mobile/tablet only */}
          <Link
            href="/blogs"
            className="
              flex h-8 w-8 items-center justify-center
              rounded-lg
              border border-[var(--border)]
              bg-[var(--card)]
              text-[var(--text-secondary)]
              transition-colors duration-200
              hover:border-[var(--border-strong)]
              hover:bg-[var(--card-hover)]
              hover:text-[var(--primary)]
              lg:hidden
              sm:h-9 sm:w-9
            "
            aria-label="Blogs"
          >
            <BookOpen className="h-4 w-4" />
          </Link>

          <ThemeToggle />

          {/* Get App — ALWAYS VISIBLE (icon-only on phones, labeled on sm+) */}
          <a
            href={PLAY_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group/app
              inline-flex h-8 w-8 shrink-0 items-center justify-center
              rounded-lg
              border border-[var(--border)]
              bg-[var(--card)]
              text-[var(--text-primary)]
              transition-colors duration-200
              hover:border-[var(--primary-border)]
              hover:bg-[var(--primary-soft)]
              sm:h-9 sm:w-auto sm:gap-1.5 sm:px-3
            "
            aria-label="Get App"
          >
            <Smartphone
              className="
                h-4 w-4 shrink-0 text-[var(--primary)]
                transition-transform duration-200
                group-hover/app:scale-110
              "
            />
            <span className="hidden text-sm font-medium sm:inline">
              Get App
            </span>
          </a>

          {!isAuthenticated ? (
            <>
              {/* Get Started — hidden on phones, visible from md: */}
              <Link
                href="/signup"
                className="
                  group/cta
                  relative hidden h-9 items-center justify-center
                  overflow-hidden
                  whitespace-nowrap
                  rounded-lg
                  bg-gradient-to-r
                  from-[var(--primary-dark)]
                  via-[var(--primary)]
                  to-[var(--primary-light)]
                  bg-[length:200%_auto]
                  px-4
                  text-sm font-semibold
                  text-[var(--text-on-primary)]
                  shadow-[var(--shadow-sm)]
                  transition-all duration-300
                  hover:-translate-y-0.5
                  hover:bg-[position:100%_center]
                  hover:shadow-[var(--shadow-md)]
                  active:scale-[0.97]
                  md:inline-flex
                "
              >
                <span
                  className="
                    pointer-events-none absolute inset-0
                    -translate-x-full
                    bg-gradient-to-r from-transparent via-white/25 to-transparent
                    transition-transform duration-700
                    group-hover/cta:translate-x-full
                  "
                />
                <span className="relative">Get Started</span>
              </Link>
            </>
          ) : (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((o) => !o)}
                className="
                  flex items-center gap-1.5
                  rounded-lg
                  border border-[var(--border)]
                  bg-[var(--card)]
                  px-1.5 py-1.5 pr-1.5
                  text-[var(--text-primary)]
                  transition-colors duration-200
                  hover:border-[var(--border-strong)]
                  hover:bg-[var(--card-hover)]
                  focus-visible:ring-2
                  focus-visible:ring-[var(--primary)]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-[var(--background)]
                  sm:px-3 sm:py-2
                "
                aria-haspopup="menu"
                aria-expanded={dropdownOpen}
              >
                <span
                  className="
                    flex h-6 w-6 items-center justify-center
                    rounded-full
                    bg-[var(--primary-soft)]
                    text-[12px] font-semibold
                    text-[var(--primary)]
                    sm:h-7 sm:w-7 sm:text-sm
                  "
                >
                  {displayName.charAt(0).toUpperCase()}
                </span>
                <span className="hidden max-w-[80px] truncate text-sm font-medium sm:inline-block">
                  {displayName}
                </span>
                <ChevronDown
                  className={`
                    h-4 w-4 text-[var(--text-muted)]
                    transition-transform duration-200
                    ${dropdownOpen ? "rotate-180" : ""}
                  `}
                />
              </button>

              {dropdownOpen && (
                <div
                  className="
                    animate-slide-in-up
                    absolute right-0 mt-2 w-60
                    origin-top-right
                    overflow-hidden
                    rounded-xl
                    border border-[var(--border)]
                    bg-[var(--card)]
                    shadow-[var(--shadow-lg)]
                  "
                  role="menu"
                >
                  {/* User info */}
                  <div className="border-b border-[var(--border)] px-4 py-3">
                    <p className="text-xs font-medium text-[var(--text-muted)]">
                      Logged in as
                    </p>
                    <p className="mt-0.5 truncate text-sm font-semibold text-[var(--text-primary)]">
                      {displayName}
                    </p>
                    <p className="truncate text-xs text-[var(--text-muted)]">
                      {displayEmail}
                    </p>
                  </div>

                  {/* Menu items */}
                  <div className="py-1.5">
                    <Link
                      href={getDashboardRoute()}
                      onClick={() => setDropdownOpen(false)}
                      className="sidebar-item px-4 py-2.5 text-sm"
                      role="menuitem"
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      Dashboard
                    </Link>

                    <Link
                      href={getProfileRoute()}
                      onClick={() => setDropdownOpen(false)}
                      className="sidebar-item px-4 py-2.5 text-sm"
                      role="menuitem"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>

                    <Link
                      href="/saved-blogs"
                      onClick={() => setDropdownOpen(false)}
                      className="sidebar-item px-4 py-2.5 text-sm"
                      role="menuitem"
                    >
                      <Bookmark className="h-4 w-4" />
                      Saved Blogs
                    </Link>

                    <a
                      href={PLAY_STORE_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setDropdownOpen(false)}
                      className="sidebar-item px-4 py-2.5 text-sm"
                      role="menuitem"
                    >
                      <Smartphone className="h-4 w-4" />
                      Get App
                    </a>
                  </div>

                  {/* Logout */}
                  <div className="border-t border-[var(--border)] py-1.5">
                    <button
                      onClick={handleLogout}
                      className="
                        flex w-full items-center gap-3
                        px-4 py-2.5
                        text-left text-sm
                        text-[var(--danger)]
                        transition-colors duration-200
                        hover:bg-[var(--danger-soft)]
                      "
                      role="menuitem"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
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