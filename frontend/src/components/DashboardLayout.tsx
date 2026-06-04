"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  UserCheck,
  MessageSquare,
  Bell,
  Activity,
  User,
  Settings,
  Search,
  X,
  Monitor,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { goToHome } from "@/helper/index";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/jobs", label: "Referral Jobs", icon: Briefcase },
  { to: "/applications", label: "Applications", icon: FileText },
  { to: "/referrals", label: "My Referrals", icon: UserCheck },
  { to: "/alumni", label: "Alumni Network", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { to: "/notifications", label: "Notifications", icon: Bell, badge: 5 },
  { to: "/activity", label: "Activity Feed", icon: Activity },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user } = useAuth();
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();

  // Extract role from pathname (professional, student, or fresher)
  const rolePath = pathname.split('/')[1] || "professional";

  const isActive = (path: string) => {
    const fullPath = `/${rolePath}${path}`;
    return pathname === fullPath || pathname.startsWith(`${fullPath}/`);
  };

  const profilePath = `/${rolePath}/profile`;
  const settingsPath = `/${rolePath}/settings`;

  const displayName =
    user?.name?.trim() || user?.email?.split("@")[0] || "User";

  const displayEmail = user?.email || "user@example.com";

  const initials = displayName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();

  const displayRole = user?.userType
    ? user.userType.charAt(0).toUpperCase() + user.userType.slice(1)
    : "Member";

  const filteredNavItems = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();
    if (!keyword) return navItems;
    return navItems.filter((item) =>
      item.label.toLowerCase().includes(keyword)
    );
  }, [searchValue]);

  return (
    <>
      <div className="flex min-h-screen w-full bg-[var(--background)] text-white max-md:hidden">
        {/* LEFT SIDEBAR - Always visible */}
        <aside className="flex w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--background)]">
          <button
            onClick={() => goToHome(router)}
            className="flex hover:cursor-pointer items-center gap-2 px-5 py-5"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-b-lg rounded-t-lg bg-[var(--primary)]">
              <span className="h-2 w-2 rounded-full bg-black" />
            </span>
            <span className="text-[18px] font-semibold tracking-tight text-white">
              Referd<span className="text-[var(--primary)]">.</span>
            </span>
          </button>

          <div className="px-3 pb-4">
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-[var(--card)] px-3 py-2 text-sm transition focus-within:border-white/40 focus-within:ring-1 focus-within:ring-white/20">
              <Search className="h-4 w-4 text-[var(--text-primary)]" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                placeholder="Search..."
                className="min-w-0 flex-1 bg-transparent text-[12px] text-white outline-none placeholder:text-[var(--text-primary)]"
              />
              {searchValue ? (
                <button
                  type="button"
                  onClick={() => setSearchValue("")}
                  className="flex h-5 w-5 cursor-pointer items-center justify-center rounded text-[var(--text-primary)] transition hover:bg-white/10 hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              ) : (
                <kbd className="rounded-md bg-[var(--background)] px-1.5 py-0.5 text-[9px] text-[var(--text-primary)]">
                  ⌘K
                </kbd>
              )}
            </div>
          </div>

          <nav className="flex-1 space-y-1 px-3">
            {filteredNavItems.length > 0 ? (
              filteredNavItems.map((item) => {
                const Icon = item.icon;
                const itemPath = `/${rolePath}${item.to}`;
                const active = isActive(item.to);

                return (
                  <Link
                    key={item.to}
                    href={itemPath}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition ${
                      active
                        ? "bg-[var(--primary)] text-black"
                        : "text-white hover:bg-[var(--card-hover)] hover:text-[var(--primary)]"
                    }`}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--primary)] px-1.5 text-[10px] font-semibold text-black">
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

          <div className="border-t border-[var(--border)] px-3 py-3">
            <div className="space-y-1.5">
              <Link
                href={profilePath}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition ${
                  isActive("/profile")
                    ? "bg-[var(--primary)] text-black"
                    : "text-[var(--text-primary)] hover:bg-[var(--card-hover)] hover:text-white"
                }`}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </Link>

              <Link
                href={settingsPath}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition ${
                  isActive("/settings")
                    ? "bg-[var(--primary)] text-black"
                    : "text-[var(--text-primary)] hover:bg-[var(--card-hover)] hover:text-white"
                }`}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </Link>
            </div>

            <div className="mt-3 flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] p-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-[11px] font-bold text-black">
                {initials || "U"}
              </div>
              <div className="min-w-0 text-xs">
                <div className="truncate text-[12px] font-medium text-white">
                  {displayName}
                </div>
                <div className="truncate text-[10px] text-[var(--text-muted)]">
                  {displayEmail}
                </div>
                <div className="mt-0.5 text-[10px] text-[var(--text-primary)]">
                  {displayRole} · Free plan
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT SIDE MAIN CONTENT - This is where page content renders */}
        <main className="min-w-0 flex-1 bg-[var(--background)] overflow-auto">
          {children}
        </main>
      </div>

      <div className="flex min-h-screen items-center justify-center bg-[var(--background)] px-6 text-center text-white md:hidden">
        <div className="max-w-sm rounded-3xl border border-[var(--border)] bg-[var(--card)] p-7">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--primary-soft)]">
            <Monitor className="h-7 w-7 text-[var(--primary)]" />
          </div>
          <h1 className="text-[20px] font-semibold text-white">
            Desktop View Required
          </h1>
          <p className="mt-3 text-[13px] leading-6 text-[var(--text-primary)]">
            This dashboard is optimized for desktop and laptop screens. Please
            open it on a larger device for the best experience.
          </p>
        </div>
      </div>
    </>
  );
}