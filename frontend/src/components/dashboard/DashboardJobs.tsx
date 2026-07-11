import axiosInstance from "@/lib/axiosInstance";
import JobRow from "./JobRow";
import JobsDetailModel from "./JobsDetailModel";
import { useState } from "react";
import { CandidatePosted, Job, DashboardJobsProps } from "@/types/dashboard";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ChevronRight, Briefcase, ClipboardList } from "lucide-react";

function getFirstValue(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export default function DashboardJobs({
  referralJobs,
  internshipJobs,
  offCampusJobs,
  allJobs,
}: DashboardJobsProps) {
  const [selectedJob, setSelectedJob] = useState<Job>();
  const [open, setOpen] = useState(false);
  const { profile } = useAuth();
  const userType = profile?.profileType;

  const getTitle = (job: Job) =>
    getFirstValue(job.jobTitle) ||
    job.jobRoles?.[0] ||
    job.title ||
    "Untitled Job";

  const viewAllRoute =
    userType === "professional"
      ? "/professional/jobs/referral-jobs"
      : `/${userType}/jobs/offcampus`;

  const getCompany = (job: Job) =>
    job.candidatePosted?.currentCompany ||
    job.companyName ||
    job.currentCompany ||
    job.company ||
    "Company";

  const getLocation = (job: Job) =>
    getFirstValue(job.location) ||
    getFirstValue(job.workLocation) ||
    "Not specified";

  const handleJobClick = async (job: Job) => {
    try {
      console.log("Fetching details for job ID:", job._id);
      const res = await axiosInstance.get(
        `/api/student-dashboard/job/${job._id}`,
      );
      console.log("Job details:", res.data);
      setSelectedJob({ ...res.data.data, matchScore: job.matchScore });
      setOpen(true);
    } catch (err) {
      console.log(err);
    }
  };

  
  const allJobsCombined = [
    ...referralJobs,
    ...internshipJobs,
    ...offCampusJobs,
  ];
  const displayJobs = allJobsCombined.slice(0, 3);
  console.log("displayJobs", allJobsCombined);
  const hasMore = allJobsCombined.length > 3;

  const handleViewAll = () => {
    // Navigate to view all jobs
  };

  return (
    <div className="ml-5 rounded-2xl border border-slate-800 bg-[#0f172a] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0f172a]/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
            <Briefcase className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-[13px] font-semibold text-white">
              Referral Jobs for you
            </h2>
            <p className="text-[10px] text-gray-500">
              {allJobsCombined.length} jobs available
            </p>
          </div>
        </div>

        {hasMore && (
          <Link
            href={viewAllRoute}
            className="group inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-white transition-colors duration-200"
          >
            View All
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </Link>
        )}
      </div>

      {/* Jobs List */}
      <div className="flex-1">
        {displayJobs.length > 0 ? (
          <>
            {displayJobs.map((job, index) => (
              <JobRow
                key={job._id || index}
                id={job._id || ""}
                logoLetter={getCompany(job).charAt(0).toUpperCase()}
                title={getTitle(job)}
                company={getCompany(job)}
                location={getLocation(job)}
                referredBy={job.candidatePosted?.name || "Alumni"}
                matchScore={job.matchScore ?? 0}
                onClick={() => handleJobClick(job)}
                jobType="Referral"
                workMode={job.workMode}
              />
            ))}

            {/* Bottom View All Button */}
            {hasMore && (
              <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-800/10">
                <Link
                  href={viewAllRoute}
                  className="w-full inline-flex items-center justify-center gap-2 text-[11px] font-medium text-gray-400 hover:text-blue-400 transition-colors duration-200 group"
                >
                  <span>View all {allJobsCombined.length} jobs</span>
                  <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-5">
            <div className="h-12 w-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
              <Briefcase className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-sm text-gray-400">No jobs available</p>
            <p className="text-xs text-gray-500 mt-1">
              Check back later for new opportunities
            </p>
          </div>
        )}

        {selectedJob && (
          <JobsDetailModel
            open={open}
            onClose={() => setOpen(false)}
            job={selectedJob}
            allJobs={allJobs}
            onSelectJob={setSelectedJob}
          />
        )}
      </div>
    </div>
  );
}