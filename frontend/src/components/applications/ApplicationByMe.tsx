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

// Status color mapping
const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.Saved]: "bg-gray-500/10 text-gray-400 border-gray-500/20",
  [ApplicationStatus.Applied]:
    "bg-blue-500/10 text-blue-400 border-blue-500/20",
  [ApplicationStatus.ApplicationSent]:
    "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  [ApplicationStatus.AwaitingRecruiterAction]:
    "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  [ApplicationStatus.Shortlisted]:
    "bg-purple-500/10 text-purple-400 border-purple-500/20",
  [ApplicationStatus.InterviewScheduled]:
    "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  [ApplicationStatus.OfferExtended]:
    "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  [ApplicationStatus.Accepted]:
    "bg-green-500/10 text-green-400 border-green-500/20",
  [ApplicationStatus.Rejected]: "bg-red-500/10 text-red-400 border-red-500/20",
  [ApplicationStatus.ReferredToCompany]:
    "bg-orange-500/10 text-orange-400 border-orange-500/20",
  [ApplicationStatus.OfferAccepted]:
    "bg-green-600/10 text-green-500 border-green-600/20",
  [ApplicationStatus.OfferRejected]:
    "bg-red-600/10 text-red-500 border-red-600/20",
  [ApplicationStatus.JoinedTheCompany]:
    "bg-teal-500/10 text-teal-400 border-teal-500/20",
};

// Get match score color
const getMatchScoreColor = (score?: number): string => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 75) return "text-green-400";
  if (numericScore >= 40) return "text-orange-400";
  return "text-red-400";
};

const getMatchScoreBg = (score?: number): string => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 75) return "bg-green-500";
  if (numericScore >= 40) return "bg-orange-500";
  return "bg-red-500";
};

// Status badge component
const StatusBadge = ({ status }: { status: string }) => {
  const statusKey = status as ApplicationStatus;
  const colorClass =
    statusColors[statusKey] ||
    "bg-gray-500/10 text-gray-400 border-gray-500/20";

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium border ${colorClass}`}
    >
      {status}
    </span>
  );
};

export default function ApplicationByMe({
  applicationType,
  applications,
  page = 1,
  meta,
  onPageChange,
  totalPages: propTotalPages,
}: ApplicationTableProps & { totalPages?: number }) {
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
    <div className="rounded-3xl border border-slate-800 overflow-hidden min-h-[420px] flex flex-col ml-5">
      <table className="w-full">
        <thead className="bg-[#111827]">
          <tr className="text-left text-gray-400">
            <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
              Posted By
            </th>
            <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
              Job Title
            </th>
            <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
              Company
            </th>
            <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
              Stage
            </th>
            <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
              Applied
            </th>
            <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
              Match Score
            </th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={6} className="h-[320px] text-center">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-base font-medium text-gray-300">
                    No {applicationType} applications found
                  </p>
                  <p className="mt-1 text-xs text-gray-500">
                    You haven't applied to any {applicationType?.toLowerCase()}{" "}
                    opportunities yet.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            applications.map((application: any) => {
              const jobDetails = application.jobDetails || {};

              // Get receiver profile from jobDetails
              const receiverProfile = jobDetails.receiverProfile || {};

              // Get poster name and image from receiverProfile
              const posterName = receiverProfile?.name || "Unknown";
              const posterImage = receiverProfile?.profileImage || null;
              const posterUserId = receiverProfile?.userId || null;

              // Get job title from jobDetails
              const jobTitle = jobDetails.jobTitle?.[0] || "N/A";

              // Get company name - priority: companyName from jobDetails, then displayCompanyName
              const companyName =
                jobDetails.companyName ||
                application.displayCompanyName ||
                "N/A";

              // Get status from currentStatus
              const currentStatus = application.currentStatus || "Applied";

              // Get match score
              const matchScore = application.matchScore ?? 0;

              // Get applied date
              const appliedDate =
                application.createdAt || application.statusHistory?.[0]?.date;

              return (
                <tr
                  key={application._id}
                  className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  onClick={() =>
                    router.push(`/${userType}/applications/${application._id}`)
                  }
                >
                  {/* Posted By Column */}
                  <td className="px-4 py-3">
                    <div
                      className="flex items-center gap-2.5 cursor-pointer"
                      onClick={(e) => handleProfileClick(e, posterUserId)}
                    >
                      {posterImage ? (
                        <Image
                          src={posterImage}
                          alt={posterName}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover border border-gray-600/30"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-gray-600/30">
                          <span className="text-blue-400 font-medium text-[11px]">
                            {getInitials(posterName)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-white font-medium text-[13px] hover:text-blue-400 transition-colors">
                          {posterName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Job Title Column */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-white font-medium text-[13px]">
                        {jobTitle}
                      </span>
                    </div>
                  </td>

                  {/* Company Column */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-white text-[13px]">
                        {companyName}
                      </span>
                    </div>
                  </td>

                  {/* Stage Column */}
                  <td className="px-4 py-3">
                    <StatusBadge status={currentStatus} />
                  </td>

                  {/* Applied Date Column */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-gray-300 text-[13px]">
                        {formatDate(appliedDate)}
                      </span>
                    </div>
                  </td>

                  {/* Match Score Column */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-gray-500" />
                      <span
                        className={`font-semibold text-[13px] ${getMatchScoreColor(matchScore)}`}
                      >
                        {matchScore}%
                      </span>
                      {matchScore > 0 && (
                        <div className="w-10 h-1 bg-[#1e293b] rounded-full overflow-hidden">
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 border-t border-slate-800 bg-[#0F172A]">
        <div className="text-[11px] text-gray-400 order-2 sm:order-1">
          Showing {startIndex} to {endIndex} of {totalItems} results
        </div>
        <div className="flex items-center gap-1.5 order-1 sm:order-2">
          {/* Previous Button */}
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="px-3 py-1 rounded-md border border-slate-700 text-[11px] font-medium text-gray-400 hover:bg-slate-700/30 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
          min-w-[28px] h-7 rounded-md text-[11px] font-medium transition-colors
          ${typeof pageNum === "number" ? "hover:bg-slate-700/30 hover:text-white cursor-pointer" : "cursor-default"}
          ${currentPage === pageNum ? "bg-green-500/20 text-green-400 border border-green-500/30" : "text-gray-400"}
          ${typeof pageNum !== "number" ? "text-gray-500" : ""}
        `}
            >
              {pageNum}
            </button>
          ))}

          {/* Next Button */}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNext}
            className="px-3 py-1 rounded-md border border-slate-700 text-[11px] font-medium text-gray-400 hover:bg-slate-700/30 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
