// components/DashboardLayout.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Activity,
  Award,
  Bell,
  Bookmark,
  Briefcase,
  Building2,
  CalendarCheck,
  FileText,
  GraduationCap,
  Home,
  LayoutDashboard,
  MessageSquare,
  Monitor,
  Network,
  Search,
  Settings,
  User,
  UserCheck,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useRef, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useGetAllUsers } from "@/hooks/useGetAllUsers";
import { goToHome } from "@/helper/index";

export type CandidateRole = "professional" | "student" | "fresher";

export type DashboardIconKey =
  | "home"
  | "dashboard"
  | "briefcase"
  | "file"
  | "users"
  | "userCheck"
  | "message"
  | "bell"
  | "activity"
  | "bookmark"
  | "graduation"
  | "building"
  | "calendar"
  | "award"
  | "network"
  | "user"
  | "settings";

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: DashboardIconKey;
  badge?: number;
};

type DashboardLayoutProps = {
  children: ReactNode;
  navItems: DashboardNavItem[];
  role: CandidateRole;
};

const iconMap: Record<DashboardIconKey, LucideIcon> = {
  home: Home,
  dashboard: LayoutDashboard,
  briefcase: Briefcase,
  file: FileText,
  users: Users,
  userCheck: UserCheck,
  message: MessageSquare,
  bell: Bell,
  activity: Activity,
  bookmark: Bookmark,
  graduation: GraduationCap,
  building: Building2,
  calendar: CalendarCheck,
  award: Award,
  network: Network,
  user: User,
  settings: Settings,
};

