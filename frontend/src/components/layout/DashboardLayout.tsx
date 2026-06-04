"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  User,
  Settings,
  Search,
  X,
  Monitor,
  LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { useAuth } from "@/context/AuthContext";
import { goToHome } from "@/helper";

type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number;
};

type DashboardLayoutProps = {
  children: ReactNode;
  navItems: NavItem[];
};

export default function DashboardLayout({
  children,
  navItems,
}: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();

  const [searchValue, setSearchValue] = useState("");

  const rolePath = pathname.split("/")[1] || "professional";

  const getPath = (path: string) => `/${rolePath}${path}`;

  const profilePath = getPath("/profile");
  const settingsPath = getPath("/settings");

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

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

  const displayRole = rolePath.charAt(0).toUpperCase() + rolePath.slice(1);

  const filteredNavItems = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase();

    if (!keyword) return navItems;

    return navItems.filter((item) =>
      item.label.toLowerCase().includes(keyword)
    );
  }, [searchValue, navItems]);

  return (
    <>
      <div className="flex min-h-screen w-full bg-[var(--background)] text-white max-md:hidden">
        <aside className="fixed left-0 top-0 flex h-screen w-60 shrink-0 flex-col border-r border-[var(--border)] bg-[var(--background)]">
          <button
            onClick={() => goToHome(router)}
            className="flex items-center gap-2 px-5 py-5 hover:cursor-pointer"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-[var(--primary)]">
              <span className="h-2 w-2 rounded-full bg-black" />
            </span>

            <span className="text-[18px] font-semibold tracking-tight text-white">
              Referd<span className="text-[var(--primary)]">.</span>
            </span>
          </button>

          <div className="px-3 pb-4">
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-[var(--card)] px-3 py-2 text-sm">
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
                  className="flex h-5 w-5 items-center justify-center rounded text-[var(--text-primary)] hover:bg-white/10 hover:text-white"
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

          <nav className="flex-1 space-y-1 overflow-y-auto px-3">
            {filteredNavItems.length > 0 ? (
              filteredNavItems.map((item) => {
                const Icon = item.icon;
                const itemPath = getPath(item.to);
                const active = isActive(itemPath);

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
                  isActive(profilePath)
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
                  isActive(settingsPath)
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

        <main className="ml-60 min-h-screen min-w-0 flex-1 bg-[var(--background)]">
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
            open it on a larger device.
          </p>
        </div>
      </div>
    </>
  );
}