"use client";

import {
  BriefcaseBusiness,
  IndianRupee,
  SlidersHorizontal,
} from "lucide-react";

import { ProfileData } from "@/types/profile";

interface JobPreferencesCardProps {
  profile: ProfileData;
}

const getText = (value: unknown, fallback = "-") => {
  if (value === null || value === undefined) return fallback;

  if (typeof value === "string") {
    return value.trim() || fallback;
  }

  return String(value);
};

const getList = (value: unknown): string[] => {
  if (!value) return [];

  if (Array.isArray(value)) {
    return value
      .map((item) => {
        if (typeof item === "string") return item.trim();

        if (typeof item === "object" && item !== null) {
          const obj = item as {
            name?: string;
            role?: string;
            title?: string;
            label?: string;
            value?: string;
          };

          return (
            obj.name ||
            obj.role ||
            obj.title ||
            obj.label ||
            obj.value ||
            ""
          ).trim();
        }

        return String(item).trim();
      })
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
};

const formatCurrency = (
  amount?: string | number | null,
  currency?: string | null,
) => {
  if (amount === null || amount === undefined || amount === "") return "-";

  const numericAmount =
    typeof amount === "number"
      ? amount
      : Number(String(amount).replace(/[^\d.-]/g, ""));

  if (Number.isNaN(numericAmount)) {
    return `${currency || "₹"}${amount}`;
  }

  return `${currency || "₹"}${numericAmount.toLocaleString("en-IN")}`;
};

export default function JobPreferencesCard({
  profile,
}: JobPreferencesCardProps) {
  const currentSalary = formatCurrency(
    profile.currentSalaryAmount,
    profile.currentSalaryCurrency || "₹",
  );

  const expectedSalary = formatCurrency(
    profile.expectedSalaryAmount,
    profile.expectedSalaryCurrency || "₹",
  );

  const openToShift = getText(profile.openToShift);

  const preferredLocations = getList(profile.locations);
  const preferredRoles = getList(profile.jobRoles);

  return (
    <section className="surface-card rounded-[14px] border border-[var(--border)] bg-[var(--card)] p-[14px] shadow-md">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-[var(--primary-soft)] text-[var(--primary)]">
          <SlidersHorizontal className="h-3 w-3" />
        </div>

        <h2 className="text-sm font-bold tracking-wide text-[var(--text-primary)]">
          Job Preferences
        </h2>
      </div>

      <div className="mt-[14px] border-t border-[var(--border)]" />

      {/* Salary & Shift Grid */}
      <div className="mt-[14px] grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        <div className="rounded-[10px] border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2.5">
          <p className="text-[8px] font-normal uppercase tracking-[0.1em] text-[var(--text-muted)]">
            CURRENT SALARY
          </p>

          <p className="mt-0.5 text-sm font-medium leading-5 text-[var(--text-primary)]">
            {currentSalary}
          </p>
        </div>

        <div className="rounded-[10px] border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2.5">
          <p className="text-[8px] font-normal uppercase tracking-[0.1em] text-[var(--text-muted)]">
            EXPECTED SALARY
          </p>

          <p className="mt-0.5 text-sm font-medium leading-5 text-[var(--primary)]">
            {expectedSalary}
          </p>
        </div>

        <div className="rounded-[10px] border border-[var(--border)] bg-[var(--background-soft)] px-3 py-2.5">
          <p className="text-[8px] font-normal uppercase tracking-[0.1em] text-[var(--text-muted)]">
            OPEN TO SHIFT
          </p>

          <p className="mt-0.5 text-sm font-medium leading-5 text-[var(--text-primary)]">
            {openToShift}
          </p>
        </div>
      </div>

      {/* Locations & Roles Grid */}
      <div className="mt-[14px] grid grid-cols-1 gap-x-4 gap-y-3 md:grid-cols-2">
        <div>
          <p className="text-[8px] font-normal uppercase tracking-[0.1em] text-[var(--text-muted)]">
            PREFERRED LOCATIONS
          </p>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {preferredLocations.length > 0 ? (
              preferredLocations.map((location) => (
                <span
                  key={location}
                  className="inline-flex h-5 items-center rounded-full bg-[var(--background-soft)] px-2.5 text-[11px] font-medium text-[var(--text-primary)]"
                >
                  {location}
                </span>
              ))
            ) : (
              <span className="inline-flex h-5 items-center rounded-full bg-[var(--background-soft)] px-2.5 text-[11px] font-medium text-[var(--text-muted)]">
                -
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-[8px] font-normal uppercase tracking-[0.1em] text-[var(--text-muted)]">
            PREFERRED JOB ROLES
          </p>

          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {preferredRoles.length > 0 ? (
              preferredRoles.map((role) => (
                <span
                  key={role}
                  className="badge badge-primary inline-flex h-5 items-center gap-1 rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)] px-2.5 text-[11px] font-medium text-[var(--primary)]"
                >
                  <BriefcaseBusiness className="h-2.5 w-2.5" />
                  {role}
                </span>
              ))
            ) : (
              <span className="badge badge-primary inline-flex h-5 items-center gap-1 rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)] px-2.5 text-[11px] font-medium text-[var(--primary)]">
                <BriefcaseBusiness className="h-2.5 w-2.5" />
                -
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}