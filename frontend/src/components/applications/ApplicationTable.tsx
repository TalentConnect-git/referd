"use client";

import StageIndicator from "./StageIndicator";
import { ApplicationTableProps } from "@/types/applications";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  RefreshCw,
  ChevronDown,
  Check,
  Building2,
  Briefcase,
  Calendar,
  Target,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { updateApplicationStatus } from "@/services/application.service";

// Status enum for applications
export enum ApplicationStatus {
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

export default function ApplicationTable({
  applicationType,
  applications,
  page = 1,
  meta,
  onPageChange,
  onStatusUpdate,
  totalPages: propTotalPages,
}: ApplicationTableProps & { totalPages?: number }) {
  const { user, role } = useAuth();
  const userType = role || user?.userType || "professional";
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(page);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Calculate pagination values
  const totalItems = meta?.total || applications.length || 0;
  const totalPages = propTotalPages || meta?.totalPages || 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const itemsPerPage = meta?.limit || 10;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-hide success toast
  useEffect(() => {
    if (showSuccessToast) {
      const timer = setTimeout(() => {
        setShowSuccessToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccessToast]);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
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

  // Handle row click - navigate to application details
  const handleRowClick = (applicationId: string) => {
    router.push(`/${userType}/applications/${applicationId}`);
  };

  // Handle profile navigation
  const handleProfileClick = (e: React.MouseEvent, userId: string) => {
    e.stopPropagation();
    if (userId) {
      router.push(`/${userType}/profile/${userId}`);
    }
  };

  // Handle update button click - prevent row navigation
  const handleUpdateClick = (e: React.MouseEvent, applicationId: string) => {
    e.stopPropagation();
    setOpenDropdown(openDropdown === applicationId ? null : applicationId);
  };

  // Handle status update using the service function
  const handleStatusUpdate = async (
    e: React.MouseEvent,
    applicationId: string,
    newStatus: string,
  ) => {
    e.stopPropagation();

    const allowedStatuses = ["Referred To Company", "Rejected", "Accepted"];
    if (!allowedStatuses.includes(newStatus)) {
      console.warn(`Status "${newStatus}" is not allowed for this action`);
    }

    try {
      setUpdatingStatus(applicationId);

      const response = await updateApplicationStatus(
        applicationId,
        newStatus as "Referred To Company" | "Rejected" | "Accepted",
      );

      if (response?.success || response?.status === 200) {
        setOpenDropdown(null);
        setShowSuccessToast(`Status updated to "${newStatus}" successfully!`);

        if (onStatusUpdate) {
          onStatusUpdate();
        }
      } else {
        console.error(
          "Failed to update status:",
          response?.msg || "Unknown error",
        );
        alert(`Failed to update status: ${response?.msg || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Failed to update status:", error);
      alert(
        `Failed to update status: ${error?.response?.data?.msg || error?.message || "Unknown error"}`,
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const statusOptions = Object.values(ApplicationStatus);

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

  return (
    <div className="rounded-3xl border border-slate-800 overflow-hidden min-h-[420px] flex flex-col ml-5">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500/10 border border-green-500/30 text-green-400 px-3.5 py-2.5 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span className="text-[12px] font-medium">{showSuccessToast}</span>
          </div>
        </div>
      )}

      <table className="w-full">
        <thead className="bg-[#111827]">
          <tr className="text-left text-gray-400">
            <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider">
              Applicant
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
            <th className="px-4 py-3 text-[11px] font-medium uppercase tracking-wider text-center">
              Actions
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
              const isUpdating = updatingStatus === application._id;
              const isOpen = openDropdown === application._id;

              // Get applicant data from the applicant object
              const applicant = application.applicant || {};
              const applicantName = applicant?.name || "Unknown";
              const applicantImage = applicant?.profileImage || null;
              const applicantUserId = applicant?.userId || null;

              // Get job details
              const jobDetails =
                application.job || application.jobDetails || {};

              // Get company name
              const referralCompany =
                jobDetails.companyName ||
                application.referralCompany ||
                application.displayCompanyName ||
                "N/A";

              // Get status
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
                  onClick={() => handleRowClick(application._id)}
                >
                  {/* Applicant Column */}
                  <td className="px-4 py-3">
                    <div
                      className="flex items-center gap-2.5 cursor-pointer"
                      onClick={(e) => handleProfileClick(e, applicantUserId)}
                    >
                      {applicantImage ? (
                        <Image
                          src={applicantImage}
                          alt={applicantName}
                          width={32}
                          height={32}
                          className="h-8 w-8 rounded-full object-cover border border-gray-600/30"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-gray-600/30">
                          <span className="text-blue-400 font-medium text-[11px]">
                            {getInitials(applicantName)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-white font-medium text-[13px] hover:text-blue-400 transition-colors">
                          {applicantName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Company Column */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-500" />
                      <span className="text-white text-[13px]">
                        {referralCompany}
                      </span>
                      {jobDetails.isAskForReferral && (
                        <span className="text-[9px] bg-purple-500/10 text-purple-400 px-1.5 py-0.5 rounded-full border border-purple-500/20">
                          Referral
                        </span>
                      )}
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
                            className={`h-full rounded-full ${
                              matchScore >= 75
                                ? "bg-green-500"
                                : matchScore >= 40
                                  ? "bg-orange-500"
                                  : "bg-red-500"
                            }`}
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

                  {/* Actions Column */}
                  <td className="px-4 py-3">
                    <div className="relative flex justify-center">
                      <button
                        onClick={(e) => handleUpdateClick(e, application._id)}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#0F1115] px-3 py-1.5 text-[12px] font-medium text-white transition-all hover:bg-[#171A20] hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? (
                          <>
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-3.5 w-3.5" />
                            Update
                            <ChevronDown
                              className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                            />
                          </>
                        )}
                      </button>

                      {/* Dropdown Menu - Opens Upward */}
                      {isOpen && !isUpdating && (
                        <div
                          ref={dropdownRef}
                          className="absolute right-0 bottom-full mb-1 w-56 max-h-80 overflow-y-auto rounded-lg border border-slate-700 bg-[#0F1115] shadow-xl z-50 py-1"
                        >
                          <div className="px-3 py-1.5 text-[10px] text-gray-500 border-b border-slate-700">
                            Change Status
                          </div>
                          {statusOptions.map((status) => {
                            const isSelected = status === currentStatus;

                            return (
                              <button
                                key={status}
                                onClick={(e) =>
                                  handleStatusUpdate(e, application._id, status)
                                }
                                className={`w-full flex items-center justify-between px-3 py-2 text-[12px] transition-colors hover:bg-slate-800/50 ${
                                  isSelected
                                    ? "text-white bg-slate-800/30"
                                    : "text-gray-300"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${statusColors[status]?.split(" ")[0] || "bg-gray-500"}`}
                                  />
                                  {status}
                                </span>
                                {isSelected && (
                                  <Check className="h-3.5 w-3.5 text-green-400" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      )}
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