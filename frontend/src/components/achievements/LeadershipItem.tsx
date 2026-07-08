// components/achievements/LeadershipItem.tsx
"use client";

import { LeadershipItemType } from "@/types/achievements";
import { getText, formatDateRange } from "@/lib/achievements-utils";

interface LeadershipItemProps {
  item: LeadershipItemType;
}

export default function LeadershipItem({ item }: LeadershipItemProps) {
  const role = getText(item.role, "N/A");
  const organization = getText(item.organization);
  const dateRange = formatDateRange(item.startDate, item.endDate);
  const description = getText(item.description);

  return (
    <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
      {/* Organization - Top */}
      {organization && (
        <p className="text-[14px] font-medium leading-tight text-white">
          {organization}
        </p>
      )}

      {/* Role - Below Organization in Green */}
      <h3 className="mt-1.5 text-[12px] font-medium text-[#37e875]">
        {role}
      </h3>

      {/* Date Range */}
      {dateRange && (
        <p className="mt-1.5 text-[12px] font-medium text-[#7891c7]">
          📅 {dateRange}
        </p>
      )}

      {/* Description */}
      {description && (
        <p className="mt-3 whitespace-pre-line text-[12px] font-normal leading-5 text-white">
          {description}
        </p>
      )}
    </div>
  );
}