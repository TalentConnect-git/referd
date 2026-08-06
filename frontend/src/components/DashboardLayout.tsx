// components/DashboardLayout.tsx
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
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
  Settings,
  TrendingUp,
  User,
  UserCheck,
  Users,
  X,
  HelpCircle,
  Menu,
  type LucideIcon,
  AlertTriangle,
  Eye,
  EyeOff,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useRef, useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useMessageUnreadCount } from "@/hooks/useMessageUnreadCount";
import { goToHome } from "@/helper/index";
import OnboardingModal from "./dashboard/OnboardingModal";
import axiosInstance from "@/lib/axiosInstance";

export type CandidateRole = "professional" | "student" | "fresher";

export type DashboardIconKey =
  | "home"
  | "dashboard"
  | "briefcase"
  | "file"
  | "trendingUp"
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
  | "settings"
  | "helpCircle";

export type DashboardNavItem = {
  to: string;
  label: string;
  icon: DashboardIconKey;
  badge?: number | string;
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
  trendingUp: TrendingUp,
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
  helpCircle: HelpCircle,
};

// ---------- Component ----------
export function DashboardLayout({
  children,
  navItems,
  role,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [mobileSettingsOpen, setMobileSettingsOpen] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deactivateTimer, setDeactivateTimer] = useState(5);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const settingsRef = useRef<HTMLDivElement>(null);

  // Auth context
  const { profile, profileLoading, logout } = useAuth();

  const { messageUnreadCount } = useMessageUnreadCount();

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

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Timer for deactivation confirmation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (showDeactivateModal && deactivateTimer > 0) {
      interval = setInterval(() => {
        setDeactivateTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [showDeactivateModal, deactivateTimer]);

  // Reset timer and password when modal closes
  useEffect(() => {
    if (!showDeactivateModal) {
      setDeactivateTimer(5);
      setDeactivateError(null);
      setPassword("");
    }
  }, [showDeactivateModal]);

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

  // Get profile image from profile.profileImage
  const profileImageUrl = profile?.profileImage || null;

  // Active state helper - FIXED for message route (not messages)
  const isActive = (path: string) => {
    if (path === "/home" && pathname === `${basePath}/home`) return true;
    if (path === "/dashboard" && pathname === `${basePath}/dashboard`)
      return true;
    // Special handling for message - check if path is exactly /message or starts with /message/
    if (path === "/message") {
      return (
        pathname === `${basePath}/message` ||
        pathname.startsWith(`${basePath}/message/`)
      );
    }
    const fullPath = `${basePath}${path}`;
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
  };

  // Update nav items with unread count
  const updatedNavItems = useMemo(() => {
    return navItems.map((item) => {
      if (item.icon === "message") {
        return {
          ...item,
          badge: messageUnreadCount > 0 ? messageUnreadCount : undefined,
        };
      }
      return item;
    });
  }, [navItems, messageUnreadCount]);

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
    (item) => item.label !== "Profile" && item.label !== "Settings",
  );

  // Bottom nav items - show 5 items
  const bottomNavItems = mainNavItems.slice(0, 5);

  // Handlers
  const handleLogout = async () => {
    setSettingsOpen(false);
    setMobileSettingsOpen(false);
    setIsMobileMenuOpen(false);
    await logout();
    router.push("/login");
  };

  const handleDeactivateClick = () => {
    setSettingsOpen(false);
    setMobileSettingsOpen(false);
    setIsMobileMenuOpen(false);
    setShowDeactivateModal(true);
    setDeactivateTimer(5);
    setDeactivateError(null);
    setPassword("");
  };

  const handleDeactivateConfirm = async () => {
    if (deactivateTimer > 0) return;
    if (!password.trim()) {
      setDeactivateError(
        "Please enter your password to confirm account deletion.",
      );
      return;
    }

    setIsDeactivating(true);
    setDeactivateError(null);

    try {
      const response = await axiosInstance.delete("/api/auth/delete", {
        data: { password: password.trim() },
      });

      if (response.status === 200) {
        setShowDeactivateModal(false);
        await logout();
        router.push("/login");
      } else {
        setDeactivateError("Failed to delete account. Please try again.");
      }
    } catch (error: any) {
      console.error("Error deleting account:", error);
      setDeactivateError(
        error.response?.data?.message ||
          "An error occurred while deleting your account. Please try again.",
      );
    } finally {
      setIsDeactivating(false);
    }
  };

  // ---------- JSX ----------
  return (
    <>
      {/* ========== Desktop Layout ========== */}
      <div className="flex min-h-screen w-full bg-[var(--background)] text-[var(--text-primary)] max-md:hidden">
        {/* ---------- Sidebar ---------- */}
        <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--background)]">
          {/* Logo */}

          {/* Main Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto px-3 pt-4">
            {mainNavItems.length > 0 ? (
              mainNavItems.map((item) => {
                const Icon = iconMap[item.icon];
                const itemPath = `${basePath}${item.to}`;
                const active = isActive(item.to);

                return (
                  <Link
                    key={item.to}
                    href={itemPath}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                      active
                        ? "bg-[var(--primary)] text-black shadow-sm"
                        : "text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--primary)]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
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
              <div className="rounded-lg border border-[var(--border)] bg-[var(--card)] px-3 py-3 text-center text-xs text-[var(--text-muted)]">
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
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                  isActive("/profile")
                    ? "bg-[var(--primary)] text-black"
                    : "text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>

              {/* Settings dropdown */}
              <div className="relative" ref={settingsRef}>
                <button
                  onClick={() => setSettingsOpen(!settingsOpen)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                    settingsOpen
                      ? "bg-[var(--primary)] text-black"
                      : "text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </button>

                {settingsOpen && (
                  <div className="absolute bottom-full left-0 mb-1 w-full min-w-[160px] rounded-lg border border-[var(--border)] bg-[var(--card)] py-1 shadow-lg">
                    <button
                      onClick={() => router.push("/saved-blogs")}
                      className="w-full rounded-md px-3 py-2.5 text-left text-sm text-[var(--danger)] transition hover:bg-[var(--danger-soft)]"
                    >
                      Saved-Blogs
                    </button>
                    <button
                      onClick={handleDeactivateClick}
                      className="w-full px-4 py-2 text-left text-sm text-[var(--danger)] transition hover:bg-[var(--danger-soft)]"
                    >
                      Deactivate Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-[var(--danger)] transition hover:bg-[var(--danger-soft)]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* User Info Card */}
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5 transition-all hover:border-[var(--primary-border)]">
              <div className="relative flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary)] shadow-sm">
                {profileImageUrl ? (
                  <Image
                    src={profileImageUrl}
                    alt={displayName}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  initials || "U"
                )}
              </div>
              <div className="min-w-0 flex-1 text-xs">
                <div className="truncate text-xs font-medium text-[var(--text-primary)]">
                  {profileLoading ? "Loading..." : displayName}
                </div>
                <div className="truncate text-[10px] text-[var(--text-muted)]">
                  {profileLoading ? "" : displayEmail}
                </div>
                <div className="mt-0.5 flex items-center gap-1">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--success)]" />
                  <span className="text-[9px] text-[var(--text-muted)]">
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
      <div className="min-h-screen bg-[var(--background)] md:hidden">
        {/* Mobile Top Navbar */}
        <header className="sticky top-0 z-40 border-b border-[var(--border)] bg-[var(--navbar-background)] backdrop-blur-xl">
          <div className="flex items-center justify-between px-4 py-3">
            {/* Logo */}

            {/* Right side */}
            <div className="flex items-center gap-2">
              {/* Message badge - using /message route */}
              <Link
                href={`${basePath}/message`}
                className="relative rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
              >
                <MessageSquare className="h-5 w-5" />
                {messageUnreadCount > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--danger)] text-[9px] font-bold text-white">
                    {messageUnreadCount > 9 ? "9+" : messageUnreadCount}
                  </span>
                )}
              </Link>

              {/* Menu button */}
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </header>

        {/* Mobile Content */}
        <main className="min-h-[calc(100vh-60px)] bg-[var(--background)] pb-[70px]">
          {children}
        </main>

        {/* Mobile Bottom Navigation - 5 items */}
        <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-[var(--border)] bg-[var(--navbar-background)] backdrop-blur-xl">
          <div className="flex items-center justify-around px-2 py-1.5">
            {bottomNavItems.map((item) => {
              const Icon = iconMap[item.icon];
              const itemPath = `${basePath}${item.to}`;
              const active = isActive(item.to);

              return (
                <Link
                  key={item.to}
                  href={itemPath}
                  className={`flex flex-col items-center gap-0.5 rounded-lg px-2 py-1.5 text-[10px] font-medium transition-all min-w-[50px] ${
                    active
                      ? "text-[var(--primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  <div className="relative">
                    <Icon
                      className={`h-5 w-5 ${active ? "text-[var(--primary)]" : ""}`}
                    />
                    {item.badge && (
                      <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--danger)] text-[8px] font-bold text-white">
                        {typeof item.badge === "number" && item.badge > 9
                          ? "9+"
                          : item.badge}
                      </span>
                    )}
                  </div>
                  <span className="truncate max-w-[45px] text-center text-[9px]">
                    {item.label.length > 8
                      ? item.label.substring(0, 7) + "…"
                      : item.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Mobile Slide-out Menu */}
        <div
          className={`fixed inset-0 z-50 transform bg-[var(--background)] transition-transform duration-300 ease-in-out ${
            isMobileMenuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <aside className="flex h-full w-full flex-col">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-4">
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="rounded-lg p-2 text-[var(--text-secondary)] transition hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Menu Navigation */}
            <nav className="flex-1 overflow-y-auto px-3 py-4">
              {mainNavItems.map((item) => {
                const Icon = iconMap[item.icon];
                const itemPath = `${basePath}${item.to}`;
                const active = isActive(item.to);

                return (
                  <Link
                    key={item.to}
                    href={itemPath}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-3.5 text-sm font-medium transition-all ${
                      active
                        ? "bg-[var(--primary)] text-black shadow-sm"
                        : "text-[var(--text-secondary)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.badge && (
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
              })}
            </nav>

            {/* Mobile Menu Bottom - Fixed Settings */}
            <div className="border-t border-[var(--border)] p-4">
              {/* Profile */}
              <Link
                href={`${basePath}/profile`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
              >
                <User className="h-5 w-5" />
                <span>Profile</span>
              </Link>

              {/* Settings with expandable options */}
              <div className="mt-1">
                <button
                  onClick={() => setMobileSettingsOpen(!mobileSettingsOpen)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]"
                >
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5" />
                    <span>Settings</span>
                  </div>
                  {mobileSettingsOpen ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>

                {/* Settings Options - Fixed */}
                {mobileSettingsOpen && (
                  <div className="ml-12 mt-1 space-y-1 border-l border-[var(--border)] pl-3">
                    <button
                      onClick={() => router.push("/saved-blogs")}
                      className="w-full rounded-md px-3 py-2.5 text-left text-sm text-[var(--danger)] transition hover:bg-[var(--danger-soft)]"
                    >
                      Saved-Blogs
                    </button>
                    <button
                      onClick={handleDeactivateClick}
                      className="w-full rounded-md px-3 py-2.5 text-left text-sm text-[var(--danger)] transition hover:bg-[var(--danger-soft)]"
                    >
                      Deactivate Account
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full rounded-md px-3 py-2.5 text-left text-sm text-[var(--danger)] transition hover:bg-[var(--danger-soft)]"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile User Info */}
              <div className="mt-3 flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[var(--primary-soft)] text-sm font-bold text-[var(--primary)]">
                  {profileImageUrl ? (
                    <Image
                      src={profileImageUrl}
                      alt={displayName}
                      fill
                      className="object-cover"
                      priority
                    />
                  ) : (
                    initials
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="truncate text-sm font-medium text-[var(--text-primary)]">
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
      </div>

      {/* ========== Deactivate Account Modal ========== */}
      {showDeactivateModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-md mx-4 bg-[var(--card)] rounded-xl shadow-2xl border border-[var(--border)] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center gap-3 p-6 border-b border-[var(--border)]">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--danger-soft)] text-[var(--danger)]">
                <AlertTriangle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)]">
                  Deactivate Account
                </h3>
                <p className="text-sm text-[var(--text-muted)]">
                  This action cannot be undone
                </p>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 space-y-4">
              <p className="text-[var(--text-secondary)]">
                Are you sure you want to delete your account? All your data,
                including profile, messages, and activity will be permanently
                removed.
              </p>

              {/* Password Input */}
              <div className="space-y-2">
                <label
                  htmlFor="deactivate-password"
                  className="text-sm font-medium text-[var(--text-secondary)]"
                >
                  Enter your password to confirm
                </label>
                <div className="relative">
                  <input
                    id="deactivate-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full rounded-lg border border-[var(--border)] bg-[var(--background)] px-4 py-2.5 pr-12 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)]/20"
                    disabled={isDeactivating}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                    disabled={isDeactivating}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {deactivateError && (
                <div className="rounded-lg bg-[var(--danger-soft)] p-3 text-sm text-[var(--danger)] border border-[var(--danger-border)]">
                  {deactivateError}
                </div>
              )}

              <div className="flex items-center gap-3 rounded-lg bg-[var(--warning-soft)] p-3 border border-[var(--warning-border)]">
                <span className="text-sm font-medium text-[var(--warning)]">
                  {deactivateTimer > 0 ? (
                    <>Please wait {deactivateTimer} seconds to confirm...</>
                  ) : (
                    <>You can now confirm deletion</>
                  )}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-[var(--border)] bg-[var(--background)]">
              <button
                onClick={() => {
                  setShowDeactivateModal(false);
                  setDeactivateTimer(5);
                  setDeactivateError(null);
                  setPassword("");
                }}
                disabled={isDeactivating}
                className="rounded-lg px-4 py-2 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--card-hover)] disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDeactivateConfirm}
                disabled={
                  deactivateTimer > 0 || isDeactivating || !password.trim()
                }
                className={`rounded-lg px-4 py-2 text-sm font-medium text-white transition-all ${
                  deactivateTimer > 0 || isDeactivating || !password.trim()
                    ? "bg-[var(--text-muted)] cursor-not-allowed opacity-50"
                    : "bg-[var(--danger)] hover:bg-[var(--danger-hover)] active:scale-[0.98]"
                }`}
              >
                {isDeactivating ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                    Deleting...
                  </span>
                ) : (
                  "Yes, Delete My Account"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Onboarding Modal */}
      <OnboardingModal />
    </>
  );
}
