"use client";

import JobRow from "./JobRow";
import JobDetailsModal from "./JobsDetailModel";
import { useState } from "react";

type CandidatePosted = {
  _id?: string;
  name?: string;
  email?: string;
  currentCompany?: string;
  userId?: string;
};

type Job = {
  _id?: string;
  id?: string;

  jobTitle?: string | string[];
  title?: string;
  jobRoles?: string[];

  companyName?: string;
  currentCompany?: string;
  company?: string;

  location?: string | string[];
  workLocation?: string[];

  jobType?: string;
  employmentType?: string[];
  workMode?: string[];

  matchScore?: number;
  candidatePosted?: CandidatePosted;
};

interface DashboardJobsProps {
  referralJobs: Job[];
  internshipJobs: Job[];
  offCampusJobs: Job[];
  allJobs: Job[];
}

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

  console.log("DASHBOARD JOBS Referral Jobs:", referralJobs);
console.log("Internship Jobs:", internshipJobs);
console.log("OffCampus Jobs:", offCampusJobs);
console.log("All Jobs:", allJobs);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [open, setOpen] = useState(false);

  const renderJobs = (jobs: Job[]) =>
    jobs.map((job, index) => {
      const title =
        getFirstValue(job.jobTitle) ||
        job.jobRoles?.[0] ||
        job.title ||
        "Untitled Job";

      const company =
        job.companyName ||
        job.candidatePosted?.currentCompany ||
        job.currentCompany ||
        job.company ||
        "Company";

      const location =
        getFirstValue(job.location) ||
        getFirstValue(job.workLocation) ||
        "Not specified";

      const referredBy = job.candidatePosted?.name || "Alumni";

      const matchScore = job.matchScore ?? 0;

      const logoLetter = company.charAt(0).toUpperCase();

      return (
        <JobRow
          key={job._id || job.id || index}
          id={job._id || job.id || ""}
          logoLetter={logoLetter}
          title={title}
          company={company}
          location={location}
          referredBy={referredBy}
          matchScore={matchScore}
          onClick={() => {
            setSelectedJob(job);
            setOpen(true);
          }}
        />
      );
    });

  return (
    <div className="ml-5 min-h-[500px] rounded-2xl border border-[#1e293b] bg-[#0f172a]">
      <div className="flex items-center justify-between border-b border-[#1e293b] px-5 py-5">
        <div>
          <h2 className="text-[15px] font-semibold text-white">
            Jobs for you
          </h2>

          <p className="mt-1 text-sm text-[#bfdbfe]">
            Ranked by our matching engine
          </p>
        </div>

        <button className="text-sm text-gray-400 hover:text-white">
          View all →
        </button>
      </div>

      <div>
        {/* Referral Jobs */}
        {referralJobs.length > 0 && (
          <>
            <div className="border-b border-[#1e293b] px-5 py-3">
              <h3 className="text-lg font-semibold text-blue-400">
                Referral Jobs ({referralJobs.length})
              </h3>
            </div>

            {renderJobs(referralJobs)}
          </>
        )}

        {/* Internship Jobs */}
        {internshipJobs.length > 0 && (
          <>
            <div className="border-y border-[#1e293b] px-5 py-3">
              <h3 className="text-lg font-semibold text-green-400">
                Internship Jobs ({internshipJobs.length})
              </h3>
            </div>

            {renderJobs(internshipJobs)}
          </>
        )}

        {/* Off Campus Jobs */}
        {offCampusJobs.length > 0 && (
          <>
            <div className="border-y border-[#1e293b] px-5 py-3">
              <h3 className="text-lg font-semibold text-purple-400">
                Off Campus Jobs ({offCampusJobs.length})
              </h3>
            </div>

            {renderJobs(offCampusJobs)}
          </>
        )}

        {allJobs.length === 0 && (
          <p className="p-5 text-sm text-gray-400">
            No jobs found
          </p>
        )}
      </div>

      <JobDetailsModal
        open={open}
        onClose={() => setOpen(false)}
        job={selectedJob}
        allJobs={allJobs}
        onSelectJob={(job) => {
          setSelectedJob(job);
        }}
      />
    </div>
  );
}