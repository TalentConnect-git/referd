"use client";

import { CalendarDays, GraduationCap } from "lucide-react";
import { ProfileData } from "@/types/profile";

interface EducationCardProps {
  profile: ProfileData;
}

type EducationWithBackendFields = NonNullable<
  ProfileData["educations"]
>[number] & {
  college?: string;
  college_display?: string;
  collegeName?: string;
  course?: string;
  graduationYear?: string;
  specialization?: string;
  degree?: string;
  cgpa?: string;
  yearOfGraduation?: string;
  isCurrent?: boolean;
};

const getValue = (value?: string | null, fallback = "N/A") => {
  if (!value || !String(value).trim()) return fallback;
  return String(value).trim();
};

const toTitleCase = (value?: string | null) => {
  if (!value || !value.trim()) return "N/A";

  return value
    .trim()
    .split(" ")
    .map((word) => {
      const lower = word.toLowerCase();

      if (lower === "b.tech" || lower === "btech") return "B.Tech";
      if (lower === "m.tech" || lower === "mtech") return "M.Tech";
      if (lower === "b.com") return "B.Com";
      if (lower === "m.com") return "M.Com";
      if (lower === "bca") return "BCA";
      if (lower === "mca") return "MCA";
      if (lower === "mba") return "MBA";
      if (lower === "10th") return "10th";
      if (lower === "12th") return "12th";

      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
};

export default function EducationCard({ profile }: EducationCardProps) {
  const educations = (profile.educations || []) as EducationWithBackendFields[];

  if (!educations.length) {
    return null;
  }

  const sortedEducations = [...educations].sort((a, b) => {
    if (a.isCurrent && !b.isCurrent) return -1;
    if (!a.isCurrent && b.isCurrent) return 1;
    return 0;
  });

  return (
    <section className="rounded-[18px] border border-white/10 bg-[#071018] px-[18px] py-[18px] shadow-[0_18px_45px_rgba(0,0,0,0.28)]">
      <div className="flex items-center gap-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-[9px] bg-[#12381f] text-[#37e875]">
          <GraduationCap className="h-3.5 w-3.5" />
        </div>

        <h2 className="text-[14px] font-bold text-white">
          Education
        </h2>
      </div>

      <div className="mt-[18px] border-t border-white/10" />

      <div className="mt-[17px] space-y-4">
        {sortedEducations.map((edu, index) => {
          const degree = toTitleCase(edu.degree || edu.course);

          const specialization = toTitleCase(edu.specialization);

          const college =
            edu.college_display ||
            edu.college ||
            edu.collegeName ||
            "N/A";

          const graduationYear =
            edu.yearOfGraduation || edu.graduationYear || "N/A";

          return (
            <div
              key={edu._id || `${degree}-${index}`}
              className="rounded-[12px] border border-white/10 bg-[#0b1621] px-4 py-4"
            >
              <div className="flex gap-3">
                <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#12381f]">
                  <div className="h-3 w-3 rounded-full bg-[#37e875]" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h3 className="truncate text-[14px] font-medium leading-tight text-white">
                        {degree}
                      </h3>

                      <p className="mt-1.5 text-[12px] font-normal text-[#7891c7]">
                        {specialization}
                      </p>
                    </div>

                    {edu.isCurrent && (
                      <span className="inline-flex w-fit items-center rounded-full border border-[#37e875]/40 bg-[#12381f] px-3 py-1 text-[9px] font-medium text-[#37e875]">
                        ● Current
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#37e875]">
                      <GraduationCap className="h-3.5 w-3.5" />
                      <span>{getValue(college)}</span>
                    </div>

                    <div className="flex items-center gap-2 text-[12px] font-medium text-[#7891c7]">
                      <CalendarDays className="h-3.5 w-3.5 text-[#37e875]" />
                      <span>{graduationYear}</span>
                    </div>

                    {edu.cgpa && (
                      <div className="text-[12px] font-medium text-white">
                        CGPA:{" "}
                        <span className="text-[#37e875]">{edu.cgpa}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}