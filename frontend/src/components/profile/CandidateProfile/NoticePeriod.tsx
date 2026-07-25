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
  const totalNoticeDays = parseNumber(profile.noticePeriod);

  // If servingNoticePeriod is false, show simplified version
  if (!servingNotice) {
    return (
      <section className="surface-card rounded-[18px] border border-[var(--border)] bg-[var(--card)] p-[18px] shadow-lg">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]">
            <Timer className="h-3.5 w-3.5" />
          </div>

          <h2 className="text-sm font-bold text-[var(--text-primary)]">
            Notice Period
          </h2>
        </div>

        <div className="mt-[18px] border-t border-[var(--border)]" />

        <div className="mt-[17px] grid grid-cols-1 gap-3 md:grid-cols-1">
          <div className="rounded-[12px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-4">
            <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]">
              <CalendarDays className="h-3.5 w-3.5" />
            </div>

            <p className="text-sm font-medium leading-none text-[var(--text-primary)]">
              {totalNoticeDays}
            </p>
            <p className="mt-2 text-[9px] font-normal uppercase tracking-[0.08em] text-[var(--text-muted)]">
              Notice Days
            </p>
          </div>
        </div>
      </section>
    );
  }

  // If servingNoticePeriod is true, show full detailed view
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
    <section className="surface-card rounded-[18px] border border-[var(--border)] bg-[var(--card)] p-[18px] shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]">
          <Timer className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-sm font-bold text-[var(--text-primary)]">
          Notice Period
        </h2>
      </div>

      <div className="mt-[18px] border-t border-[var(--border)]" />

      <div className="mt-[17px] grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-4">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]">
            <CalendarDays className="h-3.5 w-3.5" />
          </div>

          <p className="text-sm font-medium leading-none text-[var(--text-primary)]">
            {totalNoticeDays}
          </p>
          <p className="mt-2 text-[9px] font-normal uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Notice Days
          </p>
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-4">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]">
            <CheckCircle2 className="h-3.5 w-3.5" />
          </div>

          <p className="text-sm font-medium leading-none text-[var(--text-primary)]">
            {daysServed}
          </p>
          <p className="mt-2 text-[9px] font-normal uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Days Served
          </p>
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-4">
          <div className="mb-3 flex h-7 w-7 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]">
            <CalendarDays className="h-3.5 w-3.5" />
          </div>

          <p className="text-sm font-medium leading-none text-[var(--text-primary)]">
            {formatDate(endDate)}
          </p>
          <p className="mt-2 text-[9px] font-normal uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Last Day
          </p>
        </div>
      </div>

      {/* Extra Dates */}
      <div className="mt-[17px] grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-3">
          <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Start Date
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--text-primary)]">
            {formatDate(startDate)}
          </p>
        </div>

        <div className="rounded-[12px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-3">
          <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Remaining Days
          </p>
          <p className="mt-1 text-xs font-medium text-[var(--text-primary)]">
            {remainingDays}
          </p>
        </div>
      </div>

      {/* Progress */}
      <div className="mt-[17px]">
        <div className="mb-2 flex items-center justify-between">
          <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[var(--text-muted)]">
            Progress
          </p>

          <span className={`text-xs font-medium ${isComplete ? "text-[var(--success)]" : "text-[var(--primary)]"}`}>
            {isComplete ? "Complete" : `${remainingDays} Days Remaining`}
          </span>
        </div>

        <div className="h-2 w-full overflow-hidden rounded-full bg-[var(--background-soft)]">
          <div
            className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </section>
  );
}