"use client";

import { IdCard } from "lucide-react";
import { ProfileData } from "@/types/profile";

interface PersonalInfoProps {
  profile: ProfileData;
}

const getValue = (value: unknown, fallback = "-") => {
  if (value === null || value === undefined) return fallback;

  if (typeof value === "string") {
    return value.trim() || fallback;
  }

  return String(value);
};

const formatDate = (date?: string | null) => {
  if (!date) return "-";

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return parsedDate.toISOString().split("T")[0];
};

const getLanguages = (languages: unknown) => {
  if (!languages) return "-";

  if (Array.isArray(languages)) {
    return languages.filter(Boolean).join(", ") || "-";
  }

  if (typeof languages === "string") {
    return languages.trim() || "-";
  }

  return "-";
};

export default function PersonalInformation({ profile }: PersonalInfoProps) {
  // Left column items (3 items)
  const leftColumnItems = [
    {
      label: "ETHNICITY",
      value: getValue(profile.ethnicity),
    },
    {
      label: "VISA STATUS",
      value: getValue(profile.visaStatus),
    },
    {
      label: "GENDER",
      value: getValue(profile.gender),
    },
  ];

  // Right column items (3 items)
  const rightColumnItems = [
    {
      label: "DATE OF BIRTH",
      value: formatDate(profile.dob),
    },
    {
      label: "MARITAL STATUS",
      value: getValue(profile.maritalStatus),
    },
    {
      label: "LANGUAGES KNOWN",
      value: getLanguages(profile.languagesKnown),
    },
  ];

  return (
    <section className="surface-card rounded-[18px] border border-[var(--border)] bg-[var(--card)] p-[18px] shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]">
          <IdCard className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-sm font-bold text-[var(--text-primary)]">
          Personal Information
        </h2>
      </div>

      <div className="mt-[18px] border-t border-[var(--border)]" />

      <div className="mt-[17px] grid grid-cols-1 gap-x-10 gap-y-[18px] sm:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-[18px]">
          {leftColumnItems.map((item) => (
            <div key={item.label} className="min-w-0">
              <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[var(--text-muted)]">
                {item.label}
              </p>

              <p className="mt-1 truncate text-xs font-medium leading-5 text-[var(--text-primary)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-[18px]">
          {rightColumnItems.map((item) => (
            <div key={item.label} className="min-w-0">
              <p className="text-[9px] font-normal uppercase tracking-[0.08em] text-[var(--text-muted)]">
                {item.label}
              </p>

              <p className="mt-1 truncate text-xs font-medium leading-5 text-[var(--text-primary)]">
                {item.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}