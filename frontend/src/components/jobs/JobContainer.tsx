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

  // Loading skeleton
  if (loading) {
    return (
      <div className="mx-4 mb-5 space-y-3 sm:mx-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="skeleton rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4"
          >
            <div className="flex gap-3">
              <div className="skeleton h-10 w-10 rounded-xl" />
              <div className="flex-1">
                <div className="skeleton mb-1.5 h-4 w-40 rounded" />
                <div className="skeleton h-3 w-24 rounded" />
              </div>
            </div>
            <div className="mt-2 flex gap-3">
              <div className="skeleton h-3 w-16 rounded" />
              <div className="skeleton h-3 w-20 rounded" />
              <div className="skeleton h-3 w-16 rounded" />
            </div>
            <div className="mt-2 border-t border-[var(--border)] pt-2">
              <div className="flex justify-between">
                <div className="skeleton h-3 w-20 rounded" />
                <div className="flex gap-2">
                  <div className="skeleton h-4 w-4 rounded" />
                  <div className="skeleton h-3 w-12 rounded" />
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

  // Empty state
  if (!visibleJobs || visibleJobs.length === 0) {
    return (
      <div className="mx-4 mb-5 sm:mx-5">
        <div className="surface-card rounded-2xl p-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-soft)]">
              <Briefcase className="h-6 w-6 text-[var(--text-muted)]" />
            </div>
            <div>
              <h3 className="text-base font-medium text-[var(--text-primary)]">
                No {type} opportunities found
              </h3>
              <p className="mt-1 text-sm text-[var(--text-muted)]">
                Check back later for new {type} opportunities
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main render
  return (
    <div className="mx-4 mb-5 space-y-3 sm:mx-5">
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
            postedBy={job.candidatePosted?.name || "Anonymous"}
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