// components/referrals/JobDetailModal.tsx
"use client";

import { Job } from "@/types/referrals";
import { 
  X, Briefcase, MapPin, Calendar, Award, Clock, Loader2, 
  Building, TrendingUp, DollarSign, Users, CheckCircle, 
  XCircle, ExternalLink, Send, GraduationCap, Globe,
  Building2, BriefcaseBusiness, CalendarDays, Star
} from "lucide-react";

interface JobDetailModalProps {
  job: Job;
  onClose: () => void;
  onRequestReferral: (job: Job) => void;
  requestLoading: boolean;
}

// Info Card Component
const InfoCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number | undefined }) => (
  <div className="rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-4">
    <div className="flex items-center gap-2">
      {icon}
      <span className="text-xs font-medium text-[var(--text-muted)]">{label}</span>
    </div>
    <p className="mt-2 text-lg font-bold text-[var(--text-secondary)]">{value || "N/A"}</p>
  </div>
);

// Skill Badge Component
const SkillBadge = ({ skill, type }: { skill: string; type: 'required' | 'matched' | 'missing' }) => {
  const getStyles = () => {
    switch (type) {
      case 'required':
        return "border-sky-400/30 bg-sky-400/10 text-sky-300";
      case 'matched':
        return "border-[var(--primary)]/30 bg-[var(--primary-soft)]/40 text-[var(--primary)]";
      case 'missing':
        return "border-rose-400/30 bg-rose-400/10 text-rose-300";
      default:
        return "border-[var(--border)] bg-[var(--background-soft)] text-[var(--text-primary)]";
    }
  };

  return (
    <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getStyles()}`}>
      {skill}
    </span>
  );
};

export const JobDetailModal = ({
  job,
  onClose,
  onRequestReferral,
  requestLoading = false,
}: JobDetailModalProps) => {
  const requiredSkills = Array.isArray(job.requiredSkills)
    ? job.requiredSkills
    : [];

  const matchedSkills = Array.isArray(job.matchedSkills)
    ? job.matchedSkills
    : [];

  const missingSkills = Array.isArray(job.missingSkills)
    ? job.missingSkills
    : [];

  const postedDate = job.postedDate
    ? new Date(job.postedDate).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "Not available";

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 px-4 backdrop-blur-sm">
      <div className="glass-card max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[var(--radius-xl)]">
        <div className="flex items-start justify-between border-b border-[var(--border)] bg-[var(--card)] px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--primary)]">
              Job Details
            </p>

            <h2 className="mt-2 text-2xl font-bold text-[var(--text-secondary)]">
              {job.title}
            </h2>

            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-[var(--text-primary)]">
              <span className="flex items-center gap-1">
                <Building2 size={15} className="text-[var(--primary)]" />
                {job.companyName}
              </span>

              <span className="flex items-center gap-1">
                <MapPin size={15} className="text-[var(--primary)]" />
                {job.location || "Location not available"}
              </span>

              <span className="flex items-center gap-1">
                <BriefcaseBusiness size={15} className="text-[var(--primary)]" />
                {job.workMode || "Work mode not specified"}
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-[var(--border)] p-2 text-[var(--text-muted)] transition hover:border-rose-400/40 hover:bg-rose-400/10 hover:text-rose-300"
          >
            <X size={20} />
          </button>
        </div>

        <div className="max-h-[calc(92vh-180px)] overflow-y-auto bg-[var(--card)] p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <InfoCard
              icon={<Star size={16} className="text-[var(--primary)]" />}
              label="Match Score"
              value={`${job.matchScore || 0}%`}
            />

            <InfoCard
              icon={<Users size={16} className="text-[var(--primary)]" />}
              label="Alumni"
              value={`${job.alumniCount || 0} available`}
            />

            <InfoCard
              icon={
                <BriefcaseBusiness
                  size={16}
                  className="text-[var(--primary)]"
                />
              }
              label="Experience"
              value={job.experienceRequired}
            />

            <InfoCard
              icon={<CalendarDays size={16} className="text-[var(--primary)]" />}
              label="Posted"
              value={postedDate}
            />
          </div>

          <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-5">
            <h3 className="mb-3 text-base font-bold text-[var(--text-secondary)]">
              Job Description
            </h3>

            <p className="whitespace-pre-line text-sm leading-7 text-[var(--text-primary)]">
              {job.description || job.jdSnippet || "No description available."}
            </p>
          </div>

          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            <div className="rounded-2xl border border-sky-400/20 bg-sky-400/5 p-5">
              <h3 className="mb-3 text-sm font-bold text-sky-200">
                Required Skills
              </h3>

              {requiredSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {requiredSkills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} type="required" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">
                  No required skills available.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-[var(--primary)]/20 bg-[var(--primary-soft)]/40 p-5">
              <h3 className="mb-3 text-sm font-bold text-[var(--primary)]">
                Matched Skills
              </h3>

              {matchedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {matchedSkills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} type="matched" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">
                  No matched skills found.
                </p>
              )}
            </div>

            <div className="rounded-2xl border border-rose-400/20 bg-rose-400/5 p-5">
              <h3 className="mb-3 text-sm font-bold text-rose-200">
                Missing Skills
              </h3>

              {missingSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {missingSkills.map((skill) => (
                    <SkillBadge key={skill} skill={skill} type="missing" />
                  ))}
                </div>
              ) : (
                <p className="text-sm text-[var(--text-muted)]">
                  No missing skills found.
                </p>
              )}
            </div>
          </div>

          {job.scoreBreakdown && (
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-5">
              <h3 className="mb-4 text-base font-bold text-[var(--text-secondary)]">
                Score Breakdown
              </h3>

              <div className="grid gap-3 md:grid-cols-3">
                {Object.entries(job.scoreBreakdown).map(([key, value]) => (
                  <div
                    key={key}
                    className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3"
                  >
                    <p className="text-xs capitalize text-[var(--text-muted)]">
                      {key}
                    </p>
                    <p className="mt-1 text-lg font-bold text-[var(--text-secondary)]">
                      {Number(value) || 0}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--border)] bg-[var(--card)] px-6 py-4 sm:flex-row sm:justify-end">
          {job.applyUrl && (
            <a
              href={job.applyUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-strong)] px-5 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:border-[var(--primary)] hover:text-[var(--primary)]"
            >
              Apply on Company Site
              <ExternalLink size={16} />
            </a>
          )}

          <button
            onClick={() => onRequestReferral(job)}
            disabled={requestLoading}
            className="primary-gradient inline-flex items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-bold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {requestLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Requesting...
              </>
            ) : (
              "Ask for Referral"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};