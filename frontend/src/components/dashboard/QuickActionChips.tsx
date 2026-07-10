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
    <div className="mx-4 mb-4 flex flex-wrap gap-3">
      {actions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.href}
            href={`/${userType}/${action.href}`}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-[#1e293b] bg-[#0f172a] px-4 text-[13px] font-medium text-white transition hover:border-[var(--primary)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
          >
            <Icon className="h-4 w-4" />
            <span>{action.label}</span>
          </Link>
        );
      })}
    </div>
  );
}
