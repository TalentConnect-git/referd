"use client";

import Link from "next/link";
import { Briefcase, UserPen, Users } from "lucide-react";

type QuickActionChipsProps = {
  userType: string;
};

const actions = [
  {
    label: "Browse jobs",
    href: "jobs",
    icon: Briefcase,
  },
  {
    label: "Find alumni",
    href: "alumani-network",
    icon: Users,
  },
  {
    label: "Update profile",
    href: "profile",
    icon: UserPen,
  },
];

export default function QuickActionChips({ userType }: QuickActionChipsProps) {
  return (
    <div className="mb-4 flex flex-wrap gap-3">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.href}
            href={`/${userType}/${action.href}`}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--card)] px-4 text-sm font-medium text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)] hover:shadow-sm hover:scale-[1.02] active:scale-[0.98]"
          >
            <Icon className="h-4 w-4" />
            <span>{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}