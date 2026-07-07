// components/profile/NoticePeriod.tsx
"use client";

import { CalendarDays, CheckCircle2, Timer } from "lucide-react";
import { ProfileData } from "@/types/profile";

interface NoticePeriodCardProps {
  profile: ProfileData;
}

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const parseNumber = (value?: string | number | null) => {
  if (value === null || value === undefined || value === "") return 0;

  const parsed = Number.parseInt(String(value), 10);
  return Number.isNaN(parsed) ? 0 : parsed;
};

const parseDate = (value?: string | null) => {
  if (!value || !String(value).trim()) return null;

  const raw = String(value).trim();

  // Supports dd/mm/yyyy or dd-mm-yyyy
  const indianDateMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/);

  if (indianDateMatch) {
    const day = Number(indianDateMatch[1]);
    const month = Number(indianDateMatch[2]) - 1;
    let year = Number(indianDateMatch[3]);

    if (year < 100) {
      year += 2000;
    }

    const date = new Date(year, month, day);
    date.setHours(0, 0, 0, 0);

    if (!Number.isNaN(date.getTime())) {
      return date;
    }
  }

  // Supports ISO date from backend
  const date = new Date(raw);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  date.setHours(0, 0, 0, 0);
  return date;
};

const addDays = (date: Date, days: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  result.setHours(0, 0, 0, 0);
  return result;
};

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const diffInDays = (start: Date, end: Date) => {
  return Math.floor((end.getTime() - start.getTime()) / MS_PER_DAY);
};

const formatDate = (date: Date | null) => {
  if (!date) return "N/A";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
};

const clamp = (value: number, min: number, max: number) => {
  return Math.min(Math.max(value, min), max);
};

export default function NoticePeriodCard({ profile }: NoticePeriodCardProps) {
  const servingNotice = Boolean(profile.servingNoticePeriod);

  // If servingNoticePeriod is false, do not display this UI
  if (!servingNotice) {
    return null;
  }

  const totalNoticeDays = parseNumber(profile.noticePeriod);
  const startDate = parseDate(profile.noticePeriodStartDate);

  const today = getToday();
  const endDate = startDate ? addDays(startDate, totalNoticeDays) : null;

  const rawDaysServed = startDate ? diffInDays(startDate, today) : 0;
  const daysServed = clamp(rawDaysServed, 0, totalNoticeDays);

  const remainingDays = Math.max(totalNoticeDays - daysServed, 0);

  const progress =
    totalNoticeDays > 0 ? clamp((daysServed / totalNoticeDays) * 100, 0, 100) : 0;

  const isComplete = remainingDays === 0 && totalNoticeDays > 0;

  return (
    <section className="rounded-[18px] border border-white/10 bg-[#071018] px-[18px] py-[18px] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
          <Timer className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-[14px] font-bold text-white">
          Notice Period
        </h2>
      </div>

      <div className="mt-[18px] border-t border-white/10" />

      <div className="mt-[17px] grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
            <CalendarDays className="h-3.5 w-3.5" />
          </div>

          <p className="text-[14px] font-medium leading-none text-white">
            {totalNoticeDays}
          </p>
          <p className="mt-2 text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
            Notice Days
          </p>
        </div>

        <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>

          <p className="text-[14px] font-medium leading-none text-white">
            {daysServed}
          </p>
          <p className="mt-2 text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
            Days Served
          </p>
        </div>

        <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
            <CalendarDays className="h-3.5 w-3.5" />
          </div>

          <p className="text-[14px] font-medium leading-none text-white">
            {formatDate(endDate)}
          </p>
          <p className="mt-2 text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
            Last Day
          </p>
        </div>
      </div>

      {/* Extra Dates */}
      <div className="mt-[17px] grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-3">
          <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
            Start Date
          </p>
          <p className="mt-1 text-[12px] font-medium text-white">
            {formatDate(startDate)}
          </p>
        </div>

        <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-3">
          <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
            Remaining Days
          </p>
          <p className="mt-1 text-[12px] font-medium text-white">
            {remainingDays}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-[17px]">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
            Progress
          </p>

          <span className={`text-[12px] font-medium ${isComplete ? "text-[#37e875]" : "text-[#37e875]"}`}>
            {isComplete ? "Complete" : `${remainingDays} Days Remaining`}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-[#0b1621]">
          <div
            className="h-full rounded-full bg-[#37e875] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}