"use client";

import { Timer } from "lucide-react";
import { ProfileData } from "@/types/profile";
import { NoticePeriodCardProps } from "@/types/profile";


export default function NoticePeriodCard({
  profile,
}: NoticePeriodCardProps) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[var(--card)] p-8">

      {/* Heading */}
      <div className="flex items-center gap-3">
        <Timer className="h-6 w-6 text-yellow-400" />
        <h2 className="text-xl font-bold text-white">
          Notice Period
        </h2>
      </div>

      <div className="my-6 border-t border-white/10" />

      {/* Notice Box */}
      <div className="rounded-3xl bg-[var(--background)] px-6 py-8 text-center">

        <Timer className="mx-auto h-5 w-5 text-green-400" />

        <h3 className="mt-4 text-xl font-bold text-white">
          {profile.noticePeriod || 0}
        </h3>

        <p className="mt-2 text-md text-gray-400">
          Notice Days
        </p>

      </div>

    </div>
  );
}