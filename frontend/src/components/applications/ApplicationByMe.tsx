"use client";

import { ApplicationTableProps } from "@/types/applications";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  Briefcase,
  Building2,
  Calendar,
  Target,
  User,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState } from "react";

// Status enum for applications
export enum ApplicationStatus {
  Saved = "Saved",
  Applied = "Applied",
  ApplicationSent = "Application Sent",
  AwaitingRecruiterAction = "Awaiting Recruiter Action",
  Shortlisted = "Shortlisted",
  InterviewScheduled = "Interview Scheduled",
  OfferExtended = "Offer Extended",
  Accepted = "Accepted",
  Rejected = "Rejected",
  ReferredToCompany = "Referred To Company",
  OfferAccepted = "Offer Accepted",
  OfferRejected = "Offer Rejected",
  JoinedTheCompany = "Joined the Company",
}

// Status color mapping using theme variables
const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Saved]: "text-[var(--text-muted)] border-[var(--border)] bg-[var(--background-soft)]",
  [ApplicationStatus.Applied]: "text-[var(--info)] border-[var(--info-border)] bg-[var(--info-soft)]",
  [ApplicationStatus.ApplicationSent]: "text-[var(--info)] border-[var(--info-border)] bg-[var(--info-soft)]",
  [ApplicationStatus.AwaitingRecruiterAction]: "text-[var(--warning)] border-[var(--warning-border)] bg-[var(--warning-soft)]",
  [ApplicationStatus.Shortlisted]: "text-[var(--primary)] border-[var(--primary-border)] bg-[var(--primary-soft)]",
  [ApplicationStatus.InterviewScheduled]: "text-[var(--info)] border-[var(--info-border)] bg-[var(--info-soft)]",
  [ApplicationStatus.OfferExtended]: "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]",
  [ApplicationStatus.Accepted]: "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]",
  [ApplicationStatus.Rejected]: "text-[var(--danger)] border-[var(--danger-border)] bg-[var(--danger-soft)]",
  [ApplicationStatus.ReferredToCompany]: "text-[var(--primary)] border-[var(--primary-border)] bg-[var(--primary-soft)]",
  [ApplicationStatus.OfferAccepted]: "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]",
  [ApplicationStatus.OfferRejected]: "text-[var(--danger)] border-[var(--danger-border)] bg-[var(--danger-soft)]",
  [ApplicationStatus.JoinedTheCompany]: "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]",
};

// Get match score color
const getMatchScoreColor = (score?: number): string => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 75) return "text-[var(--success)]";
  if (numericScore >= 40) return "text-[var(--warning)]";
  return "text-[var(--danger)]";
};

