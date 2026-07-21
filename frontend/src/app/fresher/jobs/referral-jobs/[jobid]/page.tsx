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
        <p>Loading....</p>
        </>
      
    );
  }

  if (!job) {
    return (
      <div className="p-6">
        Job not found
      </div>
    );
  }

  return( 
  <>
  <JobDetailPage job={job} />
  </>
);
}


