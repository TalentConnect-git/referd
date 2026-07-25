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
        return "badge-success";
      case "pending":
        return "badge-warning";
      case "rejected":
        return "badge-danger";
      default:
        return "badge";
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
    <div className="card rounded-2xl border border-theme bg-gradient-to-r from-card to-card-soft p-4 shadow-xl shadow-black/20 backdrop-blur-sm">
      <h2 className="mb-3.5 flex items-center gap-2 text-sm font-bold text-primary">
        <BriefcaseBusiness size={16} className="text-info" />
        Open Positions
        {jobs.length > 0 && (
          <span className="ml-auto text-xs text-muted bg-background-soft/50 px-2 py-0.5 rounded-full">
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
                border-theme 
                bg-background
                p-3.5
                hover:border-primary/30
                hover:bg-card-soft
                transition-all 
                duration-200
                cursor-pointer
                hover:scale-[1.01]
              "
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-primary truncate group-hover:text-primary transition-colors">
                      {job.jobTitle?.join(", ") || "Untitled Position"}
                    </h3>
                    <span
                      className={`badge inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-medium border flex-shrink-0 ${getStatusColor(job.jobStatus)}`}
                    >
                      {job.jobStatus || "Draft"}
                    </span>
                  </div>

                  <p className="mt-1 text-xs text-secondary line-clamp-1">
                    {job.description || "No description available"}
                  </p>

                  <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[10px] text-muted">
                    {job.companyName && (
                      <span className="flex items-center gap-1">
                        <Building2 size={11} className="text-muted" />
                        {job.companyName}
                      </span>
                    )}

                    <span className="flex items-center gap-1">
                      <Calendar size={11} className="text-muted" />
                      {formatDate(job.createdAt)}
                    </span>
                  </div>
                </div>

                <ChevronRight
                  size={16}
                  className="text-muted group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-1"
                />
              </div>
            </div>
          ))}

          {jobs.length > 5 && (
            <button
              onClick={() => router.push(`/${userType}/jobs`)}
              className="w-full text-center text-xs text-muted hover:text-primary transition-colors py-1.5 border-t border-divider mt-1"
            >
              View all {jobs.length} positions →
            </button>
          )}
        </div>
      ) : (
        <div className="rounded-xl border border-dashed border-theme py-8 text-center bg-background">
          <BriefcaseBusiness
            size={28}
            className="mx-auto mb-2 text-muted"
          />
          <p className="text-xs text-muted">No open positions available.</p>
          <p className="text-[10px] text-muted/60 mt-0.5">
            Check back later for updates
          </p>
        </div>
      )}
    </div>
  );
}