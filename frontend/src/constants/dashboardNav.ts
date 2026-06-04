import {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  UserCheck,
  MessageSquare,
  Bell,
  Activity,
  Bookmark,
} from "lucide-react";

export const professionalNavItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/jobs", label: "Referral Jobs", icon: Briefcase },
  { to: "/applications", label: "Applications", icon: FileText },
  { to: "/referrals", label: "My Referrals", icon: UserCheck },
  { to: "/alumni", label: "Alumni Network", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { to: "/notifications", label: "Notifications", icon: Bell, badge: 5 },
  { to: "/activity", label: "Activity Feed", icon: Activity },
];

export const studentNavItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/internships", label: "Internships", icon: Briefcase },
  { to: "/referral-jobs", label: "Referral Jobs", icon: Briefcase },
  { to: "/applications", label: "Applications", icon: FileText },
  { to: "/saved-jobs", label: "Saved Jobs", icon: Bookmark },
  { to: "/alumni", label: "Alumni Network", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { to: "/notifications", label: "Notifications", icon: Bell, badge: 5 },
];

export const fresherNavItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/referral-jobs", label: "Referral Jobs", icon: Briefcase },
  { to: "/applications", label: "Applications", icon: FileText },
  { to: "/saved-jobs", label: "Saved Jobs", icon: Bookmark },
  { to: "/alumni", label: "Alumni Network", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageSquare, badge: 3 },
  { to: "/notifications", label: "Notifications", icon: Bell, badge: 5 },
];