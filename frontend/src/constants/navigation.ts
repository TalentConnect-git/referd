import type { DashboardNavItem } from "@/components/DashboardLayout";

export const professionalNavItems: DashboardNavItem[] = [

  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/jobs", label: "Referral Jobs", icon: "briefcase" },
  { to: "/applications", label: "Applications", icon: "file" },
  { to: "/saved-jobs", label: "Saved Jobs", icon: "bookmark" },
  { to: "/referrals", label: "My Referrals", icon: "userCheck" },
  { to: "/alumani-network", label: "Alumni Network", icon: "users" },
  { to: "/messages", label: "Messages", icon: "message", badge: 3 },
  { to: "/notifications", label: "Notifications", icon: "bell", badge: 5 },
  { to: "/activity", label: "Activity Feed", icon: "activity" },
  { to: "/profile", label: "Profile", icon: "user" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

export const studentNavItems: DashboardNavItem[] = [
  
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  { to: "/internships", label: "Internships", icon: "briefcase" },
  // { to: "/referral-jobs", label: "Referral Jobs", icon: "building" },
  { to: "/jobs", label: "Jobs", icon: "building" },
  { to: "/applications", label: "Applications", icon: "file" },
  { to: "/saved-jobs", label: "Saved Jobs", icon: "bookmark" },
  { to: "/alumani-network", label: "Alumni Network", icon: "graduation" },
  // { to: "/messages", label: "Messages", icon: "message", badge: 2 },
  // { to: "/notifications", label: "Notifications", icon: "bell", badge: 4 },
  { to: "/profile", label: "Profile", icon: "user" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

export const fresherNavItems: DashboardNavItem[] = [
  
  { to: "/dashboard", label: "Dashboard", icon: "dashboard" },
  // { to: "/referral-jobs", label: "Referral Jobs", icon: "briefcase" },
  { to: "/internships", label: "Internships", icon: "briefcase" },
  { to: "/jobs", label: "Jobs", icon: "building" },
  { to: "/applications", label: "Applications", icon: "file" },
  { to: "/saved-jobs", label: "Saved Jobs", icon: "bookmark" },
  // { to: "/interviews", label: "Interviews", icon: "calendar" },
  { to: "/alumani-network", label: "Alumni Network", icon: "network" },
  // { to: "/messages", label: "Messages", icon: "message", badge: 1 },
  // { to: "/notifications", label: "Notifications", icon: "bell", badge: 3 },
  // { to: "/activity", label: "Activity Feed", icon: "award" },
  { to: "/profile", label: "Profile", icon: "user" },
  { to: "/settings", label: "Settings", icon: "settings" },
];

// Helper function to get nav items by role
export function getNavItemsByRole(role: string): DashboardNavItem[] {
  switch (role) {
    case "professional":
      return professionalNavItems;
    case "student":
      return studentNavItems;
    case "fresher":
      return fresherNavItems;
    default:
      return professionalNavItems;
  }
}