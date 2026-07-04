"use client";

import { useEffect, useState } from "react";
import { getSavedJobs } from "@/services/savedJobs.services";
import SavedJobsCard from "./SavedJobsCard";
import { unsaveJob } from "@/services/savedJobs.services";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function SavedJobsContainer() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { role } = useAuth();

  const handleClick = (jobType:string,jobId:string) => {
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
        return;
  }
  router.push(route);

};

  useEffect(() => {
  const fetchJobs = async () => {
    try {
      const response = await getSavedJobs();
      setJobs(response.data || []);
    } catch (err) {
      console.error(err);
    }
  };
  fetchJobs();
}, []);

const handleUnsave = async (jobId: string) => {
  try {
    await unsaveJob(jobId);

    setJobs((prev) =>
      prev.filter((item: any) => item.job._id !== jobId)
    );

    toast.success("Job removed from saved jobs");
  } catch (error) {
    toast.error("Failed to unsave job");
  }
};


  return (

<div className="p-6">
  <div className="mb-8">
    <h1 className="text-2xl font-bold tracking-tight text-white">
      Saved Jobs
    </h1>

    <p className="mt-2 text-slate-400">
      Manage and revisit all your saved opportunities.
    </p>
  </div>

      {jobs.length === 0 ? (
        <p>No saved jobs found.</p>
      ) : (
        jobs.map((savedJob: any) => (
         <SavedJobsCard onClick={()=>handleClick(savedJob.job.jobType,savedJob.job._id)} key={savedJob._id} savedJob={savedJob} onUnsave={handleUnsave} />
        ))
      )}
    </div>
  );
}



