// components/referrals/JobsSection.tsx
import React from 'react';
import { Building2, MapPin, Briefcase, Users, BadgeCheck, ExternalLink } from 'lucide-react';
import { Job } from '@/types/referrals';
import { Chip } from './Chip';

interface JobsSectionProps {
  jobs: Job[];
  onViewJob: (job: Job) => void;
}

export const JobsSection: React.FC<JobsSectionProps> = ({ jobs, onViewJob }) => {
  return (
    <div className="mt-6 rounded-[var(--radius-xl)] border border-[var(--border)] bg-[var(--card)] p-5 shadow-xl">
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-lg font-bold text-[var(--text-secondary)]">
            Referral Jobs
          </h2>
          <p className="mt-1 text-sm text-[var(--text-primary)]">
            Top matching jobs ranked by alumni count and match score.
          </p>
        </div>
        <span className="rounded-full border border-[var(--border)] bg-[var(--background-soft)] px-3 py-1 text-xs font-semibold text-[var(--text-primary)]">
          {jobs.length} jobs found
        </span>
      </div>

      <div className="space-y-4">
        {jobs.map((job, index) => (
          <div
            key={job._id || job.jobUrl || index}
            className="rounded-2xl border border-[var(--border)] bg-[var(--background-soft)] p-4 transition hover:bg-[var(--card-hover)]"
          >
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <h3 className="text-base font-bold text-[var(--text-secondary)]">
                  {job.title || "Untitled Job"}
                </h3>

                <div className="mt-2 flex flex-wrap gap-3 text-sm text-[var(--text-primary)]">
                  <span className="inline-flex items-center gap-1">
                    <Building2 size={14} />
                    {job.companyName || "Company not given"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin size={14} />
                    {job.location || "Location not given"}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Briefcase size={14} />
                    {job.department || "Department not given"}
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <Chip variant="primary">Match Score: {job.matchScore ?? 0}</Chip>
                  <Chip variant="success">
                    <Users size={13} />
                    Alumni: {job.alumniCount ?? 0}
                  </Chip>
                  {job.experienceRequired && <Chip>Experience: {job.experienceRequired}</Chip>}
                  {job.workMode && <Chip>{job.workMode}</Chip>}
                </div>

                {Array.isArray(job.matchedSkills) && job.matchedSkills.length > 0 && (
                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-[var(--text-muted)]">
                      Matched Skills
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {job.matchedSkills.map((skill) => (
                        <Chip key={skill} variant="success">
                          <BadgeCheck size={12} />
                          {skill}
                        </Chip>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => onViewJob(job)}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-black transition hover:bg-[var(--primary-dark)]"
              >
                View Job
                <ExternalLink size={15} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};