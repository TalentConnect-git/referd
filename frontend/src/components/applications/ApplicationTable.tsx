"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Target,
} from "lucide-react";

import type { ApplicationTableProps } from "@/types/applications";
import { useAuth } from "@/context/AuthContext";
import { updateApplicationStatus } from "@/services/application.service";

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

type DropdownPosition = {
  top: number;
  left: number;
  width: number;
  maxHeight: number;
  opensUpward: boolean;
};

type RequestError = {
  response?: {
    data?: {
      msg?: string;
      message?: string;
    };
  };
  message?: string;
};

const statusColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.ApplicationSent]:
    "border-indigo-500/20 bg-indigo-500/10 text-indigo-400",
  [ApplicationStatus.AwaitingRecruiterAction]:
    "border-yellow-500/20 bg-yellow-500/10 text-yellow-400",
  [ApplicationStatus.Shortlisted]:
    "border-purple-500/20 bg-purple-500/10 text-purple-400",
  [ApplicationStatus.InterviewScheduled]:
    "border-cyan-500/20 bg-cyan-500/10 text-cyan-400",
  [ApplicationStatus.OfferExtended]:
    "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  [ApplicationStatus.Accepted]:
    "border-green-500/20 bg-green-500/10 text-green-400",
  [ApplicationStatus.Rejected]:
    "border-red-500/20 bg-red-500/10 text-red-400",
  [ApplicationStatus.ReferredToCompany]:
    "border-orange-500/20 bg-orange-500/10 text-orange-400",
  [ApplicationStatus.OfferAccepted]:
    "border-green-600/20 bg-green-600/10 text-green-500",
  [ApplicationStatus.OfferRejected]:
    "border-red-600/20 bg-red-600/10 text-red-500",
  [ApplicationStatus.JoinedTheCompany]:
    "border-teal-500/20 bg-teal-500/10 text-teal-400",
};

const statusDotColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.ApplicationSent]: "bg-indigo-400",
  [ApplicationStatus.AwaitingRecruiterAction]: "bg-yellow-400",
  [ApplicationStatus.Shortlisted]: "bg-purple-400",
  [ApplicationStatus.InterviewScheduled]: "bg-cyan-400",
  [ApplicationStatus.OfferExtended]: "bg-emerald-400",
  [ApplicationStatus.Accepted]: "bg-green-400",
  [ApplicationStatus.Rejected]: "bg-red-400",
  [ApplicationStatus.ReferredToCompany]: "bg-orange-400",
  [ApplicationStatus.OfferAccepted]: "bg-green-500",
  [ApplicationStatus.OfferRejected]: "bg-red-500",
  [ApplicationStatus.JoinedTheCompany]: "bg-teal-400",
};

const statusOptions = Object.values(
  ApplicationStatus,
) as ApplicationStatus[];

const getMatchScoreColor = (score?: number): string => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 75) return "text-green-400";
  if (numericScore >= 40) return "text-orange-400";
  return "text-red-400";
};

const getMatchBarColor = (score?: number): string => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 75) return "bg-green-500";
  if (numericScore >= 40) return "bg-orange-500";
  return "bg-red-500";
};

const getMatchLevel = (score?: number): string => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 75) return "High";
  if (numericScore >= 40) return "Medium";
  return "Low";
};

const StatusBadge = ({ status }: { status: string }) => {
  const statusKey = status as ApplicationStatus;
  const colorClass =
    statusColors[statusKey] ||
    "border-gray-500/20 bg-gray-500/10 text-gray-400";

  return (
    <span
      className={`
        inline-flex max-w-[180px] items-center
        truncate whitespace-nowrap rounded-full
        border px-2 py-0.5
        text-[10px] font-medium
        ${colorClass}
      `}
      title={status}
    >
      {status}
    </span>
  );
};

