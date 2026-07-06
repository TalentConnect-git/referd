import AppStatusRow from "./AppStatusRow";
import { DashboardAppStatusProps } from "@/types/dashboard";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { ClipboardList, ChevronRight } from "lucide-react";
import { useState } from "react";

export default function DashboardAppStatus({
  applications,
}: DashboardAppStatusProps) {
  const router = useRouter();
  const { user } = useAuth();
  const userType = user?.userType;
  const [isHovered, setIsHovered] = useState(false);

  // Only show first 3 applications
  const displayApplications = applications.slice(0, 3);
  const hasMore = applications.length > 3;

  return (
    <div className="rounded-2xl border border-[#1e293b] bg-[#0f172a] h-full mr-5 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1e293b] bg-[#0f172a]/50">
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#60a5fa]/10 border border-[#60a5fa]/20">
            <ClipboardList className="h-3.5 w-3.5 text-[#60a5fa]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white">
              Application Status
            </h2>
          </div>
        </div>

        {hasMore && (
          <Link
            href={`/${userType}/applications`}
            className="text-xs font-medium text-[#64748b] hover:text-white transition-colors duration-200 flex items-center gap-1"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            style={{
              color: isHovered ? "#ffffff" : "#94a3b8",
              transition: "color 0.2s ease-in-out",
            }}
          >
            View All
            <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* Applications List */}
      <div>
        {displayApplications.length > 0 ? (
          displayApplications.map((application) => (
            <div
              key={application._id}
              onClick={() =>
                router.push(`/${userType}/applications/${application._id}`)
              }
              className="cursor-pointer transition-all duration-200 hover:bg-[#1a2332] last:border-b-0"
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
          <div className="flex flex-col items-center justify-center py-8 px-5">
            <div className="h-12 w-12 rounded-full bg-[#1e293b] flex items-center justify-center mb-3">
              <ClipboardList className="h-6 w-6 text-[#64748b]" />
            </div>
            <p className="text-sm text-[#64748b]">No applications found</p>
            <p className="text-xs text-[#475569] mt-1">
              Start applying to jobs today
            </p>
          </div>
        )}
      </div>


      

      {hasMore && (
        <div className="px-5 py-2 border-t border-[#1e293b]">
          <Link
            href={`/${userType}/applications`}
            className="text-xs text-[#64748b] hover:text-[#60a5fa] transition-colors duration-200 flex items-center gap-1"
          >
            <span>View all applications</span>
            <span className="text-[10px]">→</span>
          </Link>
        </div>
      )}
    </div>
  );
}
