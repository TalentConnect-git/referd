"use client";

import { ApplicationDetailReferralRequestProps } from "@/types/applications";
import { ExternalLink } from "lucide-react";

export default function ApplicationDetailReferralRequest({
  job,
}: ApplicationDetailReferralRequestProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#2a3a52]
        bg-gradient-to-r from-[#111827] to-[#1a2332]
        p-5
        shadow-xl
        shadow-black/20
        backdrop-blur-sm
      "
    >
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="bg-gradient-to-r from-green-500 to-emerald-600 w-1 h-6 rounded-full"></span>
        Referral Request Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* Company */}
        {job?.companyName && (
          <div className="rounded-xl bg-[#0f172a] border border-[#2a3a52] p-3.5 hover:border-blue-500/30 transition-colors">
            <p className="text-xs text-slate-400 font-medium">Company</p>
            <p className="text-sm font-semibold text-white mt-1">
              {job.companyName}
            </p>
          </div>
        )}

        {/* Job Type */}
        {job?.jobType && (
          <div className="rounded-xl bg-[#0f172a] border border-[#2a3a52] p-3.5 hover:border-green-500/30 transition-colors">
            <p className="text-xs text-slate-400 font-medium">Job Type</p>
            <p className="text-sm font-semibold text-white mt-1">
              {job.jobType}
            </p>
          </div>
        )}

        {/* Job Title */}
        {job?.jobTitle?.[0] && (
          <div className="rounded-xl bg-[#0f172a] border border-[#2a3a52] p-3.5 hover:border-purple-500/30 transition-colors">
            <p className="text-xs text-slate-400 font-medium">Job Title</p>
            <p className="text-sm font-semibold text-white mt-1 truncate">
              {job.jobTitle[0]}
            </p>
          </div>
        )}

        {/* Looking For */}
        {job?.lookingFor && (
          <div className="rounded-xl bg-[#0f172a] border border-[#2a3a52] p-3.5 hover:border-orange-500/30 transition-colors">
            <p className="text-xs text-slate-400 font-medium">Looking For</p>
            <p className="text-sm font-semibold text-white mt-1">
              {job.lookingFor}
            </p>
          </div>
        )}

        {/* Posted By */}
        {job?.candidatePosted?.name && (
          <div className="rounded-xl bg-[#0f172a] border border-[#2a3a52] p-3.5 hover:border-pink-500/30 transition-colors">
            <p className="text-xs text-slate-400 font-medium">Posted By</p>
            <p className="text-sm font-semibold text-white mt-1">
              {job.candidatePosted.name}
            </p>
          </div>
        )}

        {/* Current Company */}
        {job?.candidatePosted?.currentCompany && (
          <div className="rounded-xl bg-[#0f172a] border border-[#2a3a52] p-3.5 hover:border-cyan-500/30 transition-colors">
            <p className="text-xs text-slate-400 font-medium">Current Company</p>
            <p className="text-sm font-semibold text-white mt-1">
              {job.candidatePosted.currentCompany}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      {job?.description && (
        <div className="mt-4 rounded-xl bg-[#0f172a] border border-[#2a3a52] p-4 hover:border-blue-500/30 transition-colors">
          <p className="text-xs text-slate-400 font-medium flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
            Description
          </p>
          <p className="text-sm text-slate-300 mt-1.5 leading-relaxed">
            {job.description}
          </p>
        </div>
      )}

      {/* Career Page Link */}
      {job?.careerPageUrl && (
        <div className="mt-4">
          <a
            href={job.careerPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              gap-2
              px-3.5
              py-2
              rounded-lg
              border
              border-green-500/30
              text-green-400
              bg-green-500/5
              text-xs
              font-semibold
              transition-all
              hover:bg-green-500/20
              hover:border-green-500/50
              hover:scale-105
              active:scale-95
            "
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Career Page
          </a>
        </div>
      )}
    </div>
  );
}