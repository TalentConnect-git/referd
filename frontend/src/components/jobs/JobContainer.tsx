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
      <div className="space-y-3 ml-5 mr-5 mb-5">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4 animate-pulse"
          >
            <div className="flex gap-3">
              <div className="h-10 w-10 rounded-xl bg-gray-700/50" />
              <div className="flex-1">
                <div className="h-4 w-40 bg-gray-700/50 rounded mb-1.5" />
                <div className="h-3 w-24 bg-gray-700/50 rounded" />
              </div>
            </div>
            <div className="mt-2 flex gap-3">
              <div className="h-3 w-16 bg-gray-700/50 rounded" />
              <div className="h-3 w-20 bg-gray-700/50 rounded" />
              <div className="h-3 w-16 bg-gray-700/50 rounded" />
            </div>
            <div className="mt-2 pt-2 border-t border-[var(--border)]">
              <div className="flex justify-between">
                <div className="h-3 w-20 bg-gray-700/50 rounded" />
                <div className="flex gap-2">
                  <div className="h-4 w-4 bg-gray-700/50 rounded" />
                  <div className="h-3 w-12 bg-gray-700/50 rounded" />
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
      <div className="ml-5 mr-5 mb-5">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-10 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-zinc-800/50 flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-zinc-500" />
            </div>
            <div>
              <h3 className="text-base font-medium text-white">
                No {type} opportunities found
              </h3>
              <p className="text-sm text-zinc-400 mt-1">
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
    <div className="space-y-3 ml-5 mr-5 mb-5">
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
