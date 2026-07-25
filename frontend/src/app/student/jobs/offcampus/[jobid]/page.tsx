"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import JobsTabs from "@/components/jobs/JobTabs";

import { getJobById } from "@/services/job.service";
import JobDetailPage from "@/components/jobs/JobDetailPage";

export default function JobDetailsRoutePage() {
  const params = useParams();
  console.log("Params ",params);

  const [job, setJob] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const jobId = params.jobid as string;
  console.log("Job id ",jobId);

  useEffect(() => {
    if (jobId) {
      fetchJob();
    }
  }, [jobId]);

  async function fetchJob() {
    try {
      setLoading(true);
        console.log("Fetching job:", jobId);
      const response = await getJobById(jobId);
        console.log("API Response:", response);
      setJob(response.data || null);
    } catch (error) {
      console.error("Failed to fetch job details:", error);
      setJob(null);
    } finally {
        console.log("Finished fetch");
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <>
        <JobsTabs />
        <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
          <div className="text-center">
            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            <p className="text-sm text-muted">Loading job details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!job) {
    return (
      <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-danger-soft border border-danger/30">
            <svg className="h-8 w-8 text-danger" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-primary">Job Not Found</h3>
          <p className="text-sm text-muted">The job you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return( 
    <>
      <JobDetailPage job={job} />
    </>
  );
}