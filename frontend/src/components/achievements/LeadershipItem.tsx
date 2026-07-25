// components/achievements/LeadershipItem.tsx
"use client";

import { LeadershipItemType } from "@/types/achievements";
import { getText, formatDateRange } from "@/lib/achievements-utils";
import { Building2, Briefcase, Calendar } from "lucide-react";

interface LeadershipItemProps {
  item: LeadershipItemType;
}

export default function LeadershipItem({ item }: LeadershipItemProps) {
  const role = getText(item.role, "N/A");
  const organization = getText(item.organization);
  const dateRange = formatDateRange(item.startDate, item.endDate);
  const description = getText(item.description);

  return (
    <div className="rounded-[12px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-4">
      {/* Organization - Top */}
      {organization && (
        <p className="flex items-center gap-2 text-sm font-medium leading-tight text-[var(--text-primary)]">
          <Building2 className="h-4 w-4" />
          {organization}
        </p>
      )}

      {/* Role - Below Organization in Primary Color */}
      <h3 className="mt-1.5 flex items-center gap-2 text-xs font-medium text-[var(--primary)]">
        <Briefcase className="h-3.5 w-3.5" />
        {role}
      </h3>

      {/* Date Range */}
      {dateRange && (
        <p className="mt-1.5 flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
          <Calendar className="h-3.5 w-3.5" />
          {dateRange}
        </p>
      )}

      {/* Description */}
      {description && (
        <p className="mt-3 whitespace-pre-line text-xs font-normal leading-5 text-[var(--text-secondary)]">
          {description}
        </p>
      )}
    </div>
  );
}