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
  [ApplicationStatus.ApplicationSent]: "badge-info",
  [ApplicationStatus.AwaitingRecruiterAction]: "badge-warning",
  [ApplicationStatus.Shortlisted]: "badge-primary",
  [ApplicationStatus.InterviewScheduled]: "badge-info",
  [ApplicationStatus.OfferExtended]: "badge-success",
  [ApplicationStatus.Accepted]: "badge-success",
  [ApplicationStatus.Rejected]: "badge-danger",
  [ApplicationStatus.ReferredToCompany]: "badge-warning",
  [ApplicationStatus.OfferAccepted]: "badge-success",
  [ApplicationStatus.OfferRejected]: "badge-danger",
  [ApplicationStatus.JoinedTheCompany]: "badge-success",
};

const statusDotColors: Record<ApplicationStatus, string> = {
  [ApplicationStatus.ApplicationSent]: "bg-info",
  [ApplicationStatus.AwaitingRecruiterAction]: "bg-warning",
  [ApplicationStatus.Shortlisted]: "bg-purple-400",
  [ApplicationStatus.InterviewScheduled]: "bg-cyan-400",
  [ApplicationStatus.OfferExtended]: "bg-emerald-400",
  [ApplicationStatus.Accepted]: "bg-success",
  [ApplicationStatus.Rejected]: "bg-danger",
  [ApplicationStatus.ReferredToCompany]: "bg-warning",
  [ApplicationStatus.OfferAccepted]: "bg-success",
  [ApplicationStatus.OfferRejected]: "bg-danger",
  [ApplicationStatus.JoinedTheCompany]: "bg-success",
};

const statusOptions = Object.values(
  ApplicationStatus,
) as ApplicationStatus[];

const getMatchScoreColor = (score?: number): string => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 75) return "text-success";
  if (numericScore >= 40) return "text-warning";
  return "text-danger";
};

const getMatchBarColor = (score?: number): string => {
  const numericScore = Number(score) || 0;
  if (numericScore >= 75) return "bg-success";
  if (numericScore >= 40) return "bg-warning";
  return "bg-danger";
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
    statusColors[statusKey] || "badge";

  return (
    <span
      className={`
        badge inline-flex max-w-[180px] items-center
        truncate whitespace-nowrap rounded-full
        px-2 py-0.5
        text-[10px] font-medium
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
        card rounded-3xl border border-theme
        overflow-hidden min-h-[420px] flex flex-col ml-5
      "
    >
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-[10000] bg-success-soft border border-success/30 text-success px-3.5 py-2.5 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4" />
            <span className="text-[12px] font-medium">{showSuccessToast}</span>
          </div>
        </div>
      )}

      <table className="w-full">
        <thead className="bg-background">
          <tr className="text-left text-muted">
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
                  <p className="text-base font-medium text-secondary">
                    No {applicationType} applications found
                  </p>
                  <p className="mt-1 text-xs text-muted">
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
                  className="border-t border-divider hover:bg-card-hover transition-colors cursor-pointer"
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
                          className="h-8 w-8 rounded-full object-cover border border-theme"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-info-soft flex items-center justify-center border border-theme">
                          <span className="text-info font-medium text-[11px]">
                            {getInitials(applicantName)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-primary font-medium text-[13px] hover:text-info transition-colors">
                          {applicantName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Company Column */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-muted" />
                      <span className="text-primary text-[13px]">
                        {referralCompany}
                      </span>
                      {jobDetails.isAskForReferral && (
                        <span className="badge badge-primary text-[9px] px-1.5 py-0.5 rounded-full border border-primary/20">
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
                      <Calendar className="w-3.5 h-3.5 text-muted" />
                      <span className="text-secondary text-[13px]">
                        {formatDate(appliedDate)}
                      </span>
                    </div>
                  </td>

                  {/* Match Score Column */}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-muted" />
                      <span
                        className={`font-semibold text-[13px] ${getMatchScoreColor(matchScore)}`}
                      >
                        {matchScore}%
                      </span>
                      {matchScore > 0 && (
                        <div className="w-10 h-1 bg-background-soft rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              matchScore >= 75
                                ? "bg-success"
                                : matchScore >= 40
                                  ? "bg-warning"
                                  : "bg-danger"
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
                        className="btn-secondary inline-flex items-center gap-1.5 rounded-lg border border-theme bg-background-soft px-3 py-1.5 text-[12px] font-medium text-primary transition-all hover:bg-card-hover hover:border-strong disabled:opacity-50 disabled:cursor-not-allowed"
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
                          className="card fixed z-[9999] overflow-y-auto rounded-lg border border-theme bg-card shadow-xl py-1"
                          onClick={(e) => e.stopPropagation()}
                          // Allow scroll events to propagate without closing
                          onWheel={(e) => e.stopPropagation()}
                          onScroll={(e) => e.stopPropagation()}
                        >
                          <div className="px-3 py-1.5 text-[10px] text-muted border-b border-divider sticky top-0 bg-card">
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
                                className={`w-full flex items-center justify-between px-3 py-2 text-[12px] transition-colors hover:bg-card-hover ${
                                  isSelected
                                    ? "text-primary bg-card-hover"
                                    : "text-secondary"
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      statusDotColors[status] || "bg-muted"
                                    }`}
                                  />
                                  {status}
                                </span>
                                {isSelected && (
                                  <Check className="h-3.5 w-3.5 text-success" />
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
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-2.5 border-t border-divider bg-background">
        <div className="text-[11px] text-muted order-2 sm:order-1">
          Showing {startIndex} to {endIndex} of {totalItems} results
        </div>
        <div className="flex items-center gap-1.5 order-1 sm:order-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={!hasPrev}
            className="btn-secondary px-3 py-1 rounded-md border border-theme text-[11px] font-medium text-muted hover:bg-card-hover hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
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
                ${typeof pageNum === "number" ? "hover:bg-card-hover hover:text-primary cursor-pointer" : "cursor-default"}
                ${currentPage === pageNum ? "badge-primary text-primary border border-primary/30" : "text-muted"}
                ${typeof pageNum !== "number" ? "text-muted" : ""}
              `}
            >
              {pageNum}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={!hasNext}
            className="btn-secondary px-3 py-1 rounded-md border border-theme text-[11px] font-medium text-muted hover:bg-card-hover hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}