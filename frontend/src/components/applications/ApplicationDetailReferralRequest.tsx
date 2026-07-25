"use client";

import { ApplicationDetailReferralRequestProps } from "@/types/applications";
import { ExternalLink, Building2, Briefcase, Tag, User, Building, FileText } from "lucide-react";

export default function ApplicationDetailReferralRequest({
  job,
}: ApplicationDetailReferralRequestProps) {
  return (
    <div className="surface-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg backdrop-blur-sm">
      <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-[var(--text-primary)]">
        <span className="h-6 w-1 rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]"></span>
        Referral Request Details
      </h2>

      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        {/* Company */}
        {job?.companyName && (
          <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-3.5 transition-colors hover:border-[var(--info-border)]">
            <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
              <Building2 className="h-3.5 w-3.5" />
              Company
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              {job.companyName}
            </p>
          </div>
        )}

        {/* Job Type */}
        {job?.jobType && (
          <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-3.5 transition-colors hover:border-[var(--success-border)]">
            <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
              <Tag className="h-3.5 w-3.5" />
              Job Type
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              {job.jobType}
            </p>
          </div>
        )}

        {/* Job Title */}
        {job?.jobTitle?.[0] && (
          <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-3.5 transition-colors hover:border-[var(--primary-border)]">
            <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
              <Briefcase className="h-3.5 w-3.5" />
              Job Title
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-[var(--text-primary)]">
              {job.jobTitle[0]}
            </p>
          </div>
        )}

        {/* Looking For */}
        {job?.lookingFor && (
          <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-3.5 transition-colors hover:border-[var(--warning-border)]">
            <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
              <User className="h-3.5 w-3.5" />
              Looking For
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              {job.lookingFor}
            </p>
          </div>
        )}

        {/* Posted By */}
        {job?.candidatePosted?.name && (
          <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-3.5 transition-colors hover:border-[var(--info-border)]">
            <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
              <User className="h-3.5 w-3.5" />
              Posted By
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              {job.candidatePosted.name}
            </p>
          </div>
        )}

        {/* Current Company */}
        {job?.candidatePosted?.currentCompany && (
          <div className="surface-card rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-3.5 transition-colors hover:border-[var(--success-border)]">
            <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--text-muted)]">
              <Building className="h-3.5 w-3.5" />
              Current Company
            </p>
            <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
              {job.candidatePosted.currentCompany}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      {job?.description && (
        <div className="mt-4 rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-4 transition-colors hover:border-[var(--info-border)]">
          <p className="flex items-center gap-2 text-xs font-medium text-[var(--text-muted)]">
            <FileText className="h-3.5 w-3.5" />
            Description
          </p>
          <p className="mt-1.5 text-sm leading-relaxed text-[var(--text-secondary)]">
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
            className="btn-primary inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Career Page
          </a>
        </div>
      )}
    </div>
  );
}