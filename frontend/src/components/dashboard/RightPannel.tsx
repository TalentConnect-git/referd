import { RightPanelProps } from "@/types/dashboard";
export default function RightPanel({ allJobs,onSelectJob }: RightPanelProps) 
{
    return ( 
        
        <div className="w-[28%] overflow-y-auto border-l border-[#1e293b] bg-[#111827] p-5">

            <h3 className="text-lg font-semibold text-white">
              Other Jobs
            </h3>

            <p className="mb-5 text-sm text-gray-400">
              Browse other opportunities
            </p>

            {allJobs.length === 0 ? (
        <p className="text-gray-400">
          No jobs available
        </p>) : (
        allJobs.map((job) => (
          <div key={job._id} className="mb-4 rounded-xl border border-[#1e293b] bg-[#0f172a] p-4" >
            <h4 className="font-semibold text-white">
              {job.jobTitle?.[0] ||job.jobRoles?.[0] || "Untitled Job"}
            </h4>

            <p className="mt-1 text-sm text-gray-400">
              {job.candidatePosted?.currentCompany ||
                "Company"}
            </p>
            <div className="mt-3">
              <span className="rounded-full bg-blue-500/20 px-3 py-1 text-xs text-green-400">
                {job.employmentType?.[0] ||
                  "N/A"}
              </span>
            </div>
            <button onClick={() => onSelectJob(job)} className="mt-4 w-full rounded-lg bg-green-500 py-2 text-sm font-semibold text-white">
              Details
            </button>
          </div>
        )))}

          </div>
        
        );
}