const calculateDropdownPosition = (
  buttonRect: DOMRect,
): DropdownPosition => {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const screenMargin = 12;
  const dropdownGap = 8;
  const preferredWidth = 224;
  const preferredHeight = 320;

  const dropdownWidth = Math.min(
    preferredWidth,
    viewportWidth - screenMargin * 2,
  );

  const spaceBelow =
    viewportHeight - buttonRect.bottom - screenMargin;
  const spaceAbove =
    buttonRect.top - screenMargin;

  const opensUpward =
    spaceBelow < 240 && spaceAbove > spaceBelow;

  const availableSpace = opensUpward
    ? spaceAbove - dropdownGap
    : spaceBelow - dropdownGap;

  const maxHeight = Math.max(
    100,
    Math.min(preferredHeight, availableSpace),
  );

  const left = Math.min(
    Math.max(
      screenMargin,
      buttonRect.right - dropdownWidth,
    ),
    viewportWidth - dropdownWidth - screenMargin,
  );

  const top = opensUpward
    ? Math.max(
        screenMargin,
        buttonRect.top - dropdownGap - maxHeight,
      )
    : Math.min(
        buttonRect.bottom + dropdownGap,
        viewportHeight - maxHeight - screenMargin,
      );

  return {
    top,
    left,
    width: dropdownWidth,
    maxHeight,
    opensUpward,
  };
};

