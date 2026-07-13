import {
  BriefcaseBusiness,
  Calendar,
  ChevronRight,
  MapPin,
  Building2,
} from "lucide-react";
import { AlumniDetailOpenPositionsProps } from "@/types/alumni";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function AlumniDetailOpenPositions({
  userProfile,
}: AlumniDetailOpenPositionsProps) {
  const jobs = userProfile.referralJobs || [];
  const router = useRouter();
  const { profile, user } = useAuth();
  const userType = profile?.profileType || user?.userType || "student";

  const getJobRoute = (jobType: string) => {
    switch (jobType?.toLowerCase()) {
      case "referral":
      case "referral jobs":
        return "referral-jobs";
      case "off-campus":
      case "off campus":
        return "offcampus";
      case "internship":
      case "internships":
        return "internships";
      default:
        return "offcampus";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "bg-green-500/10 text-green-400 border-green-500/20";
      case "pending":
        return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "rejected":
        return "bg-red-500/10 text-red-400 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="rounded-2xl border border-[#2a3a52] bg-gradient-to-r from-[#111827] to-[#1a2332] p-4 shadow-xl shadow-black/20 backdrop-blur-sm">
      <h2 className="mb-3.5 flex items-center gap-2 text-sm font-bold text-white">
        <BriefcaseBusiness size={16} className="text-blue-400" />
        Open Positions
        {jobs.length > 0 && (
          <span className="ml-auto text-xs text-gray-500 bg-slate-800/50 px-2 py-0.5 rounded-full">
            {jobs.length}
          </span>
        )}
      </h2>

      {jobs.length > 0 ? (
        <div className="space-y-2.5">
          {jobs.slice(0, 5).map((job) => (
            <div
              key={job._id}
              onClick={() => {
                router.push(
                  `/${userType}/jobs/${getJobRoute(job.jobType)}/${job._id}`,
                );
              }}
              className="
                group
                rounded-xl 
                border 
                border-[#2a3a52] 
                bg-[#0f172a]
                p-3.5
                hover:border-green-500/30
                hover:bg-[#1a2332]
                transition-all 
                duration-200
                cursor-pointer
                hover:scale-[1.01]
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-white truncate group-hover:text-green-400 transition-colors">
                      {job.jobTitle?.join(", ") || "Untitled Position"}
                    </h3>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium border flex-shrink-0 ${getStatusColor(job.jobStatus)}`}
                    >
                      {job.jobStatus || "Draft"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-slate-400 line-clamp-1">
                    {job.description || "No description available"}
                  </p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-slate-500">
                    {job.companyName && (
                      <span className="flex items-center gap-1">
                        <Building2 size={11} className="text-slate-500" />
                        {job.companyName}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Calendar size={11} className="text-slate-500" />
                      {formatDate(job.createdAt)}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className="text-slate-600 group-hover:text-green-400 group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1"
                />
              </div>
            </div>
          ))}

          {jobs.length > 5 && (
            <button
              onClick={() => router.push(`/${userType}/jobs`)}
              className="w-full text-center text-xs text-slate-400 hover:text-green-400 transition-colors py-1.5 border-t border-[#2a3a52] mt-1"
            >
              View all {jobs.length} positions →
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-[#2a3a52] py-8 text-center bg-[#0f172a]">
          <BriefcaseBusiness
            size={28}
            className="mx-auto mb-2 text-slate-600"
          />
          <p className="text-xs text-slate-400">No open positions available.</p>
          <p className="text-[10px] text-slate-500 mt-0.5">
            Check back later for updates
          </p>
        </div>
      )}
    </div>
  );
}
