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
    <section className="rounded-[18px] border border-white/10 bg-[#071018] px-[18px] py-[18px] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
          <BriefcaseBusiness className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-[14px] font-bold text-white">
          Experience
        </h2>
      </div>

      <div className="mt-[18px] border-t border-white/10" />

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
              className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4"
            >
              <div className="flex gap-3">
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] bg-[#12381f] text-[12px] font-medium text-[#37e875]">
                  {getCompanyInitial(companyName)}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-[14px] font-medium leading-tight text-white">
                        {companyName}
                      </h3>

                      <p className="mt-1.5 text-[12px] font-medium text-[#37e875]">
                        {role}
                      </p>
                    </div>

                    {exp.isCurrent && (
                      <span className="inline-flex w-fit items-center rounded-full border border-[#37e875]/40 bg-[#12381f] px-3 py-1 text-[9px] font-medium text-[#37e875]">
                        ● Current
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#7891c7]">
                      <CalendarDays className="h-3.5 w-3.5 text-[#37e875]" />
                      <span>
                        {exp.isCurrent ? (
                          <>
                            {getText(exp.startDate, "N/A")} —{" "}
                            <span className="font-medium text-[#37e875]">
                              Present
                            </span>
                          </>
                        ) : (
                          dateRange
                        )}
                      </span>
                    </div>

                    {exp.location && (
                      <div className="flex items-center gap-2 text-[12px] font-medium text-[#7891c7]">
                        <MapPin className="h-3.5 w-3.5 text-[#37e875]" />
                        <span>{exp.location}</span>
                      </div>
                    )}
                  </div>

                  {exp.description && (
                    <p className="mt-4 whitespace-pre-line text-[12px] font-normal leading-5 text-white">
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