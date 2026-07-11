import { RightPanelProps } from "@/types/dashboard";
import {
  Briefcase,
  Building2,
  MapPin,
  Clock,
  ChevronRight,
  Target,
  Users,
} from "lucide-react";

export default function RightPanel({ allJobs, onSelectJob }: RightPanelProps) {
  return (
    <div className="w-[28%] overflow-y-auto border-l border-[#1e293b] bg-[#111827] p-4 sticky top-0 h-[calc(100vh-80px)]">
      {/* Header */}
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-white flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-green-400" />
          Other Jobs
        </h3>
        <p className="text-[11px] text-gray-400 mt-0.5">
          {allJobs.length} opportunity{allJobs.length !== 1 ? "s" : ""}{" "}
          available
        </p>
      </div>

      {/* Job List */}
      {allJobs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-40 text-center">
          <Briefcase className="w-8 h-8 text-gray-600 mb-2" />
          <p className="text-sm text-gray-400">No jobs available</p>
          <p className="text-[11px] text-gray-500">
            Check back later for new opportunities
          </p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {allJobs.map((job) => {
            const jobTitle =
              job.jobTitle?.[0] || job.jobRoles?.[0] || "Untitled Job";
            const companyName =
              job.candidatePosted?.currentCompany ||
              job.receiverProfile?.currentCompany_display ||
              "";
            const location =
              job.location?.[0] || job.workLocation?.[0] || "";
            const employmentType = job.employmentType?.[0] || "";
            const matchScore = job.matchScore || 0;

            return (
              <div
                key={job._id}
                className="group rounded-lg border border-[#1e293b] bg-[#0f172a] p-3 hover:border-green-500/40 hover:bg-[#1a2332] transition-all duration-200 cursor-pointer"
                onClick={() => onSelectJob(job)}
              >
                {/* Job Title - Always show */}
                <h4 className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors truncate">
                  {jobTitle}
                </h4>

                {/* Company - Only show if exists */}
                {companyName && (
                  <div className="flex items-center gap-1 mt-1">
                    <Building2 className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    <p className="text-[11px] text-gray-400 truncate">
                      {companyName}
                    </p>
                  </div>
                )}

                {/* Location - Only show if exists */}
                {location && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
                    <p className="text-[10px] text-gray-500 truncate">
                      {location}
                    </p>
                  </div>
                )}

                {/* Tags & Match Score */}
                <div className="flex items-center justify-between mt-2">
                  <div className="flex items-center gap-1.5">
                    {/* Employment Type Tag - Only show if exists */}
                    {employmentType && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[9px] font-medium">
                        {employmentType}
                      </span>
                    )}
                    
                    {/* Match Score - Only show if > 0 */}
                    {matchScore > 0 && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-medium border ${
                        matchScore >= 75 ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                        matchScore >= 40 ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                        'bg-red-500/10 text-red-400 border-red-500/20'
                      }`}>
                        {matchScore}% Match
                      </span>
                    )}
                  </div>

                  {/* View Details Arrow */}
                  <ChevronRight className="w-3.5 h-3.5 text-gray-500 group-hover:text-green-400 group-hover:translate-x-0.5 transition-all duration-200" />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}