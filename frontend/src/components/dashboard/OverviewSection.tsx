import { OverviewSectionProps } from "@/types/dashboard";
import { applyJob } from "@/services/job.service";
import PostedByReferrer from "./PostedByReferrer";
import AlumniWhoCanHelp from "./AlumniWhoCanHelp";

export default function OverviewSection({ job }: OverviewSectionProps) {
  console.log("Received Job ", job);

  return (
    <>
      {/* Job Details */}
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-4">
        <h3 className="mb-4 text-sm font-semibold text-white">Job Details</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-400 font-medium">Job Role</p>
            <p className="mt-0.5 text-sm text-white">{job.jobTitle || "N/A"}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-400 font-medium">Employment Type</p>
            <p className="mt-0.5 text-sm text-white">{job.employmentType?.[0] || "N/A"}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-400 font-medium">Work Location</p>
            <p className="mt-0.5 text-sm text-white">{job.location?.[0] || "N/A"}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-400 font-medium">Work Mode</p>
            <p className="mt-0.5 text-sm text-white">{job.workMode?.[0] || "N/A"}</p>
          </div>

          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-400 font-medium">Experience Required</p>
            <p className="mt-0.5 text-sm text-white">
              {job.internshipDuration || job.yearsOfExperience || "Entry Level"}
            </p>
          </div>

          {job.jobType != "Referral" && (
            <div>
              <p className="text-[10px] uppercase tracking-wider text-blue-400 font-medium">CGPA Required</p>
              <p className="mt-0.5 text-sm text-white">{job.cgpa || "N/A"}</p>
            </div>
          )}

          <div>
            <p className="text-[10px] uppercase tracking-wider text-blue-400 font-medium">Package</p>
            <p className="mt-0.5 text-sm text-white">₹ {job.packageDetails?.totalCTC || "N/A"}</p>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-4 rounded-xl border border-[#1e293b] bg-[#111827] p-4">
        <h3 className="mb-3 text-sm font-semibold text-white">Job Description</h3>
        <p className="text-sm leading-7 text-gray-300">{job.description || "No description provided"}</p>
      </div>

      {/* Posted By Referrer */}
      {job.candidatePosted && (
        <div className="mt-4 rounded-xl border border-[#1e293b] bg-[#111827] p-4">
          <PostedByReferrer candidateId={job.candidatePosted.userId} />
        </div>
      )}

      {/* Alumni Who Can Help */}
      <div className="mt-4 rounded-xl border border-[#1e293b] bg-[#111827] p-4">
        <AlumniWhoCanHelp job={job} />
      </div>
    </>
  );
}