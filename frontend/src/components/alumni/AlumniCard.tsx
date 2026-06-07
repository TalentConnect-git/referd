"use client";

import {
  Building2,
  GraduationCap,
  BriefcaseBusiness,
  Users,
  MessageSquare,
} from "lucide-react";
import type { AlumniProfile } from "@/services/alumani.services";

type AlumniCardProps = {
  profile: AlumniProfile;
  collegeFallback?: string;
  companyFallback?: string; // new prop
  onMessage?: (profile: AlumniProfile) => void;
  onRequestRefer?: (profile: AlumniProfile) => void;
};

const getInitials = (name?: string) => {
  if (!name) return "NA";
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const getCurrentRole = (profile: AlumniProfile) => {
  const currentExperience = profile.experiences?.find(
    (item) => item.isCurrent || !item.endDate,
  );
  return (
    currentExperience?.role ||
    currentExperience?.title ||
    currentExperience?.designation ||
    profile.experiences?.[0]?.role ||
    profile.experiences?.[0]?.title ||
    profile.experiences?.[0]?.designation ||
    "Professional"
  );
};

const getCompany = (profile: AlumniProfile, fallback?: string) => {
  const currentExperience = profile.experiences?.find(
    (item) => item.isCurrent || !item.endDate,
  );
  return (
    profile.currentCompany ||
    currentExperience?.company ||
    currentExperience?.companyName ||
    profile.experiences?.[0]?.company ||
    profile.experiences?.[0]?.companyName ||
    fallback ||
    "Company not available"
  );
};

export function AlumniCard({
  profile,
  collegeFallback = "",
  companyFallback = "",
  onMessage,
  onRequestRefer,
}: AlumniCardProps) {
  const name = profile.name || "Unknown User";
  const initials = getInitials(name);
  const company = getCompany(profile, companyFallback);
  const role = getCurrentRole(profile);
  const isHiring = Boolean(profile.isHiring);
  const jobsCount = profile.referralJobs?.length || 0;

  // College: use profile.colleges array first, then profile.college, then first education, then fallback
  const collegeDisplay =
    profile.colleges?.join(", ") ||
    profile.college ||
    profile.educations?.find((e) => e.college)?.college ||
    collegeFallback ||
    "College not available";

  return (
    <article className="rounded-3xl border border-[#242d3a] bg-[#111821] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.25)] transition hover:border-[#2fb344]/40">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#123321] text-base font-bold text-[#2fb344]">
            {initials}
          </div>

          <div>
            <h3 className="text-base font-bold leading-tight text-white">
              {name}
            </h3>
            <p className="mt-1 text-sm text-sky-100/80">{role}</p>
          </div>
        </div>

        {isHiring && (
          <span className="rounded-full border border-[#2fb344]/20 bg-[#123321] px-3 py-1 text-xs font-medium text-[#2fb344]">
            Hiring
          </span>
        )}
      </div>

      <div className="mt-6 space-y-2.5 text-sm text-sky-100/80">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-slate-400" />
          <span>{company}</span>
        </div>

        <div className="flex items-center gap-2">
          <GraduationCap className="h-4 w-4 text-slate-400" />
          <span>{collegeDisplay}</span>
        </div>

        <div className="flex items-center gap-2">
          <BriefcaseBusiness className="h-4 w-4 text-slate-400" />
          <span>
            {jobsCount > 0
              ? `${jobsCount} referral job${jobsCount > 1 ? "s" : ""}`
              : "No referral jobs"}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-slate-400" />
          <span>
            {profile.referralMetrics?.totalReferrals ||
              profile.referralMetrics?.totalReferralsPosted ||
              0}{" "}
            total referrals
          </span>
        </div>
      </div>

      <div className="my-5 h-px bg-white/10" />

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => onMessage?.(profile)}
          className="flex h-10 items-center justify-center gap-2 rounded-lg border border-[#263241] bg-transparent text-sm font-semibold text-white transition hover:bg-white/5"
        >
          <MessageSquare className="h-4 w-4" />
          Message
        </button>

        <button
          type="button"
          disabled={!isHiring && jobsCount === 0}
          onClick={() => onRequestRefer?.(profile)}
          className="h-10 rounded-lg bg-[#2fb344] text-sm font-semibold text-black transition hover:bg-[#35c94d] disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
        >
          Request refer
        </button>
      </div>
    </article>
  );
}