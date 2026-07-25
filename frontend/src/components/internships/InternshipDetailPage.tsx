"use client";

import { ArrowLeft, Briefcase, MapPin, Building2, Calendar, Clock, Users, Bookmark, Send, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { applyJob, saveJob } from "@/services/job.service";
import { toast } from "react-hot-toast";

interface InternshipDetailPageProps {
  internship: any;
}

export default function InternshipDetailPage({
  internship,
}: InternshipDetailPageProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [applying, setApplying] = useState(false);

  const handleApply = async () => {
    try {
      setApplying(true);

      await applyJob(
        internship._id,
        internship.jobType,
        internship.matchScore || 0
      );

      toast.success("Application submitted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to apply");
    } finally {
      setApplying(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      await saveJob(
        internship._id,
        internship.jobType,
        internship.matchScore || 0
      );

      toast.success("Internship saved successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save internship");
    } finally {
      setSaving(false);
    }
  };

  // Get job role (priority: jobRoles > jobTitle)
  const jobRole = internship.jobRoles?.[0] || internship.jobTitle?.[0] || "Untitled Internship";
  
  // Get company name
  const companyName = internship.companyPosted?.companyDetails?.companyName || 
                      internship.companyName || 
                      "Unknown Company";
  
  // Get location
  const location = internship.location?.[0] || internship.workLocation?.[0] || "Remote";
  
  // Get match score
  const matchScore = internship.matchScore || 0;

  return (
    <div className="min-h-screen bg-[var(--background)] p-4 sm:p-6">
      <div className="mx-auto max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="
            group mb-4 inline-flex
            items-center gap-1.5
            text-xs text-[var(--text-muted)]
            transition-colors hover:text-[var(--text-primary)]
          "
        >
          <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
          Back
        </button>

        {/* Main Card */}
        <div className="surface-card rounded-2xl p-5 shadow-xl shadow-black/20">
          {/* Header with Action Buttons */}
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0 flex-1">
              <h1 className="text-lg font-bold tracking-tight text-[var(--text-primary)]">
                {jobRole}
              </h1>

              <div className="mt-1.5 flex items-center gap-2">
                <Building2 size={14} className="flex-shrink-0 text-[var(--text-muted)]" />
                <p className="text-sm text-[var(--text-secondary)]">
                  {companyName}
                </p>
              </div>

              <div className="mt-1 flex items-center gap-2">
                <MapPin size={14} className="flex-shrink-0 text-[var(--text-muted)]" />
                <p className="text-xs text-[var(--text-muted)]">
                  {location}
                </p>
              </div>
            </div>

            {/* Action Buttons - Top Right */}
            <div className="flex flex-col gap-2 flex-shrink-0">
              {matchScore > 0 && (
                <div
                  className={`
                    rounded-full border px-3 py-0.5 text-center
                    text-[10px] font-semibold
                    ${matchScore >= 75 ? 'badge-success border-[var(--success-border)] bg-[var(--success-soft)] text-[var(--success)]' :
                      matchScore >= 40 ? 'badge-warning border-[var(--warning-border)] bg-[var(--warning-soft)] text-[var(--warning)]' :
                      'badge-danger border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]'}
                  `}
                >
                  {matchScore}% Match
                </div>
              )}

              <button
                onClick={handleApply}
                disabled={applying}
                className="
                  btn-primary inline-flex items-center justify-center gap-1.5
                  rounded-lg px-4 py-1.5 text-xs font-semibold
                  transition-all hover:scale-105 hover:shadow-lg hover:shadow-[var(--primary)]/30
                  active:scale-95 disabled:cursor-not-allowed disabled:opacity-50
                  disabled:hover:scale-100 whitespace-nowrap
                "
              >
                {applying ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Applying...
                  </>
                ) : (
                  <>
                    <Send size={12} />
                    Apply
                  </>
                )}
              </button>

              <button
                onClick={handleSave}
                disabled={saving}
                className="
                  btn-secondary inline-flex items-center justify-center gap-1.5
                  rounded-lg px-4 py-1.5 text-xs font-semibold
                  transition-all hover:scale-105 active:scale-95
                  disabled:cursor-not-allowed disabled:opacity-50
                  disabled:hover:scale-100 whitespace-nowrap
                "
              >
                {saving ? (
                  <>
                    <svg className="h-3.5 w-3.5 animate-spin" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </>
                ) : (
                  <>
                    <Bookmark size={12} />
                    Save
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="my-4 border-t border-[var(--border)]" />

          {/* Description */}
          <section>
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[var(--info)]">
              Description
            </h2>

            <p className="text-sm leading-relaxed text-[var(--text-secondary)]">
              {internship.description || "No description available"}
            </p>
          </section>

          {/* Divider */}
          <div className="my-4 border-t border-[var(--border)]" />

          {/* Internship Details */}
          <section>
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[var(--info)]">
              Internship Details
            </h2>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Employment Type */}
              <div className="surface-card rounded-lg border border-[var(--border)] p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  Employment Type
                </p>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                  {internship.employmentType?.join(", ") || "Not specified"}
                </p>
              </div>

              {/* Work Mode */}
              <div className="surface-card rounded-lg border border-[var(--border)] p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  Work Mode
                </p>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                  {internship.workMode?.join(", ") || "Not specified"}
                </p>
              </div>

              {/* Location */}
              <div className="surface-card rounded-lg border border-[var(--border)] p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  Location
                </p>
                <p className="mt-0.5 flex items-center gap-1 text-sm text-[var(--text-secondary)]">
                  <MapPin size={12} className="text-[var(--text-muted)]" />
                  {internship.location?.join(", ") || 
                   internship.workLocation?.join(", ") || 
                   "Not specified"}
                </p>
              </div>

              {/* Posted By */}
              <div className="surface-card rounded-lg border border-[var(--border)] p-3">
                <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                  Posted By
                </p>
                <p className="mt-0.5 text-sm text-[var(--text-secondary)]">
                  {internship.companyPosted?.employerDetails?.name ||
                   internship.companyPosted?.name ||
                   "Anonymous"}
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}