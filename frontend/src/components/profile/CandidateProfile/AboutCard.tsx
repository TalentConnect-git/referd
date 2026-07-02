"use client";

import { Mail, User, ExternalLink } from "lucide-react";
// import { ProfileData } from "@/types/profile";
import { AboutCardProps } from "@/types/profile";

export default function AboutCard({
  profile,
}: AboutCardProps) {
  return (
    <>
      {/* About */}
      <div className="rounded-3xl border border-white/10 bg-[var(--card)] p-6">
        <div className="flex items-center gap-3">
          <User className="h-6 w-6 text-yellow-400" />
          <h2 className="text-xl font-bold text-white">
            About
          </h2>
        </div>

        <div className="my-5 border-t border-white/10" />

        <p className="text-gray-300 leading-7">
          {profile.about || "-"}
        </p>
      </div>

      {/* Official Email */}
      <div className="rounded-3xl border border-white/10 bg-[var(--card)] p-5">
        <div className="flex items-center justify-between">

          <div className="flex items-center gap-4">

            <div className="rounded-2xl bg-green-500/15 p-4">
              <Mail className="h-7 w-7 text-green-400" />
            </div>

            <div>
              <p className="text-sm text-gray-400">
                Official Email
              </p>

              <p className="mt-1 text-md font-semibold text-white break-all">
                {profile.companyEmail || profile.email || "-"}
              </p>
            </div>

          </div>

          {(profile.companyEmail || profile.email) && (
            <a
              href={`mailto:${profile.companyEmail || profile.email}`}
              className="rounded-lg p-2 transition hover:bg-white/10"
            >
              <ExternalLink className="h-5 w-5 text-white" />
            </a>
          )}

        </div>
      </div>
    </>
  );
}