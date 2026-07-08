// components/achievements/AchievementItem.tsx
"use client";

import { AchievementItemType } from "@/types/achievements";
import { getText } from "@/lib/achievements-utils";

interface AchievementItemProps {
  item: AchievementItemType;
}

export default function AchievementItem({ item }: AchievementItemProps) {
  const title = getText(item.title, "N/A");
  const event = getText(item.event);
  const date = getText(item.date);

  return (
    <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
      <h3 className="text-[14px] font-medium leading-tight text-[#37e875]">
        🏆 {title}
      </h3>

      {event && (
        <p className="mt-1.5 text-[12px] font-medium text-[#7891c7]">
          📍 {event}
        </p>
      )}

      {date && (
        <p className="mt-2 text-[12px] font-medium text-[#7891c7]">
          📅 {date}
        </p>
      )}
    </div>
  );
}