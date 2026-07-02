"use client";

import { Award, Building2 } from "lucide-react";
// import { ProfileData } from "@/types/profile";
import { SkillsCardProps } from "@/types/profile";

export default function SkillsCard({
  profile,
}: SkillsCardProps) {

  const skills = Array.isArray(profile.skills)
    ? profile.skills
    : profile.skills
      ? [profile.skills]
      : [];

  const industries = Array.isArray(profile.industry)
    ? profile.industry
    : profile.industry
      ? [profile.industry]
      : [];

  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--card)] p-6">

      {/* Skills */}
      <div className="flex items-center gap-3">
        <Award className="h-5 w-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">
          Skills
        </h2>
      </div>

      <div className="my-5 border-t border-white/10" />

      <div className="flex flex-wrap gap-3">

        {skills.length ? (
          skills.map((skill) => (
            <span
              key={skill}
              className="rounded-full border border-gray-500/30 bg-gray-500/10 px-4 py-2 text-sm font-medium text-gray-300"
            >
              {skill}
            </span>
          ))
        ) : (
          <span className="text-gray-400">
            No skills added
          </span>
        )}

      </div>

      {/* Industries */}

      <div className="mt-8 flex items-center gap-3">
        <Building2 className="h-5 w-5 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">
          Industries
        </h2>
      </div>

      <div className="my-5 border-t border-white/10" />

      <div className="flex flex-wrap gap-3">

        {industries.length ? (
          industries.map((industry) => (
            <span
              key={industry}
              className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300"
            >
              {industry}
            </span>
          ))
        ) : (
          <span className="text-gray-400">
            No industries added
          </span>
        )}

      </div>

    </div>
  );
}