"use client";

import { useAuth } from "@/context/AuthContext";
import JobCard from "./JobCard";
import LeftPanel from "../dashboard/LeftPannel";

interface JobContainerProps {
  jobs: any[];
  loading: boolean;
  type: "offcampus" | "referral" ;
}

export default function JobContainer({
  jobs,
  loading,
  type,
}: JobContainerProps) {

  const { profile } = useAuth();
  const role = profile?.profileType || "student";

  if (loading) {
    return <div className="ml-5">Loading...</div>;
  }

  return (
    <div className="space-y-4 ml-5 mr-5">
      {jobs.map((job) => (
        <JobCard
          key={job._id}
          title={job.jobTitle?.[0] || "Untitled Job"}
          company={
            job.receiverProfile?.currentCompany_display ||
            job.companyName ||
            "Unknown Company"
          }
          location={
            job.location?.[0] ||
            job.workLocation?.[0] ||
            "Remote"
          }
          matchScore={job.matchScore}
          postedBy={
            job.receiverProfile?.name ||
            job.candidatePosted?.name ||
            "Anonymous"
          }
          secondaryInfo={
            type === "referral"
              ? "Referral Opportunity"
              : job.employmentType?.[0]
          }
          route={`/${role}/jobs/${
            type === "referral"
            ? "referral-jobs"
            : "offcampus"
            }/${job._id}`}
          
        />
      ))}
    </div>
  );
}