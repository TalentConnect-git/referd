"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import PostedByReferrer from "@/components/dashboard/PostedByReferrer";
import { ArrowLeft, Building2, Calendar, User, Briefcase, Clock, MapPin, Mail, Phone, Award, Target } from "lucide-react";
import { getApplicationDetails } from "@/services/application.service";
import ApplicationTimeline from "@/components/applications/ApplicationTimeline";

export default function ApplicationDetailsPage() {
  const { applicationid } = useParams();
  console.log("Params ", useParams());
  const router = useRouter();

  const [application, setApplication] = useState<any>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getApplicationDetails(applicationid as string);
        let data = res.data;
        setApplication(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchDetails();
  }, [applicationid]);

  if (!application) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className="surface-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 text-center">
          <div className="flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-3 border-[var(--info-border)] border-t-[var(--info)]"></div>
            <span className="ml-3 text-sm text-[var(--text-muted)]">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Get job details
  const jobDetails = application.job || application.jobDetails || {};
  const receiverProfile = jobDetails.receiverProfile || {};
  
  // Get status color using theme variables
  const getStatusColor = (status: string) => {
    const statusColors: Record<string, string> = {
      "Applied": "text-[var(--info)] border-[var(--info-border)] bg-[var(--info-soft)]",
      "Application Sent": "text-[var(--info)] border-[var(--info-border)] bg-[var(--info-soft)]",
      "Awaiting Recruiter Action": "text-[var(--warning)] border-[var(--warning-border)] bg-[var(--warning-soft)]",
      "Shortlisted": "text-[var(--primary)] border-[var(--primary-border)] bg-[var(--primary-soft)]",
      "Interview Scheduled": "text-[var(--info)] border-[var(--info-border)] bg-[var(--info-soft)]",
      "Offer Extended": "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]",
      "Accepted": "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]",
      "Rejected": "text-[var(--danger)] border-[var(--danger-border)] bg-[var(--danger-soft)]",
      "Referred To Company": "text-[var(--primary)] border-[var(--primary-border)] bg-[var(--primary-soft)]",
      "Offer Accepted": "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]",
      "Offer Rejected": "text-[var(--danger)] border-[var(--danger-border)] bg-[var(--danger-soft)]",
      "Joined The Company": "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]",
    };
    return statusColors[status] || "text-[var(--text-muted)] border-[var(--border)] bg-[var(--background-soft)]";
  };

  return (
    <div className="mx-auto max-w-5xl px-3 py-4 sm:px-4 sm:py-6">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="group mb-4 flex items-center gap-1.5 text-[var(--text-muted)] transition-all duration-200 hover:text-[var(--text-primary)]"
      >
        <ArrowLeft size={16} className="transition-transform duration-200 group-hover:-translate-x-1" />
        <span className="text-xs font-medium">Back</span>
      </button>

      {/* Main Header Card */}
      <div className="surface-card mb-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg sm:p-6">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 flex-1">
            {/* Job Title & Company */}
            <div className="mb-1.5 flex flex-wrap items-center gap-2">
              <h1 className="truncate text-xl font-bold text-[var(--text-primary)] sm:text-2xl">
                {jobDetails?.jobTitle?.[0] || "Application"}
              </h1>
              {application.jobType && (
                <span className={`badge flex-shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-medium ${
                  application.jobType === "Referral" 
                    ? "badge-primary" 
                    : "badge-info"
                }`}>
                  {application.jobType}
                </span>
              )}
            </div>

            {/* Company & Location */}
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--text-muted)]">
              <div className="flex items-center gap-1.5">
                <Building2 size={14} className="text-[var(--text-muted)]" />
                <span>{jobDetails?.companyName || "Company"}</span>
              </div>
              {jobDetails?.location && jobDetails.location.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <MapPin size={13} className="text-[var(--text-muted)]" />
                  <span className="text-xs">{jobDetails.location.join(", ")}</span>
                </div>
              )}
            </div>

            {/* Job Details Grid - Compact */}
            <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
              <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                <Calendar size={13} className="text-[var(--text-muted)]" />
                <span>Applied {new Date(application.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
                })}</span>
              </div>

              {application.matchScore > 0 && (
                <div className="flex items-center gap-1.5">
                  <Target size={13} className="text-[var(--text-muted)]" />
                  <span className="text-[var(--text-muted)]">Match:</span>
                  <span className={`text-xs font-semibold ${
                    application.matchScore >= 75 ? "text-[var(--success)]" :
                    application.matchScore >= 40 ? "text-[var(--warning)]" :
                    "text-[var(--danger)]"
                  }`}>
                    {application.matchScore}%
                  </span>
                  <div className="h-1 w-12 overflow-hidden rounded-full bg-[var(--border)]">
                    <div
                      className={`h-full rounded-full ${
                        application.matchScore >= 75 ? "bg-[var(--success)]" :
                        application.matchScore >= 40 ? "bg-[var(--warning)]" :
                        "bg-[var(--danger)]"
                      }`}
                      style={{ width: `${Math.min(application.matchScore, 100)}%` }}
                    />
                  </div>
                </div>
              )}

              {application?.job?.candidatePosted?.name && (
                <div className="flex items-center gap-1.5 text-[var(--text-muted)]">
                  <User size={13} className="text-[var(--text-muted)]" />
                  <span>Referrer: <span className="text-xs font-medium text-[var(--text-primary)]">{application.job.candidatePosted.name}</span></span>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge - Compact */}
          <div className="flex-shrink-0">
            <div className={`badge rounded-full border px-3 py-1.5 text-[11px] font-medium ${getStatusColor(application.currentStatus)}`}>
              {application.currentStatus}
            </div>
          </div>
        </div>

        {/* Posted By Referrer Section - Compact */}
        {application.job?.receiverProfile && (
          <div className="mt-4 rounded-xl transition-colors duration-300 hover:border-[var(--border-strong)]">
            <div className="mb-2 flex items-center gap-2 text-xs text-[var(--text-muted)]">
              <User size={12} className="text-[var(--text-muted)]" />
              <span className="font-medium">Referrer Details</span>
            </div>
            <PostedByReferrer candidateId={application.job.receiverProfile.userId} />
          </div>
        )}
      </div>

      {/* Timeline Section - Full Width */}
      <div className="surface-card mb-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg sm:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
            <Clock size={15} className="text-[var(--text-muted)]" />
            Progress Timeline
          </h2>
          {application.statusHistory && (
            <span className="text-[10px] text-[var(--text-muted)]">
              {application.statusHistory.length} step{application.statusHistory.length > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Full width timeline */}
        <div className="w-full">
          <ApplicationTimeline
            currentStatus={application.currentStatus}
          />
        </div>
      </div>

      {/* Additional Info Sections - Compact */}
      <div className="space-y-4">
        {/* Job Description */}
        {jobDetails?.description && (
          <div className="surface-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg sm:p-6">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Briefcase size={15} className="text-[var(--text-muted)]" />
              Job Description
            </h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--text-secondary)]">
              {jobDetails.description}
            </p>
          </div>
        )}

        {/* Skills Section - Compact */}
        {jobDetails?.skills && jobDetails.skills.length > 0 && (
          <div className="surface-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg sm:p-6">
            <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--text-primary)]">
              <Award size={15} className="text-[var(--text-muted)]" />
              Required Skills
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {jobDetails.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="badge badge-info rounded-full border border-[var(--info-border)] bg-[var(--info-soft)] px-2.5 py-1 text-[11px] font-medium text-[var(--info)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Additional Info: Package & Experience */}
        {(jobDetails?.packageDetails || jobDetails?.yearsOfExperience) && (
          <div className="surface-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-lg sm:p-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {jobDetails?.packageDetails?.totalCTC && (
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Package</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">
                    {jobDetails.packageDetails.currency} {jobDetails.packageDetails.totalCTC} LPA
                  </p>
                </div>
              )}
              {jobDetails?.yearsOfExperience && (
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Experience</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{jobDetails.yearsOfExperience}</p>
                </div>
              )}
              {jobDetails?.employmentType && jobDetails.employmentType.length > 0 && (
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Employment Type</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{jobDetails.employmentType.join(", ")}</p>
                </div>
              )}
              {jobDetails?.workMode && jobDetails.workMode.length > 0 && (
                <div>
                  <p className="mb-1 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Work Mode</p>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{jobDetails.workMode.join(", ")}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}