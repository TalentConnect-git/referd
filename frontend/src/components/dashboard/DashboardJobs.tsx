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
    <div className="surface-card flex flex-col overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--background-soft)]/50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--info-border)] bg-[var(--info-soft)]">
            <Briefcase className="h-3.5 w-3.5 text-[var(--info)]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Referral Jobs for you
            </h2>
            
          </div>
        </div>

        {hasMore && (
          <Link
            href={viewAllRoute}
            className="group inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text-primary)]"
          >
            View All
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
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
              <div className="border-t border-[var(--border)] bg-[var(--background-soft)]/30 px-4 py-2.5">
                <Link
                  href={viewAllRoute}
                  className="group inline-flex w-full items-center justify-center gap-2 text-[11px] font-medium text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--info)]"
                >
                  <span>View all jobs</span>
                  <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
                </Link>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-soft)]">
              <Briefcase className="h-6 w-6 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">No jobs available</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
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