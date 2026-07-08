// types/navigation.ts

import type { ReactNode } from "react";

// Import the DashboardIconKey type from DashboardLayout
// Or define it here to avoid circular dependencies
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

export interface DashboardNavItem {
  to: string;
  label: string;
  icon: DashboardIconKey; // Changed from string to specific type
  badge?: number;
  allowedRoles?: string[]; // Optional: if you want to restrict specific items
}

// Professional Navigation Items
export const professionalNavItems: DashboardNavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/jobs", label: "Referral Jobs", icon: "briefcase" },
  { to: "/applications", label: "Applications", icon: "file" },
  { to: "/saved-jobs", label: "Saved Jobs", icon: "bookmark" },
  { to: "/referrals", label: "My Referrals", icon: "userCheck" },
  { to: "/alumni-network", label: "Alumni Network", icon: "users" },
  { to: "/message", label: "Messages", icon: "message", badge: 3 },
  { to: "/career-insights", label: "Career Insights", icon: "trendingUp" },
  { to: "/profile", label: "Profile", icon: "user" },
  { to: "/support", label: "Support", icon: "helpCircle" },
];

// Student Navigation Items
export const studentNavItems: DashboardNavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/internships", label: "Internships", icon: "briefcase" },
  { to: "/jobs", label: "Jobs", icon: "building" },
  { to: "/applications", label: "Applications", icon: "file" },
  { to: "/saved-jobs", label: "Saved Jobs", icon: "bookmark" },
  { to: "/alumni-network", label: "Alumni Network", icon: "graduation" },
  { to: "/message", label: "Messages", icon: "message", badge: 2 },
  { to: "/career-insights", label: "Career Insights", icon: "trendingUp" },
  { to: "/profile", label: "Profile", icon: "user" },
  { to: "/support", label: "Support", icon: "helpCircle" },
];

// Fresher Navigation Items
export const fresherNavItems: DashboardNavItem[] = [
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/internships", label: "Internships", icon: "briefcase" },
  { to: "/jobs", label: "Jobs", icon: "building" },
  { to: "/applications", label: "Applications", icon: "file" },
  { to: "/saved-jobs", label: "Saved Jobs", icon: "bookmark" },
  { to: "/alumni-network", label: "Alumni Network", icon: "network" },
  { to: "/message", label: "Messages", icon: "message", badge: 1 },
  { to: "/career-insights", label: "Career Insights", icon: "trendingUp" },
  { to: "/profile", label: "Profile", icon: "user" },
  { to: "/support", label: "Support", icon: "helpCircle" },
];

// Helper function to get nav items by role
export function getNavItemsByRole(role: string): DashboardNavItem[] {
  const roleMap: Record<string, DashboardNavItem[]> = {
    professional: professionalNavItems,
    student: studentNavItems,
    fresher: fresherNavItems,
  };
  
  return roleMap[role] || professionalNavItems;
}


export type { DashboardNavItem as DashboardNavItemType };