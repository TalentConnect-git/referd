// components/achievements/AwardItem.tsx
"use client";

import { AwardItemType } from "@/types/achievements";
import { getText, formatDateRange } from "@/lib/achievements-utils";

interface AwardItemProps {
  item: AwardItemType;
}

export default function AwardItem({ item }: AwardItemProps) {
  const title = getText(item.title, "N/A");
  const organization = getText(item.organization);
  const dateRange = formatDateRange(item.startDate, item.endDate);
  const description = getText(item.description);

  return (
    <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
      <h3 className="text-[14px] font-medium leading-tight text-[#37e875]">
        🏅 {title}
      </h3>

      {organization && (
        <p className="mt-1.5 text-[12px] font-medium text-[#7891c7]">
          🏢 {organization}
        </p>
      )}

      {dateRange && (
        <p className="mt-2 text-[12px] font-medium text-[#7891c7]">
          📅 {dateRange}
        </p>
      )}

      {description && (
        <p className="mt-3 whitespace-pre-line text-[12px] font-normal leading-5 text-white">
          {description}
        </p>
      )}
    </div>
  );
}