const getMatchScoreBg = (score?: number): string => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 75) return "bg-[var(--success)]";
  if (numericScore >= 40) return "bg-[var(--warning)]";
  return "bg-[var(--danger)]";
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusKey = status as ApplicationStatus;
  const colorClass =
    statusColors[statusKey] ||
    "text-[var(--text-muted)] border-[var(--border)] bg-[var(--background-soft)]";

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium ${colorClass}`}
    >
      {status}
    </span>
  );
};

// Define the props for ApplicationByMe
interface ApplicationByMeProps {
  applications: any[];
  page?: number;
  meta?: any;
  onPageChange?: (page: number) => void;
  onStatusUpdate?: () => void;
  totalPages?: number;
}

export default function ApplicationByMe({
  applications,
  page = 1,
  meta,
  onPageChange,
  onStatusUpdate,
  totalPages: propTotalPages,
}: ApplicationByMeProps) {
  const { user, role } = useAuth();
  const userType = role || user?.userType || "professional";
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(page);

  // Calculate pagination values
  const totalItems = meta?.total || applications.length || 0;
  const totalPages = propTotalPages || meta?.totalPages || 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  // Calculate start and end index for display
  const itemsPerPage = meta?.limit || 10;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle profile navigation
  const handleProfileClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    if (userId) {
      router.push(`/${userType}/profile/${userId}`);
    }
  };

  // Handle job title click - navigate to application details
  const handleJobTitleClick = (e: React.MouseEvent, applicationId: string) => {
    e.stopPropagation();
    if (applicationId) {
      router.push(`/${userType}/applications/${applicationId}`);
    }
  };

  // Handle pagination
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
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

  // Get initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  // Generate page numbers
  const getPageNumbers = (): (number | string)[] => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage = Math.max(2, currentPage - 1);
      let endPage = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, 4);
      }

      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - 3);
      }

      if (startPage > 2) {
        pages.push("...");
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  return (
    <div className="mx-4 flex min-h-[420px] flex-col overflow-hidden rounded-3xl border border-[var(--border)] bg-[var(--card)] sm:mx-5">
      <table className="w-full">
        <thead className="bg-[var(--background-soft)]">
          <tr className="text-left text-[var(--text-muted)]">
            <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider sm:px-4">
              Job Title
            </th>
            <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider sm:px-4">
              Posted By
            </th>
            <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider sm:px-4">
              Company
            </th>
            <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider sm:px-4">
              Stage
            </th>
            <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider sm:px-4">
              Applied
            </th>
            <th className="px-3 py-3 text-[11px] font-medium uppercase tracking-wider sm:px-4">
              Match Score
            </th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={6} className="h-[320px] text-center">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-base font-medium text-[var(--text-secondary)]">
                    No applications found
                  </p>
                  <p className="mt-1 text-xs text-[var(--text-muted)]">
                    You haven't applied to any opportunities yet.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            applications.map((application: any) => {
              const jobDetails = application.jobDetails || {};

              const receiverProfile = jobDetails.receiverProfile || {};

              const posterName = receiverProfile?.name || "Unknown";
              const posterImage = receiverProfile?.profileImage || null;
              const posterUserId = receiverProfile?.userId || null;

              const jobTitle = jobDetails.jobTitle?.[0] || "N/A";

              const companyName =
                jobDetails.companyName ||
                application.displayCompanyName ||
                "N/A";

              const currentStatus = application.currentStatus || "Applied";

              const matchScore = application.matchScore ?? 0;

              const appliedDate =
                application.createdAt || application.statusHistory?.[0]?.date;

              return (
                <tr
                  key={application._id}
                  className="cursor-pointer border-t border-[var(--border)] transition-colors hover:bg-[var(--card-hover)]"
                >
                  <td className="px-3 py-3 sm:px-4">
                    <div
                      className="group flex cursor-pointer items-center gap-1.5"
                      onClick={(e) => handleJobTitleClick(e, application._id)}
                    >
                      <Briefcase className="h-3.5 w-3.5 text-[var(--text-muted)] transition-colors group-hover:text-[var(--info)]" />
                      <span className="text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--info)]">
                        {jobTitle}
                      </span>
                    </div>
                  </td>
                  
                  {/* Posted By Column */}
                  <td className="px-3 py-3 sm:px-4">
                    <div
                      className="group flex cursor-pointer items-center gap-2.5"
                      onClick={(e) => handleProfileClick(e, posterUserId)}
                    >
                      {posterImage ? (
                        <Image
                          src={posterImage}
                          alt={posterName}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full border border-[var(--border)] object-cover transition-colors group-hover:border-[var(--info-border)]"
                        />
                      ) : (
                        <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--info-soft)] transition-colors group-hover:border-[var(--info-border)]">
                          <span className="text-[11px] font-medium text-[var(--info)] transition-colors group-hover:text-[var(--info)]">
                            {getInitials(posterName)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--info)]">
                          {posterName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Company Column */}
                  <td className="px-3 py-3 sm:px-4">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      <span className="text-sm text-[var(--text-primary)]">
                        {companyName}
                      </span>
                    </div>
                  </td>

                  {/* Stage Column */}
                  <td className="px-3 py-3 sm:px-4">
                    <StatusBadge status={currentStatus} />
                  </td>

                  {/* Applied Date Column */}
                  <td className="px-3 py-3 sm:px-4">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      <span className="text-sm text-[var(--text-secondary)]">
                        {formatDate(appliedDate)}
                      </span>
                    </div>
                  </td>

                  {/* Match Score Column */}
                  <td className="px-3 py-3 sm:px-4">
                    <div className="flex items-center gap-1.5">
                      <Target className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                      <span
                        className={`text-sm font-semibold ${getMatchScoreColor(matchScore)}`}
                      >
                        {matchScore}%
                      </span>
                      {matchScore > 0 && (
                        <div className="h-1 w-10 overflow-hidden rounded-full bg-[var(--border)]">
                          <div
                            className={`h-full rounded-full ${getMatchScoreBg(matchScore)}`}
                            style={{ width: `${Math.min(matchScore, 100)}%` }}
                          />
                        </div>
                      )}
                      <span
                        className={`text-[8px] font-medium ${getMatchScoreColor(matchScore)}`}
                      >
                        {matchScore >= 75
                          ? "High"
                          : matchScore >= 40
                            ? "Medium"
                            : "Low"}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--background-soft)] px-3 py-2.5 sm:flex-row sm:px-4">
        <div className="order-2 text-[11px] text-[var(--text-muted)] sm:order-1">
          Showing {startIndex} to {endIndex} of {totalItems} results
        </div>
        <div className="order-1 flex items-center gap-1.5 sm:order-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="rounded-md border border-[var(--border)] px-3 py-1 text-[11px] font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          {/* Page Numbers */}
          {getPageNumbers().map((pageNum, index) => (
            <button
              key={index}
              onClick={() => {
                if (typeof pageNum === "number") {
                  handlePageChange(pageNum);
                }
              }}
              disabled={typeof pageNum !== "number"}
              className={`
                h-7 min-w-[28px] rounded-md text-[11px] font-medium transition-colors
                ${typeof pageNum === "number" ? "cursor-pointer hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]" : "cursor-default"}
                ${currentPage === pageNum ? "border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]" : "text-[var(--text-muted)]"}
                ${typeof pageNum !== "number" ? "text-[var(--text-muted)]" : ""}
              `}
            >
              {pageNum}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNext}
            className="rounded-md border border-[var(--border)] px-3 py-1 text-[11px] font-medium text-[var(--text-muted)] transition-colors hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}