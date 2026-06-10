import JobRow from "./JobRow";
import JobDetailsModal from "./JobsDetailModel";
import {useState} from "react";
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
  jobs: Job[];
}

function getFirstValue(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}
export default function DashboardJobs({ jobs }: DashboardJobsProps) {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [open, setOpen] = useState(false);
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
        {jobs.length > 0 ? (
          jobs.map((job, index) => {
            const title =
              getFirstValue(job.jobTitle) || job.title || "Untitled Job";

            const company =
              job.candidatePosted?.currentCompany ||
              job.companyName ||
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
                onClick={() => {setSelectedJob(job);setOpen(true);}}
              />
            );
          })
        ) : (
          <p className="p-5 text-sm text-gray-400">No jobs found</p>
        )}
      </div>
      <JobDetailsModal
  open={open}
  onClose={() => setOpen(false)}
  job={selectedJob}
  allJobs={jobs}
  onSelectJob={(job) => {
    setSelectedJob(job);
  }}
/>
    </div>
  );
}