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
    // Navigate to applications page with "Referred By Me" tab active
    router.push(`/${userType}/applications?tab=Applications%20By%20Me`);
  };

  return (
    <div className="surface-card flex h-full flex-col overflow-hidden rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--border)] bg-[var(--background-soft)]/50 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg border border-[var(--info-border)] bg-[var(--info-soft)]">
            <ClipboardList className="h-3.5 w-3.5 text-[var(--info)]" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">
              Application Status
            </h2>
            <p className="text-[10px] text-[var(--text-muted)]">
              {applications.length} total applications
            </p>
          </div>
        </div>

        {hasMore && (
          <button
            onClick={handleViewAll}
            className="group inline-flex items-center gap-1 text-[11px] font-medium text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--text-primary)]"
          >
            View All
            <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
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
              className="cursor-pointer transition-all duration-200 hover:bg-[var(--card-hover)] last:border-b-0"
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
          <div className="flex flex-col items-center justify-center px-5 py-10">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-soft)]">
              <ClipboardList className="h-6 w-6 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm text-[var(--text-secondary)]">No applications found</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              Start applying to jobs today
            </p>
          </div>
        )}
      </div>

      {/* Footer - Show only if hasMore and we want a second CTA */}
      {hasMore && displayApplications.length > 0 && (
        <div className="border-t border-[var(--border)] bg-[var(--background-soft)]/30 px-4 py-2.5">
          <button
            onClick={handleViewAll}
            className="group inline-flex w-full items-center justify-center gap-2 text-[11px] font-medium text-[var(--text-muted)] transition-colors duration-200 hover:text-[var(--info)]"
          >
            <span>View all {applications.length} applications</span>
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
          </button>
        </div>
      )}
    </div>
  );
}