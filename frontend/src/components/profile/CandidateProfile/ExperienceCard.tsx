"use client";

import { BriefcaseBusiness, CalendarDays } from "lucide-react";
import { ProfileData } from "@/types/profile";
import { ExperienceCardProps } from "@/types/profile";

export default function ExperienceCard({
  profile,
}: ExperienceCardProps) {
  const experiences =
    profile.experiences?.filter((exp) => exp.company) || [];

  if (!experiences.length) return null;

  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--card)] p-8">

      {/* Heading */}
      <div className="flex items-center gap-3">
        <BriefcaseBusiness className="h-6 w-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">
          Experience
        </h2>
      </div>

      <div className="my-6 border-t border-white/10" />

      <div className="space-y-8">

        {experiences.map((exp) => (
          <div key={exp._id} className="flex gap-6">

            {/* Company Logo Placeholder */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl font-bold text-black">
              {exp.company?.charAt(0)}
            </div>

            {/* Details */}
            <div className="flex-1">

              <div className="flex items-start justify-between">

                <div>
                  <h3 className="text-xl font-bold text-white">
                    {exp.company}
                  </h3>

                  <p className="mt-1 text-lg text-gray-300">
                    {exp.role}
                  </p>
                </div>

                {exp.isCurrent && (
                  <div className="rounded-full bg-green-500/15 px-5 py-2 text-green-400">
                    ● Current
                  </div>
                )}

              </div>

              <div className="mt-5 flex items-center gap-2 text-xl text-gray-300">

                <CalendarDays className="h-5 w-5 text-red-400" />

                <span>
                  {exp.startDate} - {exp.isCurrent ? <span className="text-green-500 text-sm">Present</span> : ""}
                </span>

              </div>

              {exp.description && (
                <div className="mt-5 whitespace-pre-line text-lg text-gray-400">
                  {exp.description}
                </div>
              )}

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}