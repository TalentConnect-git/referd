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
    <section className="rounded-[18px] border border-white/10 bg-[#071018] px-[18px] py-[18px] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
          <SlidersHorizontal className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-[14px] font-bold text-white">
          Job Preferences
        </h2>
      </div>

      <div className="mt-[18px] border-t border-white/10" />

      <div className="mt-[17px] grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
          <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
            CURRENT SALARY
          </p>

          <p className="mt-1 text-[14px] font-medium leading-5 text-white">
            {currentSalary}
          </p>
        </div>

        <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
          <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
            EXPECTED SALARY
          </p>

          <p className="mt-1 text-[14px] font-medium leading-5 text-[#37e875]">
            {expectedSalary}
          </p>
        </div>

        <div className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4">
          <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
            OPEN TO SHIFT
          </p>

          <p className="mt-1 text-[14px] font-medium leading-5 text-white">
            {openToShift}
          </p>
        </div>
      </div>

      <div className="mt-[17px] grid grid-cols-1 gap-x-4 gap-y-4 md:grid-cols-2">
        <div>
          <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
            PREFERRED LOCATIONS
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {preferredLocations.length > 0 ? (
              preferredLocations.map((location) => (
                <span
                  key={location}
                  className="inline-flex h-6 items-center rounded-full bg-[#0b1621] px-3 text-[12px] font-medium text-white"
                >
                  {location}
                </span>
              ))
            ) : (
              <span className="inline-flex h-6 items-center rounded-full bg-[#0b1621] px-3 text-[12px] font-medium text-white">
                -
              </span>
            )}
          </div>
        </div>

        <div>
          <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[#7891c7]">
            PREFERRED JOB ROLES
          </p>

          <div className="mt-2 flex flex-wrap gap-2">
            {preferredRoles.length > 0 ? (
              preferredRoles.map((role) => (
                <span
                  key={role}
                  className="inline-flex h-6 items-center gap-1.5 rounded-full border border-[#37e875]/45 bg-[#12381f] px-3 text-[12px] font-medium text-[#37e875]"
                >
                  <BriefcaseBusiness className="h-3 w-3" />
                  {role}
                </span>
              ))
            ) : (
              <span className="inline-flex h-6 items-center gap-1.5 rounded-full border border-[#37e875]/45 bg-[#12381f] px-3 text-[12px] font-medium text-[#37e875]">
                <BriefcaseBusiness className="h-3 w-3" />
                -
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}