// ---------- Component ----------
export function DashboardLayout({
  children,
  navItems,
  role,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [searchValue, setSearchValue] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);

  // Auth context
  const { profile, profileLoading, logout } = useAuth();

  // Get unread message counts
  const { totalUnread } = useGetAllUsers();

  const handleClick = () => {
    goToHome(router);
  };

  // Close settings dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        settingsRef.current &&
        !settingsRef.current.contains(event.target as Node)
      ) {
        setSettingsOpen(false);
      }
    }
    if (settingsOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [settingsOpen]);

  // Derived display values
  const displayName = useMemo(() => {
    if (profile) return profile.fullName || profile.name || "";
    return "User";
  }, [profile]);

  const displayEmail = useMemo(() => {
    if (profile) return profile.email || "";
    return "user@example.com";
  }, [profile]);

  const userType = useMemo(() => {
    if (profile) return profile.profileType || role;
    return role;
  }, [profile, role]);

  const displayRole = userType.charAt(0).toUpperCase() + userType.slice(1);

  const basePath = `/${userType}`;

  // Active state helper
  const isActive = (path: string) => {
    if (path === "/home" && pathname === `${basePath}/home`) return true;
    if (path === "/dashboard" && pathname === `${basePath}/dashboard`)
      return true;
    const fullPath = `${basePath}${path}`;
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
  };

  // Filter nav items by search
  const filteredNavItems = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) return navItems;
    return navItems.filter((item) =>
      item.label.toLowerCase().includes(keyword)
    );
  }, [searchValue, navItems]);

  // Update nav items with unread count
  const updatedNavItems = useMemo(() => {
    return filteredNavItems.map((item) => {
      if (item.icon === "message") {
        return {
          ...item,
          badge: totalUnread > 0 ? totalUnread : undefined,
        };
      }
      return item;
    });
  }, [filteredNavItems, totalUnread]);

  // Initials for avatar
  const initials = useMemo(() => {
    return displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase();
  }, [displayName]);

  // Separate main nav from profile/settings
  const mainNavItems = updatedNavItems.filter(
    (item) => item.label !== "Profile" && item.label !== "Settings"
  );

  // Handlers
  const handleLogout = async () => {
    setSettingsOpen(false);
    await logout();
    router.push("/login");
  };

  const handleDeactivate = () => {
    setSettingsOpen(false);
    console.log("Deactivate account requested");
  };

  // ---------- JSX ----------
  return (
    <>
      {/* ========== Desktop Layout ========== */}
      <div className="flex min-h-screen w-full bg-[var(--background)] text-white max-md:hidden">
        {/* ---------- Sidebar ---------- */}
        <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--background)]">
          {/* Search Bar */}
          <div className="px-3 pt-4 pb-4">
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-[var(--card)] px-3 py-2 text-sm transition focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/20">
              <Search className="h-4 w-4 text-[var(--text-primary)]" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search menu..."
                className="min-w-0 flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-[var(--text-primary)]"
              />
              {searchValue ? (
                <button
                  onClick={() => setSearchValue("")}
                  className="flex h-5 w-5 items-center justify-center rounded text-[var(--text-primary)] hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="hidden rounded-md bg-[var(--background)] px-1.5 py-0.5 text-[9px] text-[var(--text-primary)] sm:inline-block">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3">
            {mainNavItems.length > 0 ? (
              mainNavItems.map((item) => {
                const Icon = iconMap[item.icon];
                const itemPath = `${basePath}${item.to}`;
                const active = isActive(item.to);

                return (
                  <Link
                    key={item.to}
                    href={itemPath}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                      active
                        ? "bg-[var(--primary)] text-black shadow-sm"
                        : "text-white hover:bg-[var(--card-hover)] hover:text-[var(--primary)]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && item.badge > 0 && (
                      <span
                        className={`flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-semibold ${
                          active
                            ? "bg-black text-white"
                            : "bg-[var(--primary)] text-black"
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })
            ) : (
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-3 text-center text-[12px] text-[var(--text-muted)]">
                No menu items found
              </div>
            )}
          </nav>

          {/* Bottom Section */}
          <div className="border-t border-[var(--border)] px-3 py-3">
            <div className="space-y-1.5">
              {/* Profile link */}
              <Link
                href={`${basePath}/profile`}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                  isActive("/profile")
                    ? "bg-[var(--primary)] text-black"
                    : "text-[var(--text-primary)] hover:bg-[var(--card-hover)] hover:text-white"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>

              {/* Settings dropdown */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-all duration-200 ${
                    settingsOpen
                      ? "bg-[var(--primary)] text-black"
                      : "text-[var(--text-primary)] hover:bg-[var(--card-hover)] hover:text-white"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>

                {settingsOpen && (
                  <div className="absolute bottom-full left-0 mb-1 w-full min-w-[160px] rounded-lg border border-[var(--border)] bg-[var(--background)] py-1 shadow-lg">
                    <button
                      onClick={handleDeactivate}
                      className="w-full px-4 py-2 text-left text-[13px] text-red-400 transition hover:bg-red-400/10"
                    >
                      Deactivate Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-[13px] text-red-400 transition hover:bg-red-400/10"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* User Info Card */}
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5 transition-all hover:border-[var(--primary)]/50">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-[11px] font-bold text-black shadow-sm">
                {initials || "U"}
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <div className="truncate text-[12px] font-medium text-white">
                  {profileLoading ? "Loading..." : displayName}
                </div>
                <div className="truncate text-[10px] text-[var(--text-muted)]">
                  {profileLoading ? "" : displayEmail}
                </div>
                <div className="mt-0.5 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-500" />
                  <span className="text-[9px] text-[var(--text-primary)]">
                    {displayRole} · Active
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="min-w-0 flex-1 overflow-auto bg-[var(--background)]">
          {children}
        </main>
      </div>

      {/* ========== Mobile Layout ========== */}
      {/* Mobile Menu Button */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-[var(--primary)] text-black shadow-lg transition-all hover:scale-105 active:scale-95"
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <LayoutDashboard className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 flex transform flex-col bg-[var(--background)] transition-transform duration-300 md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <aside className="flex h-full w-full flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--primary)]">
                <span className="h-2 w-2 rounded-full bg-black" />
              </div>
              <span className="text-[18px] font-semibold tracking-tight text-white">
                Referd<span className="text-[var(--primary)]">.</span>
              </span>
            </div>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="rounded-lg p-2 hover:bg-[var(--card-hover)]"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Mobile Search */}
          <div className="p-4">
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-[var(--card)] px-3 py-2">
              <Search className="h-4 w-4 text-[var(--text-primary)]" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search menu..."
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-[var(--text-primary)]"
              />
              {searchValue && (
                <button
                  onClick={() => setSearchValue("")}
                  className="text-[var(--text-primary)]"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile Navigation */}
          <nav className="flex-1 overflow-y-auto px-2">
            {mainNavItems.map((item) => {
              const Icon = iconMap[item.icon];
              const itemPath = `${basePath}${item.to}`;
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  href={itemPath}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-all ${
                    active
                      ? "bg-[var(--primary)] text-black"
                      : "text-white hover:bg-[var(--card-hover)]"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-black/20 px-1.5 text-[10px] font-semibold">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Mobile Bottom Section */}
          <div className="border-t border-[var(--border)] p-4">
            <Link
              href={`${basePath}/profile`}
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--card-hover)] hover:text-white"
            >
              <User className="h-5 w-5" />
              <span>Profile</span>
            </Link>

            {/* Mobile Settings */}
            <div className="mt-1">
              <button
                onClick={() => setSettingsOpen(!settingsOpen)}
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-[var(--text-primary)] hover:bg-[var(--card-hover)] hover:text-white"
              >
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
              {settingsOpen && (
                <div className="ml-5 mt-1 space-y-1">
                  <button
                    onClick={handleDeactivate}
                    className="w-full rounded-md px-3 py-1.5 text-left text-sm text-red-400 hover:bg-red-400/10"
                  >
                    Deactivate Account
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-md px-3 py-1.5 text-left text-sm text-red-400 hover:bg-red-400/10"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile User Info */}
            <div className="mt-3 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-bold text-black">
                {initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate text-sm font-medium text-white">
                  {profileLoading ? "Loading..." : displayName}
                </div>
                <div className="truncate text-xs text-[var(--text-muted)]">
                  {profileLoading ? "" : displayEmail}
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile Fallback */}
      <div className="hidden max-md:flex min-h-screen items-center justify-center bg-[var(--background)] px-6 text-center text-white">
        <div className="max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary)]/10">
            <Monitor className="h-7 w-7 text-[var(--primary)]" />
          </div>
          <h1 className="text-[20px] font-semibold text-white">Mobile View</h1>
          <p className="mt-3 text-[13px] leading-6 text-[var(--text-primary)]">
            Tap the button below to open the menu and navigate through the
            dashboard.
          </p>
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-6 py-2.5 text-sm font-semibold text-black transition hover:bg-[var(--primary-dark)]"
          >
            <LayoutDashboard className="h-4 w-4" />
            Open Menu
          </button>
        </div>
      </div>
    </>
  );
}