"use client";

import Image from "next/image";
import {
  BadgeCheck,
  BriefcaseBusiness,
  MapPin,
  FileText,
  Building2,
} from "lucide-react";

import { ProfileData } from "@/types/profile";

interface CandidateHeaderProps {
  profile: ProfileData;
}

export default function CandidateHeader({ profile }: CandidateHeaderProps) {
  const currentExperience =
    profile.experiences?.find((exp) => exp.isCurrent) ??
    profile.experiences?.[0];

  const firstLetter = profile.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <div className="relative rounded-3xl border border-white/10 bg-[var(--card)] p-8">
      {/* Top Section */}
      <div className="flex items-start justify-between">
        <Image
          src={profile.profileImage || "/images/default-user.png"}
          alt={profile.name || "Profile"}
          width={100}
          height={100}
          className="h-28 w-28 rounded-full object-cover"
        />

        <div>
          <h1 className="text-2xl font-bold text-white">
            {firstLetter}
          </h1>

          {currentExperience && (
            <div className="mt-7 inline-flex rounded-full border border-green-700 bg-green-500/10 px-5 py-2">
              <span className="text-sm font-semibold text-green-400">
                {currentExperience.role} @ {currentExperience.company}
              </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 rounded-full border border-green-600 bg-green-500/10 px-2 py-1">
          <BadgeCheck className="h-3 w-3 text-green-400" />
          <span className="text-xs text-green-400">Verified</span>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="mt-10 flex items-center gap-8 text-[17px] text-gray-300">
        <div className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          <span>{profile.locations?.[0] || "N/A"}</span>
        </div>

        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-5 w-5" />
          <span>
            Worked at{" "}
            {profile.experiences?.filter((exp) => exp.company).length || 0}{" "}
            Companies
          </span>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/10 bg-[var(--background)] px-3 py-4 text-center">
          <BriefcaseBusiness className="mx-auto h-5 w-5 text-green-400" />
          <p className="mt-3 text-xl font-bold text-white">
            {profile.totalYearsOfExperience || "0"}
          </p>
          <p className="mt-3 text-sm text-gray-400">YOE</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[var(--background)] px-3 py-4 text-center">
          <BadgeCheck className="mx-auto h-5 w-5 text-green-400" />
          <p className="mt-3 text-xl font-bold text-white">
            {profile.skills?.length || 0}
          </p>
          <p className="mt-3 text-sm text-gray-400">Skills</p>
        </div>

        <div className="rounded-xl border border-white/10 bg-[var(--background)] px-3 py-4 text-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mx-auto h-5 w-5 text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M3 17l6-6 4 4 8-8" />
          </svg>

          <p className="mt-3 text-xl font-bold text-white">
            {profile.responseRate || 0}%
          </p>

          <p className="mt-3 text-sm text-gray-400">Response</p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-2 gap-4">
        {/* Resume */}
        <a
          href={profile.resume || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-3 rounded-lg bg-green-500 font-semibold text-white shadow-[0_0_30px_rgba(22,214,75,0.18)] transition hover:opacity-90"
        >
          <FileText className="h-5 w-5" />
          Resume
        </a>

        {/* LinkedIn */}
        <a
          href={profile.linkedin || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-12 items-center justify-center gap-3 rounded-lg border border-white/10 bg-[#222938] font-semibold text-gray-300 transition hover:bg-green-500"
        >
          <Building2 className="h-5 w-5" />
          LinkedIn
        </a>
      </div>
    </div>
  );
}