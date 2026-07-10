import AppStatusRow from "./AppStatusRow";
import { DashboardAppStatusProps } from "@/types/dashboard";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ClipboardList, ChevronRight, ArrowRight } from "lucide-react";

export default function DashboardAppStatus({
  applications,
}: DashboardAppStatusProps) {
  const router = useRouter();
  const { user } = useAuth();
  const userType = user?.userType;

  // Only show first 3 applications
  const displayApplications = applications.slice(0, 3);
  const hasMore = applications.length > 2;

  const handleViewAll = () => {
    router.push(`/${userType}/applications`);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-[#0f172a] h-full mr-5 overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0f172a]/50">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
            <ClipboardList className="h-3.5 w-3.5 text-blue-400" />
          </div>
          <div>
            <h2 className="text-[13px] font-semibold text-white">
              Application Status
            </h2>
            <p className="text-[10px] text-gray-500">
              {applications.length} total applications
            </p>
          </div>
        </div>

        {hasMore && (
          <button
            onClick={handleViewAll}
            className="group inline-flex items-center gap-1 text-[11px] font-medium text-gray-400 hover:text-white transition-colors duration-200"
          >
            View All
            <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        )}
      </div>

      {/* Applications List */}
      <div className="flex-1">
        {displayApplications.length > 0 ? (
          displayApplications.map((application) => (
            <div
              key={application._id}
              onClick={() =>
                router.push(`/${userType}/applications/${application._id}`)
              }
              className="cursor-pointer transition-all duration-200 hover:bg-slate-800/30 last:border-b-0"
            >
              <AppStatusRow
                company={application.displayCompanyName ?? "Company"}
                role={
                  application.jobDetails?.jobTitle?.[0] ??
                  application.jobDetails?.jobRoles?.[0] ??
                  "Untitled Job"
                }
                stage={application.currentStatus}
              />
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-5">
            <div className="h-12 w-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
              <ClipboardList className="h-6 w-6 text-gray-500" />
            </div>
            <p className="text-sm text-gray-400">No applications found</p>
            <p className="text-xs text-gray-500 mt-1">
              Start applying to jobs today
            </p>
          </div>
        )}
      </div>

      {/* Footer - Show only if hasMore and we want a second CTA */}
      {hasMore && displayApplications.length > 0 && (
        <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-800/10">
          <button
            onClick={handleViewAll}
            className="w-full inline-flex items-center justify-center gap-2 text-[11px] font-medium text-gray-400 hover:text-blue-400 transition-colors duration-200 group"
          >
            <span>View all {applications.length} applications</span>
            <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
          </button>
        </div>
      )}
    </div>
  );
}
