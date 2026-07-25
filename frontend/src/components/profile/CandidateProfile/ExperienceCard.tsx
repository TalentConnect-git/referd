"use client";

import {
  BriefcaseBusiness,
  CalendarDays,
  MapPin,
} from "lucide-react";

import { ProfileData } from "@/types/profile";

interface ExperienceCardProps {
  profile: ProfileData;
}

const getText = (value?: string | null, fallback = "N/A") => {
  if (!value || !String(value).trim()) return fallback;
  return String(value).trim();
};

const getCompanyInitial = (company?: string | null) => {
  if (!company || !company.trim()) return "C";
  return company.trim().charAt(0).toUpperCase();
};

const formatDateRange = (
  startDate?: string | null,
  endDate?: string | null,
  isCurrent?: boolean,
) => {
  const start = getText(startDate, "N/A");

  if (isCurrent) {
    return `${start} — Present`;
  }

  const end = getText(endDate, "N/A");

  return `${start} — ${end}`;
};

export default function ExperienceCard({ profile }: ExperienceCardProps) {
  const experiences =
    profile.experiences?.filter(
      (exp) => exp.company || exp.company_display || exp.role,
    ) || [];

  if (!experiences.length) {
    return null;
  }

  return (
    <section className="surface-card rounded-[18px] border border-[var(--border)] bg-[var(--card)] p-[18px] shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-[var(--primary)]">
          <BriefcaseBusiness className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-sm font-bold text-[var(--text-primary)]">
          Experience
        </h2>
      </div>

      <div className="mt-[18px] border-t border-[var(--border)]" />

      <div className="mt-[17px] space-y-4">
        {experiences.map((exp, index) => {
          const companyName = exp.company_display || exp.company || "N/A";
          const role = exp.role || "N/A";

          const dateRange = formatDateRange(
            exp.startDate,
            exp.endDate,
            exp.isCurrent,
          );

          return (
            <div
              key={exp._id || `${companyName}-${index}`}
              className="rounded-[12px] border border-[var(--border)] bg-[var(--background-soft)] px-4 py-4"
            >
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-[var(--primary-soft)] text-xs font-medium text-[var(--primary)]">
                  {getCompanyInitial(companyName)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-medium leading-tight text-[var(--text-primary)]">
                        {companyName}
                      </h3>

                      <p className="mt-1.5 text-xs font-medium text-[var(--primary)]">
                        {role}
                      </p>
                    </div>

                    {exp.isCurrent && (
                      <span className="badge badge-success inline-flex w-fit items-center rounded-full border border-[var(--success-border)] bg-[var(--success-soft)] px-3 py-1 text-[9px] font-medium text-[var(--success)]">
                        ● Current
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                      <CalendarDays className="h-3.5 w-3.5 text-[var(--primary)]" />
                      <span>
                        {exp.isCurrent ? (
                          <>
                            {getText(exp.startDate, "N/A")} —{" "}
                            <span className="font-medium text-[var(--primary)]">
                              Present
                            </span>
                          </>
                        ) : (
                          dateRange
                        )}
                      </span>
                    </div>

                    {exp.location && (
                      <div className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
                        <MapPin className="h-3.5 w-3.5 text-[var(--primary)]" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>

                  {exp.description && (
                    <p className="mt-4 whitespace-pre-line text-xs font-normal leading-5 text-[var(--text-secondary)]">
                      {exp.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}