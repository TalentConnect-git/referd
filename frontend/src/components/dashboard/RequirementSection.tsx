import { RequirementSectionProps } from "@/types/dashboard";
import { GraduationCap, Briefcase, Users, Star, Sparkles, FileCheck } from "lucide-react";

export default function RequirementSection({ job }: RequirementSectionProps) {
  return (
    <div className="surface-card rounded-lg p-4">
      <h3 className="mb-3 text-base font-semibold text-[var(--text-primary)]">
        Eligibility Criteria
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--info)]">
            <GraduationCap className="h-3.5 w-3.5" />
            Minimum Education
          </p>
          <p className="mt-0.5 text-sm text-[var(--text-primary)]">
            {job.minEducation || "N/A"}
          </p>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--info)]">
            <Briefcase className="h-3.5 w-3.5" />
            Experience Level
          </p>
          <p className="mt-0.5 text-sm text-[var(--text-primary)]">
            {job.yearsOfExperience || "Entry Level"}
          </p>
        </div>

        <div>
          <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--info)]">
            <Users className="h-3.5 w-3.5" />
            Eligible Streams
          </p>
          <p className="mt-0.5 text-sm text-[var(--text-primary)]">
            {job.studentStreams?.join(", ") || "N/A"}
          </p>
        </div>

        {job.jobType !== "Referral" && (
          <div>
            <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--info)]">
              <Star className="h-3.5 w-3.5" />
              CGPA Requirement
            </p>
            <p className="mt-0.5 text-sm text-[var(--text-primary)]">
              {job.cgpa || "-"}
            </p>
          </div>
        )}

        <div className="sm:col-span-2">
          <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--info)]">
            <Sparkles className="h-3.5 w-3.5" />
            Skills Required
          </p>
          <p className="mt-0.5 text-sm text-[var(--text-primary)]">
            {job.skills?.length ? job.skills.join(", ") : "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-3 border-t border-[var(--border)] pt-3">
        <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--info)]">
          <FileCheck className="h-3.5 w-3.5" />
          Additional Criteria
        </p>
        <p className="mt-0.5 text-sm text-[var(--text-primary)]">
          {job.eligibilityCriteria || "N/A"}
        </p>
      </div>
    </div>
  );
}