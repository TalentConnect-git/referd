import { RightPanelProps } from "@/types/dashboard";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  ChevronRight,
  Target,
  Users,
} from "lucide-react";

export default function RightPanel({ allJobs, onSelectJob }: RightPanelProps) {
  return (
    <div className="sticky top-0 h-[calc(100vh-80px)] w-full overflow-y-auto border-t border-[var(--border)] bg-[var(--card)] p-4 lg:w-[28%] lg:border-l lg:border-t-0">
      {/* Header */}
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
          <Briefcase className="h-4 w-4 text-[var(--primary)]" />
          Other Jobs
        </h3>
        <p className="mt-0.5 text-[11px] text-[var(--text-muted)]">
          {allJobs.length} opportunity{allJobs.length !== 1 ? "s" : ""}{" "}
          available
        </p>
      </div>

      {/* Job List */}
      {allJobs.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center text-center">
          <Briefcase className="mb-2 h-8 w-8 text-[var(--text-muted)]" />
          <p className="text-sm text-[var(--text-secondary)]">No jobs available</p>
          <p className="text-[11px] text-[var(--text-muted)]">
            Check back later for new opportunities
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {allJobs.map((job) => {
            const jobTitle =
              job.jobTitle?.[0] || job.jobRoles?.[0] || "Untitled Job";
            const companyName =
              job.candidatePosted?.currentCompany ||
              job.receiverProfile?.currentCompany_display ||
              "";
            const location =
              job.location?.[0] || job.workLocation?.[0] || "";
            const employmentType = job.employmentType?.[0] || "";
            const matchScore = job.matchScore || 0;

            return (
              <div
                key={job._id}
                className="surface-card group rounded-lg p-3 transition-all duration-200 hover:border-[var(--primary-border)] hover:shadow-sm cursor-pointer"
                onClick={() => onSelectJob(job)}
              >
                {/* Job Title - Always show */}
                <h4 className="truncate text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
                  {jobTitle}
                </h4>

                {/* Company - Only show if exists */}
                {companyName && (
                  <div className="mt-1 flex items-center gap-1">
                    <Building2 className="h-3 w-3 flex-shrink-0 text-[var(--text-muted)]" />
                    <p className="truncate text-[11px] text-[var(--text-secondary)]">
                      {companyName}
                    </p>
                  </div>
                )}

                {/* Location - Only show if exists */}
                {location && (
                  <div className="mt-0.5 flex items-center gap-1">
                    <MapPin className="h-3 w-3 flex-shrink-0 text-[var(--text-muted)]" />
                    <p className="truncate text-[10px] text-[var(--text-muted)]">
                      {location}
                    </p>
                  </div>
                )}

                {/* Tags & Match Score */}
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {/* Employment Type Tag - Only show if exists */}
                    {employmentType && (
                      <span className="badge badge-info rounded-full px-2 py-0.5 text-[9px] font-medium">
                        {employmentType}
                      </span>
                    )}
                    
                    {/* Match Score - Only show if > 0 */}
                    {matchScore > 0 && (
                      <span className={`badge rounded-full px-1.5 py-0.5 text-[9px] font-medium ${
                        matchScore >= 75 ? 'badge-success' :
                        matchScore >= 40 ? 'badge-warning' :
                        'badge-danger'
                      }`}>
                        {matchScore}% Match
                      </span>
                    )}
                  </div>

                  {/* View Details Arrow */}
                  <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)] transition-all duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--primary)]" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}