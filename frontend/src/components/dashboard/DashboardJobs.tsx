import axiosInstance from "@/lib/axiosInstance";
import JobRow from "./JobRow";
import JobsDetailModel from "./JobsDetailModel";
import { useState } from "react";
import { CandidatePosted,Job,DashboardJobsProps } from "@/types/dashboard";


function getFirstValue(value?: string | string[]) {
  if (Array.isArray(value)) return value[0] || "";
  return value || "";
}

export default function DashboardJobs({ referralJobs,internshipJobs,offCampusJobs,allJobs }: DashboardJobsProps) 
{

  const [selectedJob, setSelectedJob] = useState(null);
  const [open, setOpen] = useState(false);

  
  const getTitle = (job: any) =>
  getFirstValue(job.jobTitle) ||
  job.jobRoles?.[0] ||
  job.title ||
  "Untitled Job";



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

  
  const handleJobClick = async (jobId:string) => {
  try {
    console.log("Fetching details for job ID:", jobId);
    const res = await axiosInstance.get(
      `/api/student-dashboard/job/${jobId}`
    );
    console.log("Job details:", res.data);
    setSelectedJob(res.data.data);
    setOpen(true);

  } catch(err){
    console.log(err);
  }
};
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
  {referralJobs.length > 0 && (
    <>
      <div className="px-5 py-3 border-b border-[#1e293b]">
        <h3 className="text-blue-400 font-semibold text-lg">
          Referral Jobs 
        </h3>
      </div>

      {referralJobs.map((job, index) => (
        <JobRow
          key={job._id || index}
          id={job._id || ""}
          logoLetter={getCompany(job).charAt(0).toUpperCase()}
          title={getTitle(job)}
          company={getCompany(job)}
          location={getLocation(job)}
          referredBy={job.candidatePosted?.name || "Alumni"}
          matchScore={job.matchScore ?? 0}
          onClick={() => handleJobClick(job._id!)}
          jobType= "Referral"
        />
      ))}
    </>
  )}

  {internshipJobs.length > 0 && (
    <>
      <div className="px-5 py-3 border-y border-[#1e293b]">
        <h3 className="text-blue-400 font-semibold text-lg">
          Internship Jobs 
        </h3>
      </div>

      {internshipJobs.map((job, index) => (
        <JobRow
          key={job._id || index}
          id={job._id || ""}
          logoLetter={getCompany(job).charAt(0).toUpperCase()}
          title={getTitle(job)}
          company={getCompany(job)}
          location={getLocation(job)}
          referredBy={job.candidatePosted?.name || "Alumni"}
          matchScore={job.matchScore ?? 0}
          onClick={() => handleJobClick(job._id!)}
        jobType="Internship"
        />
      ))}
    </>
  )}

  {offCampusJobs.length > 0 && (
    <>
      <div className="px-5 py-3 border-y border-[#1e293b]">
        <h3 className="text-blue-400 font-semibold text-lg">
          Off Campus Jobs 
        </h3>
      </div>

      {offCampusJobs.map((job, index) => (
        <JobRow
          key={job._id || index}
          id={job._id || ""}
          logoLetter={getCompany(job).charAt(0).toUpperCase()}
          title={getTitle(job)}
          company={getCompany(job)}
          location={getLocation(job)}
          referredBy={job.candidatePosted?.name || "Alumni"}
          matchScore={job.matchScore ?? 0}
          onClick={() => handleJobClick(job._id!)}
          jobType="Off-campus"
        />
      ))}
    </>
  )}

    <JobsDetailModel open={open} onClose={() => setOpen(false)} job={selectedJob} allJobs={allJobs} onSelectJob={setSelectedJob}/>

</div>

            
    </div>
  );
}



