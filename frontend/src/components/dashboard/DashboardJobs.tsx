import axiosInstance from "@/lib/axiosInstance";
import JobRow from "./JobRow";
import JobsDetailModel from "./JobsDetailModel";
import { useState } from "react";
import { CandidatePosted, Job, DashboardJobsProps } from "@/types/dashboard";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

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
  const [isHovered, setIsHovered] = useState(false);
  const [isBottomHovered, setIsBottomHovered] = useState(false);

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

  // Combine all jobs and take first 3
  const allJobsCombined = [
    ...referralJobs,
    ...internshipJobs,
    ...offCampusJobs,
  ];
  const displayJobs = allJobsCombined.slice(0, 3);
  console.log("displayJobs",allJobsCombined);
  const hasMore = allJobsCombined.length > 3;

  return (
    <div className="ml-5 h-full rounded-2xl border border-[#1e293b] bg-[#0f172a]">
      <div className="flex items-center justify-between border-b border-[#1e293b] px-5 py-5">
        <div>
          <h2 className="text-[15px] font-semibold text-white">
            Referral Jobs for you
          </h2>
        </div>

        <Link
          href={viewAllRoute}
          className="text-sm text-gray-400 hover:text-white flex items-center gap-1"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            color: isHovered ? "#ffffff" : "#94a3b8",
            transition: "color 0.2s ease-in-out",
          }}
        >
          View all
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>

      <div>
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
              <div className="px-5 py-2 border-t border-[#1e293b]">
                <Link
                  href={viewAllRoute}
                  className="text-xs text-[#64748b] hover:text-[#60a5fa] transition-colors duration-200 flex items-center gap-1"
                >
                  <span>View all jobs</span>
                  <span className="text-[10px]">→</span>
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 px-5">
            <div className="h-12 w-12 rounded-full bg-[#1e293b] flex items-center justify-center mb-3">
              <svg
                className="h-6 w-6 text-[#64748b]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <p className="text-sm text-[#64748b]">No jobs available</p>
            <p className="text-xs text-[#475569] mt-1">
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
