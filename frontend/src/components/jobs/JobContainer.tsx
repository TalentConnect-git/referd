"use client";

import { useAuth } from "@/context/AuthContext";
import JobCard from "./JobCard";
import { useState, useEffect } from "react";
import { Briefcase } from "lucide-react";

interface JobContainerProps {
  jobs: any[];
  loading: boolean;
  type: "offcampus" | "referral";
  onJobRemove?: (jobId: string) => void; // Optional callback for parent
}

export default function JobContainer({
  jobs,
  loading,
  type,
  onJobRemove,
}: JobContainerProps) {
  const { profile } = useAuth();
  const role = profile?.profileType || "student";
  const [savedJobs, setSavedJobs] = useState<Record<string, boolean>>({});
  const [removingJobIds, setRemovingJobIds] = useState<Set<string>>(new Set());
  const [localJobs, setLocalJobs] = useState<any[]>(jobs);

  // Update local jobs when prop changes
  useEffect(() => {
    setLocalJobs(jobs);
  }, [jobs]);

  console.log("job received ******** ", jobs?.[0]);

  // Handle save toggle from child component
  const handleSaveToggle = (jobId: string, isSaved: boolean) => {
    setSavedJobs((prev) => ({
      ...prev,
      [jobId]: isSaved,
    }));
  };

  // Handle job removal from the list
  const handleJobRemove = (jobId: string) => {
    // Add to removing set for animation
    setRemovingJobIds((prev) => new Set(prev).add(jobId));

    // Remove from local jobs after animation
    setTimeout(() => {
      setLocalJobs((prev) => prev.filter((job) => job._id !== jobId));
      setRemovingJobIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });

      // Notify parent if callback provided
      if (onJobRemove) {
        onJobRemove(jobId);
      }
    }, 300); // Match the animation duration in JobCard
  };

  // Check if a job is saved (from state or from job data)
  const isJobSaved = (job: any) => {
    // First check local state
    if (savedJobs[job._id] !== undefined) {
      return savedJobs[job._id];
    }
    // Then check job data
    return job?.isSaved || job?.saved || false;
  };

  // Check if job is currently being removed
  const isJobRemoving = (jobId: string) => {
    return removingJobIds.has(jobId);
  };

  // Loading skeleton - Reduced size
  if (loading) {
    return (
      <div className="space-y-2.5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="card rounded-xl border border-theme bg-card p-3 animate-pulse"
          >
            <div className="flex gap-2.5">
              <div className="h-8 w-8 rounded-lg bg-shimmer-start" />
              <div className="flex-1">
                <div className="mb-1 h-3.5 w-32 rounded bg-shimmer-start" />
                <div className="h-2.5 w-20 rounded bg-shimmer-start" />
              </div>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <div className="h-2.5 w-14 rounded bg-shimmer-start" />
              <div className="h-2.5 w-16 rounded bg-shimmer-start" />
              <div className="h-2.5 w-14 rounded bg-shimmer-start" />
            </div>
            <div className="mt-2 border-t border-divider pt-2">
              <div className="flex justify-between">
                <div className="h-2.5 w-16 rounded bg-shimmer-start" />
                <div className="flex gap-2">
                  <div className="h-3.5 w-3.5 rounded bg-shimmer-start" />
                  <div className="h-2.5 w-10 rounded bg-shimmer-start" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Filter out jobs that are being removed
  const visibleJobs = localJobs.filter((job) => !removingJobIds.has(job._id));

  // Empty state - Reduced size
  if (!visibleJobs || visibleJobs.length === 0) {
    return (
      <div className="card rounded-xl border border-theme bg-card-soft p-6 text-center">
        <div className="flex flex-col items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-background-soft">
            <Briefcase className="h-5 w-5 text-muted" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-primary">
              No {type} opportunities found
            </h3>
            <p className="mt-0.5 text-xs text-muted">
              Check back later for new {type} opportunities
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Main render - No margins, smaller spacing
  return (
    <div className="space-y-2.5">
      {visibleJobs.map((job) => {
        // Determine job type for saving
        const jobType = type === "referral" ? "referral" : "offcampus";
        const isSaved = isJobSaved(job);
        const isRemoving = isJobRemoving(job._id);

        // Extract package details from job data
        const packageDetails = job?.packageDetails || job?.package || null;

        return (
          <JobCard
            key={job._id}
            title={job.jobTitle?.[0] || "Untitled Job"}
            company={
              job.receiverProfile?.currentCompany_display ||
              job.candidatePosted?.currentCompany ||
              job.companyName ||
              "Unknown Company"
            }
            location={
              job.location?.[0] || job.workLocation?.[0] || job.city || "Remote"
            }
            matchScore={job.matchScore}
            postedBy={job.candidatePosted?.name || job.employerDetails?.name || "Anonymous"}
            secondaryInfo={
              type === "referral"
                ? "Referral"
                : job.employmentType?.[0] || job.jobType
            }
            workMode={job.workMode?.[0] || job.workType || "On-site"}
            route={`/${role}/jobs/${
              type === "referral" ? "referral-jobs" : "offcampus"
            }/${job._id}`}
            jobId={job._id}
            jobType={jobType}
            isSaved={isSaved}
            onSaveToggle={handleSaveToggle}
            onRemove={handleJobRemove}
            isRemoving={isRemoving}
            packageDetails={packageDetails}
            alumniCount={job.alumniCount}
          />
        );
      })}
    </div>
  );
}