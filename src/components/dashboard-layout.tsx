import { Link, useRouterState } from "@tanstack/react-router";
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
} from "lucide-react";
import type { ReactNode } from "react";

const navItems = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/jobs", label: "Referral Jobs", icon: Briefcase },
  { to: "/applications", label: "Applications", icon: FileText },
  { to: "/referrals", label: "My Referrals", icon: UserCheck },
  { to: "/alumni", label: "Alumni Network", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { to: "/notifications", label: "Notifications", icon: Bell, badge: 5 },
  { to: "/activity", label: "Activity Feed", icon: Activity },
];

const bottomItems = [
  { to: "/profile", label: "Profile", icon: User },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const isActive = (to: string, exact?: boolean) =>
    exact ? pathname === to : pathname.startsWith(to);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <aside className="hidden md:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar">
        <div className="flex items-center gap-2 px-6 py-5">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary">
            <span className="h-2 w-2 rounded-full bg-sidebar" />
          </span>
          <span className="text-lg font-semibold tracking-tight">
            Referd<span className="text-primary">.</span>
          </span>
        </div>

        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 rounded-lg bg-sidebar-accent px-3 py-2 text-sm text-muted-foreground">
            <Search className="h-4 w-4" />
            <span className="flex-1">Search...</span>
            <kbd className="rounded bg-background/40 px-1.5 py-0.5 text-[10px]">⌘K</kbd>
          </div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {navItems.map((item) => {
            const active = isActive(item.to, item.exact);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to as "/"}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-sidebar-accent px-1.5 text-[11px] text-muted-foreground">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="space-y-1 px-3 py-4">
          {bottomItems.map((item) => {
            const active = isActive(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to as "/profile"}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                  active
                    ? "bg-accent text-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent"
                }`}
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-3 border-t border-sidebar-border px-4 py-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-xs font-semibold text-accent-foreground">
            AK
          </div>
          <div className="text-xs">
            <div className="font-medium">Aman Kumar</div>
            <div className="text-muted-foreground">VIPS '25 · Free plan</div>
          </div>
        </div>
      </aside>

      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
