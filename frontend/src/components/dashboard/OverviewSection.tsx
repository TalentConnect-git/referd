import { OverviewSectionProps } from "@/types/dashboard";
import { applyJob } from "@/services/job.service";
import PostedByReferrer from "./PostedByReferrer";
import AlumniWhoCanHelp from "./AlumniWhoCanHelp";
import { Briefcase, MapPin, Clock, DollarSign, GraduationCap, Building2 } from "lucide-react";

export default function OverviewSection({ job }: OverviewSectionProps) {
  console.log("Received Job ", job);

  return (
    <div className="space-y-4">
      {/* Job Details */}
      <div className="surface-card rounded-xl p-4">
        <h3 className="mb-4 text-sm font-semibold text-[var(--text-primary)]">
          Job Details
        </h3>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--info)]">
              Job Role
            </p>
            <p className="mt-0.5 text-sm text-[var(--text-primary)]">
              {job.jobTitle || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--info)]">
              Employment Type
            </p>
            <p className="mt-0.5 text-sm text-[var(--text-primary)]">
              {job.employmentType?.[0] || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--info)]">
              Work Location
            </p>
            <p className="mt-0.5 text-sm text-[var(--text-primary)]">
              {job.location?.[0] || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--info)]">
              Work Mode
            </p>
            <p className="mt-0.5 text-sm text-[var(--text-primary)]">
              {job.workMode?.[0] || "N/A"}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--info)]">
              Experience Required
            </p>
            <p className="mt-0.5 text-sm text-[var(--text-primary)]">
              {job.internshipDuration || job.yearsOfExperience || "Entry Level"}
            </p>
          </div>

          {job.jobType != "Referral" && (
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--info)]">
                CGPA Required
              </p>
              <p className="mt-0.5 text-sm text-[var(--text-primary)]">
                {job.cgpa || "N/A"}
              </p>
            </div>
          )}

          <div>
            <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--info)]">
              Package
            </p>
            <p className="mt-0.5 text-sm text-[var(--text-primary)]">
              ₹ {job.packageDetails?.totalCTC || "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="surface-card rounded-xl p-4">
        <h3 className="mb-3 text-sm font-semibold text-[var(--text-primary)]">
          Job Description
        </h3>
        <p className="text-sm leading-7 text-[var(--text-secondary)]">
          {job.description || "No description provided"}
        </p>
      </div>

      {/* Posted By Referrer */}
      {job.candidatePosted && (
        <div className="surface-card rounded-xl p-4">
          <PostedByReferrer candidateId={job.candidatePosted.userId} />
        </div>
      )}

      {/* Alumni Who Can Help */}
      <div className="surface-card rounded-xl p-4">
        <AlumniWhoCanHelp job={job} />
      </div>
    </div>
  );
}