"use client";

import { SlidersHorizontal, BriefcaseBusiness, MapPin } from "lucide-react";
import { ProfileData } from "@/types/profile";
import { JobPreferencesCardProps } from "@/types/profile";

export default function JobPreferencesCard({
  profile,
}: JobPreferencesCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--card)] p-8">

      {/* Heading */}
      <div className="flex items-center gap-3">
        <SlidersHorizontal className="h-6 w-6 text-blue-400" />
        <h2 className="text-xl font-bold text-white">
          Job Preferences
        </h2>
      </div>

      <div className="my-6 border-t border-white/10" />

      {/* Current Salary */}
      <div className="mb-6">
        <p className="text-gray-400">
          Current Salary
        </p>

        <p className="mt-1 text-xl font-semibold text-white">
          {profile.currentSalaryCurrency}
          {" "}
          {profile.currentSalaryAmount || "-"}
        </p>
      </div>

      {/* Expected Salary */}
      <div className="mb-6">
        <p className="text-gray-400">
          Expected Salary
        </p>

        <p className="mt-1 text-xl font-semibold text-white">
          {profile.expectedSalaryCurrency}
          {" "}
          {profile.expectedSalaryAmount || "-"}
        </p>
      </div>

      {/* Open To Shift */}
      <div className="mb-6">
        <p className="text-gray-400">
          Open To Shift
        </p>

        <p className="mt-1 text-xl font-semibold text-white">
          {profile.openToShift || "-"}
        </p>
      </div>

      {/* Preferred Locations */}
      <div className="mb-6">
        <p className="mb-4 text-gray-400">
          Preferred Locations
        </p>

        <div className="flex flex-wrap gap-3">
          {profile.locations?.length ? (
            profile.locations.map((location:string) => (
              <span
                key={location}
                className="rounded-full bg-white/5 mb-2 px-4 py-2 text-sm text-white"
              >
                <MapPin className="mr-2 inline h-4 w-4 text-blue-400" />
                {location}
              </span>
            ))
          ) : (
            <span className="text-gray-400">-</span>
          )}
        </div>
      </div>

      {/* Preferred Job Roles */}
      <div>
        <p className="mb-4 mt-2 text-gray-400">
          Preferred Job Roles
        </p>
        
        <div className="flex flex-wrap gap-3">
            {profile.jobRoles?.length ? (
            profile.jobRoles.map((role: string) => (
         <span
            key={role}
            style={{
            backgroundColor: "rgba(139, 92, 246, 0.15)",
            border: "1px solid rgba(139, 92, 246, 0.35)",
            }}
            className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-purple-300"
            >
            <BriefcaseBusiness className="h-4 w-4" />
                {role}
            </span>
            ))
            ) : (
            <span className="text-gray-400">-</span>
            )}
        </div>
      </div>

    </div>
  );
}