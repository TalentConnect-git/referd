"use client";

import { useEffect, useState } from "react";
import { getSavedJobs } from "@/services/savedJobs.services";
import SavedJobsCard from "./SavedJobsCard";
import { unsaveJob } from "@/services/savedJobs.services";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bookmark, Briefcase, Loader2 } from "lucide-react";

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

  // Loading State
  if (loading) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <div className="h-8 w-48 bg-background-soft/50 rounded animate-pulse" />
          <div className="mt-2 h-4 w-64 bg-background-soft/50 rounded animate-pulse" />
        </div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="card rounded-2xl border border-theme bg-card p-4 animate-pulse"
            >
              <div className="flex gap-3">
                <div className="h-10 w-10 rounded-xl bg-background-soft/50" />
                <div className="flex-1">
                  <div className="h-4 w-40 bg-background-soft/50 rounded mb-1.5" />
                  <div className="h-3 w-24 bg-background-soft/50 rounded" />
                </div>
              </div>
              <div className="mt-2 flex gap-3">
                <div className="h-3 w-16 bg-background-soft/50 rounded" />
                <div className="h-3 w-20 bg-background-soft/50 rounded" />
              </div>
              <div className="mt-2 pt-2 border-t border-divider">
                <div className="flex justify-between">
                  <div className="h-3 w-20 bg-background-soft/50 rounded" />
                  <div className="flex gap-2">
                    <div className="h-8 w-20 bg-background-soft/50 rounded" />
                    <div className="h-3 w-12 bg-background-soft/50 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Saved Jobs
          </h1>
          <p className="mt-2 text-muted">
            Manage and revisit all your saved opportunities.
          </p>
        </div>
        <div className="card rounded-2xl border border-danger/20 bg-danger-soft p-8 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-danger-soft flex items-center justify-center">
              <Briefcase className="h-6 w-6 text-danger" />
            </div>
            <div>
              <h3 className="text-base font-medium text-primary">
                Failed to load saved jobs
              </h3>
              <p className="text-sm text-muted mt-1">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="btn-primary mt-4 px-4 py-2 bg-primary-soft text-primary rounded-lg hover:bg-primary-soft transition-colors text-sm font-medium"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Empty State
  if (jobs.length === 0) {
    return (
      <div className="p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Saved Jobs
          </h1>
          <p className="mt-2 text-muted">
            Manage and revisit all your saved opportunities.
          </p>
        </div>
        <div className="card rounded-2xl border border-theme bg-card p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-background-soft flex items-center justify-center">
              <Bookmark className="h-8 w-8 text-muted" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-primary">
                No saved jobs yet
              </h3>
              <p className="text-sm text-muted mt-1 max-w-sm">
                Start saving jobs you're interested in and they'll appear here.
              </p>
            </div>
            <button
              onClick={() => router.push(`/${role}/jobs/offcampus`)}
              className="btn-primary mt-2 px-6 py-2 bg-primary text-inverse text-sm font-medium rounded-lg hover:bg-primary-hover transition-colors"
            >
              Browse Jobs
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main Render
  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">
              Saved Jobs
            </h1>
            <p className="mt-1 text-sm text-muted">
              {jobs.length} job{jobs.length > 1 ? 's' : ''} saved
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="badge text-xs text-muted bg-background-soft px-3 py-1 rounded-full">
              {jobs.length} saved
            </span>
          </div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
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