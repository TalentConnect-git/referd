"use client";

import { BriefcaseBusiness } from "lucide-react";
import { ProfileData } from "@/types/profile";
import { PersonalInfoProps } from "@/types/profile";
export default function PersonalInformation({
  profile,
}: PersonalInfoProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--card)] p-8">

      {/* Heading */}
      <div className="flex items-center gap-3">
        <BriefcaseBusiness className="h-6 w-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">
          Personal Information
        </h2>
      </div>

      <div className="my-6 border-t border-white/10" />

      <div className="space-y-5">

        <div>
          <p className="text-gray-400">Phone</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {profile.phone || "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Ethnicity</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {profile.ethnicity || "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Visa Status</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {profile.visaStatus||"-"}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Gender</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {profile.gender || "-"}
          </p>
        </div>

        <div>
          <p className="text-gray-400">D.O.B</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {profile.dob||"-"}
          </p>
        </div>

        <div>
          <p className="text-gray-400">Marital Status</p>
          <p className="mt-1 text-lg font-semibold text-white">
            {profile.maritalStatus||"-"}
          </p>
        </div>

      </div>
    </div>
  );
}