export default function ApplicationTable({
  applicationType,
  applications,
  page = 1,
  meta,
  onPageChange,
  onStatusUpdate,
  totalPages: propTotalPages,
}: ApplicationTableProps & {
  totalPages?: number;
}) {
  const { user, role } = useAuth();
  const router = useRouter();

  const userType =
    role || user?.userType || "professional";

  const [openDropdown, setOpenDropdown] = useState<
    string | null
  >(null);

  const [dropdownPosition, setDropdownPosition] =
    useState<DropdownPosition | null>(null);

  const [updatingStatus, setUpdatingStatus] = useState<
    string | null
  >(null);

  const [showSuccessToast, setShowSuccessToast] =
    useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(page);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const totalItems =
    meta?.total || applications.length || 0;

  const totalPages =
    propTotalPages || meta?.totalPages || 1;

  const itemsPerPage = meta?.limit || 10;

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const startIndex =
    totalItems > 0
      ? (currentPage - 1) * itemsPerPage + 1
      : 0;

  const endIndex = Math.min(
    currentPage * itemsPerPage,
    totalItems,
  );

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  // Fixed: Only close dropdown when clicking outside both trigger and dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Check if click is on trigger button
      const clickedTrigger = target.closest(
        '[data-status-dropdown-trigger="true"]',
      );
      
      // Check if click is inside dropdown
      const clickedDropdown = dropdownRef.current?.contains(target);
      
      // Only close if click is outside both trigger and dropdown
      if (!clickedTrigger && !clickedDropdown) {
        setOpenDropdown(null);
        setDropdownPosition(null);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, []);

  // Fixed: Removed scroll listener that was closing dropdown
  useEffect(() => {
    if (!openDropdown) return;

    const closeDropdown = () => {
      setOpenDropdown(null);
      setDropdownPosition(null);
    };

    window.addEventListener("resize", closeDropdown);

    return () => {
      window.removeEventListener("resize", closeDropdown);
    };
  }, [openDropdown]);

  useEffect(() => {
    if (!showSuccessToast) return;

    const timer = window.setTimeout(() => {
      setShowSuccessToast(null);
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [showSuccessToast]);

  const closeDropdown = () => {
    setOpenDropdown(null);
    setDropdownPosition(null);
  };

  const handlePageChange = (newPage: number) => {
    if (
      newPage < 1 ||
      newPage > totalPages ||
      newPage === currentPage
    ) {
      return;
    }

    closeDropdown();
    setCurrentPage(newPage);
    onPageChange?.(newPage);
  };

  const getPageNumbers = (): Array<number | string> => {
    const pages: Array<number | string> = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (
        let pageNumber = 1;
        pageNumber <= totalPages;
        pageNumber += 1
      ) {
        pages.push(pageNumber);
      }
      return pages;
    }

    pages.push(1);

    let startPage = Math.max(2, currentPage - 1);
    let endPage = Math.min(
      totalPages - 1,
      currentPage + 1,
    );

    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, 4);
    }

    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3);
    }

    if (startPage > 2) {
      pages.push("...");
    }

    for (
      let pageNumber = startPage;
      pageNumber <= endPage;
      pageNumber += 1
    ) {
      pages.push(pageNumber);
    }

    if (endPage < totalPages - 1) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const handleRowClick = (applicationId: string) => {
    router.push(
      `/${userType}/applications/to-me/${applicationId}`,
    );
  };

  const handleProfileClick = (
    event: React.MouseEvent,
    userId: string,
  ) => {
    event.stopPropagation();
    if (!userId) return;
    router.push(`/${userType}/profile/${userId}`);
  };

  const handleUpdateClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    applicationId: string,
  ) => {
    event.stopPropagation();

    if (openDropdown === applicationId) {
      closeDropdown();
      return;
    }

    const buttonRect =
      event.currentTarget.getBoundingClientRect();

    setDropdownPosition(
      calculateDropdownPosition(buttonRect),
    );

    setOpenDropdown(applicationId);
  };

  const handleStatusUpdate = async (
    event: React.MouseEvent<HTMLButtonElement>,
    applicationId: string,
    newStatus: ApplicationStatus,
  ) => {
    event.stopPropagation();

    try {
      setUpdatingStatus(applicationId);

      const response = await updateApplicationStatus(
        applicationId,
        newStatus as
          | "Referred To Company"
          | "Rejected"
          | "Accepted",
      );

      if (!response?.success && response?.status !== 200) {
        throw new Error(
          response?.msg || "Failed to update status",
        );
      }

      closeDropdown();

      setShowSuccessToast(
        `Status updated to "${newStatus}" successfully!`,
      );

      onStatusUpdate?.();
    } catch (error: unknown) {
      console.error(
        "Failed to update status:",
        error,
      );

      const requestError = error as RequestError;

      const message =
        requestError.response?.data?.msg ||
        requestError.response?.data?.message ||
        requestError.message ||
        "Unknown error";

      window.alert(
        `Failed to update status: ${message}`,
      );
    } finally {
      setUpdatingStatus(null);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "N/A";

    return date.toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getInitials = (name: string) => {
    if (!name) return "?";
    return name.charAt(0).toUpperCase();
  };

  return (
    <div
      className="
        rounded-3xl border border-slate-800
        overflow-hidden min-h-[420px] flex flex-col ml-5
      "
    >
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-[10000] bg-green-500/10 border border-green-500/30 text-green-400 px-3.5 py-2.5 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top-2">
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

              const applicant = application.applicant || {};
              const applicantName = applicant?.name || "Unknown";
              const applicantImage = applicant?.profileImage || null;
              const applicantUserId = applicant?.userId || null;

              const jobDetails = application.job || application.jobDetails || {};
              const referralCompany =
                jobDetails.companyName ||
                application.referralCompany ||
                application.displayCompanyName ||
                "N/A";

              const currentStatus = application.currentStatus || "Applied";
              const matchScore = application.matchScore ?? 0;
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
                        data-status-dropdown-trigger="true"
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
                      {isOpen && !isUpdating && dropdownPosition && (
                        <div
                          ref={dropdownRef}
                          style={{
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                            width: dropdownPosition.width,
                            maxHeight: dropdownPosition.maxHeight,
                          }}
                          className="fixed z-[9999] overflow-y-auto rounded-lg border border-slate-700 bg-[#0F1115] shadow-xl py-1"
                          onClick={(e) => e.stopPropagation()}
                          // Allow scroll events to propagate without closing
                          onWheel={(e) => e.stopPropagation()}
                          onScroll={(e) => e.stopPropagation()}
                        >
                          <div className="px-3 py-1.5 text-[10px] text-gray-500 border-b border-slate-700 sticky top-0 bg-[#0F1115]">
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
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      statusDotColors[status] || "bg-gray-500"
                                    }`}
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
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="px-3 py-1 rounded-md border border-slate-700 text-[11px] font-medium text-gray-400 hover:bg-slate-700/30 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

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