"use client";

import { GraduationCap, CalendarDays } from "lucide-react";
import { ProfileData } from "@/types/profile";
import { EducationCardProps } from "@/types/profile";

export default function EducationCard({
  profile,
}: EducationCardProps) {
  const education = profile.educations?.[0];

  if (!education) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--card)] p-8">

      {/* Heading */}
      <div className="flex items-center gap-3">
        <GraduationCap className="h-6 w-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">
          Education
        </h2>
      </div>

      <div className="my-6 border-t border-white/10" />

      {/* Content */}
      <div className="flex gap-5">

        {/* Blue Dot */}
        <div className="mt-3 h-4 w-4 rounded-full bg-cyan-400 shrink-0" />

        <div className="flex-1">

          <h3 className="text-md font-bold text-white">
            {education.degree?.toUpperCase()}
          </h3>

          <p className="mt-2 text-md text-gray-300">
            {education.specialization}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-8 text-xl">

            <div className="flex items-center gap-2 text-cyan-400">
              <GraduationCap className="h-5 w-5 text-blue-400" />
              <span>{education.college_display}</span>
            </div>

            <div className="flex items-center gap-2 text-gray-300 text-md">
              <CalendarDays className="h-4 w-4 text-red-400" />
              <span>{education.yearOfGraduation}</span>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}