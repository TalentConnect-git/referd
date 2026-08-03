"use client";

import { useEffect, useState } from "react";
import { getSavedJobs } from "@/services/savedJobs.services";
import SavedJobsCard from "./SavedJobsCard";
import { unsaveJob } from "@/services/savedJobs.services";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bookmark, Briefcase, Loader2, Sparkles } from "lucide-react";

export default function SavedJobsContainer() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { profile } = useAuth();
  const role = profile?.profileType || "student";

  const handleClick = (jobType: string, jobId: string) => {
    let route = "";
    switch (jobType) {
      case "Referral":
        route = `/${role}/jobs/referral-jobs/${jobId}`;
        break;
      case "Off-campus":
        route = `/${role}/jobs/offcampus/${jobId}`;
        break;
      case "Internship":
        route = `/${role}/internships/${jobId}`;
        break;
      default:
        route = `/${role}/jobs/offcampus/${jobId}`;
    }
    router.push(route);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getSavedJobs();
        setJobs(response.data || []);
      } catch (err: any) {
        console.error(err);
        setError(err?.message || "Failed to load saved jobs");
        toast.error("Failed to load saved jobs");
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleUnsave = async (jobId: string) => {
    try {
      await unsaveJob(jobId);
      setJobs((prev) => prev.filter((item: any) => item.job._id !== jobId));
      toast.success("Job removed from saved jobs");
    } catch (error) {
      toast.error("Failed to unsave job");
    }
  };

  // Loading State - Compact with mx-4
  if (loading) {
    return (
      <div className="mx-4 mt-2 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-5 w-32 animate-pulse rounded bg-shimmer-start" />
            <div className="mt-1 h-3.5 w-48 animate-pulse rounded bg-shimmer-start" />
          </div>
          <div className="h-7 w-16 animate-pulse rounded-full bg-shimmer-start" />
        </div>
        <div className="space-y-2.5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card rounded-xl border border-theme bg-card p-3 animate-pulse"
            >
              <div className="flex gap-2.5">
                <div className="h-8 w-8 rounded-lg bg-shimmer-start" />
                <div className="flex-1">
                  <div className="h-3.5 w-32 bg-shimmer-start rounded mb-1" />
                  <div className="h-2.5 w-20 bg-shimmer-start rounded" />
                </div>
              </div>
              <div className="mt-2 flex gap-2">
                <div className="h-2.5 w-14 bg-shimmer-start rounded" />
                <div className="h-2.5 w-16 bg-shimmer-start rounded" />
              </div>
              <div className="mt-2 pt-2 border-t border-divider">
                <div className="flex justify-between">
                  <div className="h-2.5 w-16 bg-shimmer-start rounded" />
                  <div className="flex gap-2">
                    <div className="h-6 w-16 bg-shimmer-start rounded" />
                    <div className="h-2.5 w-10 bg-shimmer-start rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State - Compact with mx-4
  if (error) {
    return (
      <div className="mx-4">
        <div className="card rounded-xl border border-danger/20 bg-danger-soft p-4 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-10 w-10 rounded-full bg-danger-soft flex items-center justify-center">
              <Briefcase className="h-5 w-5 text-danger" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary">
                Failed to load saved jobs
              </h3>
              <p className="text-xs text-muted mt-0.5">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary mt-2 px-3 py-1.5 bg-primary-soft text-primary rounded-lg hover:bg-primary-soft transition-colors text-xs font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State - Compact with mx-4
  if (jobs.length === 0) {
    return (
      <div className="mx-4 mt-3">
        <div className="card rounded-xl border border-theme bg-card-soft p-6 text-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-12 w-12 rounded-full bg-background-soft flex items-center justify-center">
              <Bookmark className="h-6 w-6 text-muted" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-primary">
                No saved jobs yet
              </h3>
              <p className="text-xs text-muted mt-0.5 max-w-sm">
                Start saving jobs you're interested in and they'll appear here.
              </p>
            </div>
            <button
              onClick={() => router.push(`/${role}/jobs/offcampus`)}
              className="btn-primary mt-2 px-4 py-1.5 text-xs font-medium rounded-lg"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Render - Compact with mx-4
  return (
    <div className="mx-4 mt-4 space-y-3">
      {/* Header - Compact like referral page */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-theme bg-card-soft/50 px-3 py-2">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-soft border border-primary/20">
            <Bookmark className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h1 className="text-sm font-semibold text-primary">
              Saved Jobs
            </h1>
            <p className="text-[10px] text-muted">
              {jobs.length} job{jobs.length > 1 ? 's' : ''} saved
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="badge badge-primary rounded-full px-2 py-0.5 text-[9px] font-medium">
            {jobs.length} saved
          </span>
        </div>
      </div>

      {/* Jobs List - Same spacing as referral page */}
      <div className="space-y-2.5">
        {jobs.map((savedJob: any) => (
          <SavedJobsCard
            key={savedJob._id}
            savedJob={savedJob}
            onUnsave={handleUnsave}
            onClick={() => handleClick(savedJob.job.jobType, savedJob.job._id)}
          />
        ))}
      </div>
    </div>
  );
}