// components/applications/ApplicationsList.tsx

"use client";

import StageIndicator from "./StageIndicator";
import { ApplicationTableProps } from "@/types/applications";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import {
  Building2,
  Briefcase,
  Calendar,
  Target,
  User,
  Store,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

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

export interface ApplicationsListProps {
  applicationType: string;
  applications: any[];
  page?: number;
  meta?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  onPageChange?: (page: number) => void;
  totalPages?: number;
}

// Interface for user details
interface UserDetails {
  _id: string;
  name: string;
  profileImage?: string | null;
  email?: string;
  currentCompany?: string;
  phone?: string;
}

export default function ApplicationsList({
  applicationType,
  applications,
  page = 1,
  meta,
  onPageChange,
  totalPages: propTotalPages,
}: ApplicationsListProps) {
  const { user, role } = useAuth();
  const userType = role || user?.userType || "professional";
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(page);
  const [userDetailsMap, setUserDetailsMap] = useState<
    Record<string, UserDetails>
  >({});
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});

  // Calculate pagination values
  const totalItems = meta?.total || applications.length || 0;
  const totalPages = propTotalPages || meta?.totalPages || 1;
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const itemsPerPage = meta?.limit || 10;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    if (onPageChange) {
      onPageChange(newPage);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
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

  // Fetch user details for a given userId
  const fetchUserDetails = async (userId: string) => {
    if (!userId || userDetailsMap[userId]) return;

    setLoadingUsers((prev) => ({ ...prev, [userId]: true }));

    try {
      const response = await axiosInstance.get(
        `/api/onboarding/get-details/${userId}`,
      );
      if (response.data?.success) {
        const userData = response.data.data;
        setUserDetailsMap((prev) => ({
          ...prev,
          [userId]: {
            _id: userData._id,
            name: userData.name || "Unknown",
            profileImage: userData.profileImage || null,
            email: userData.email,
            phone: userData.phone,
            currentCompany: userData.currentCompany,
          },
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch user details for ${userId}:`, error);
      setUserDetailsMap((prev) => ({
        ...prev,
        [userId]: {
          _id: userId,
          name: "Unknown User",
          profileImage: null,
        },
      }));
    } finally {
      setLoadingUsers((prev) => ({ ...prev, [userId]: false }));
    }
  };

  // Fetch user details for referral applications
  useEffect(() => {
    const uniqueUserIds = new Set<string>();
    applications.forEach((app) => {
      const jobType = app?.jobType || app?.jobDetails?.jobType || "";
      if (jobType === "Referral") {
        const postedByUser = app?.jobDetails?.postedByUser;
        if (postedByUser && !userDetailsMap[postedByUser]) {
          uniqueUserIds.add(postedByUser);
        }
      }
    });

    uniqueUserIds.forEach((userId) => {
      fetchUserDetails(userId);
    });
  }, [applications]);

  // Handle row click - navigate to application details
  const handleRowClick = (applicationId: string) => {
    if (!applicationId) {
      toast.error("Application ID is missing");
      return;
    }
    router.push(`/${userType}/applications/${applicationId}`);
  };

  // Handle profile navigation
  const handleProfileClick = (e: React.MouseEvent, userId?: string | null) => {
    e.stopPropagation();
    if (userId) {
      router.push(`/${userType}/profile/${userId}`);
    }
  };

  // Handle company profile click
  const handleCompanyClick = (e: React.MouseEvent, companyId?: string | null) => {
    e.stopPropagation();
    if (companyId) {
      router.push(`/${userType}/applications/${companyId}`);
    }
  };

  // Get user details and render avatar
  const renderUserAvatar = (
    userId?: string | null,
    userName?: string,
    profileImage?: string | null,
  ) => {
    const getInitials = (name?: string) => {
      if (!name) return "?";
      return name.charAt(0).toUpperCase();
    };

    const displayName = userName || "Unknown";
    const image = profileImage || null;

    if (image) {
      return (
        <div className="h-8 w-8 flex-shrink-0 overflow-hidden rounded-full border border-[var(--border)]">
          <Image
            src={image}
            alt={displayName}
            width={32}
            height={32}
            className="h-full w-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--info-soft)]">
        <span className="text-[11px] font-medium text-[var(--info)]">
          {getInitials(displayName)}
        </span>
      </div>
    );
  };

  return (
    <div className="flex min-h-[420px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)]">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-[var(--border)] bg-[var(--background-soft)]">
            <tr className="text-left text-[var(--text-muted)]">
              <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider sm:px-4">
                {applicationType === "Referral" ? "Referred By" : "Posted By"}
              </th>
              <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider sm:px-4">
                Company
              </th>
              <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider sm:px-4">
                Role
              </th>
              <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider sm:px-4">
                Stage
              </th>
              <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider sm:px-4">
                Applied
              </th>
              <th className="px-3 py-2.5 text-[10px] font-medium uppercase tracking-wider sm:px-4">
                Match Score
              </th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-[320px] text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-[var(--background-soft)]">
                      <Briefcase className="h-6 w-6 text-[var(--text-muted)]" />
                    </div>
                    <p className="text-sm font-medium text-[var(--text-secondary)]">
                      No {applicationType} applications found
                    </p>
                    <p className="mt-1 text-xs text-[var(--text-muted)]">
                      You haven't applied to any {applicationType?.toLowerCase()}{" "}
                      opportunities yet.
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              applications.map((application: any) => {
                // Safely access data with fallbacks
                const jobDetails = application?.jobDetails || {};
                const companyProfile = application?.companyProfile || {};
                const jobType = application?.jobType || jobDetails?.jobType || "";

                // Get poster info from companyProfile (for Internship/Off-campus)
                const employerDetails = companyProfile?.employerDetails || {};
                const posterName = employerDetails?.name || "Unknown";
                const posterDesignation = employerDetails?.designation || "";

                const companyId = application?._id || null;

                // Get company name from companyProfile
                const companyDetails = companyProfile?.companyDetails || {};
                const companyName =
                  companyDetails?.companyName ||
                  application?.displayCompanyName ||
                  jobDetails?.companyName ||
                  "N/A";

                // Get job title
                const jobRole =
                  jobDetails?.jobRoles?.[0] || 
                  jobDetails?.jobTitle?.[0] || 
                  application?.jobTitle?.[0] ||
                  "N/A";

                // Get status
                const currentStatus = application?.currentStatus || "Applied";

                // Get match score
                const matchScore = application?.matchScore ?? 0;

                // Get applied date
                const appliedDate =
                  application?.createdAt || 
                  application?.statusHistory?.[0]?.date ||
                  null;

                // For Referral type: Get postedByUser from jobDetails
                let referralUserId = null;
                let referralUserName = "";
                let referralUserCompany = "";
                let referralUserImage = null;

                if (jobType === "Referral") {
                  referralUserId = jobDetails?.postedByUser || null;
                  const userDetails = referralUserId
                    ? userDetailsMap[referralUserId]
                    : null;
                  referralUserName = userDetails?.name || "Unknown";
                  referralUserCompany = userDetails?.currentCompany || "";
                  referralUserImage = userDetails?.profileImage || null;
                }

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

                // Determine which user data to display
                const isReferral = jobType === "Referral";
                const displayUserId = isReferral ? referralUserId : null;
                const displayName = isReferral ? referralUserName : posterName;
                const displayImage = isReferral ? referralUserImage : null;
                const displayDesignation = isReferral ? "" : posterDesignation;

                // Determine which company name to display in Company column
                const displayCompanyName = isReferral && referralUserCompany 
                  ? referralUserCompany 
                  : companyName;

                return (
                  <tr
                    key={application?._id || Math.random().toString()}
                    className="cursor-pointer border-t border-[var(--border)] transition-colors hover:bg-[var(--card-hover)] group"
                    onClick={() => handleRowClick(application?._id)}
                  >
                    {/* Posted By / Referred By Column */}
                    <td className="px-3 py-3 sm:px-4">
                      <div
                        className="flex cursor-pointer items-center gap-2.5"
                        onClick={(e) => handleProfileClick(e, displayUserId)}
                      >
                        {isReferral ? (
                          renderUserAvatar(
                            displayUserId,
                            displayName,
                            displayImage,
                          )
                        ) : (
                          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--info-soft)]">
                            <span className="text-[11px] font-medium text-[var(--info)]">
                              {getInitials(displayName)}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-sm font-medium text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
                            {displayName}
                          </span>
                          {displayDesignation && (
                            <p className="text-[10px] text-[var(--text-muted)]">
                              {displayDesignation}
                            </p>
                          )}
                          {isReferral &&
                            referralUserId &&
                            loadingUsers[referralUserId] && (
                              <p className="text-[10px] text-[var(--text-muted)]">
                                Loading...
                              </p>
                            )}
                        </div>
                      </div>
                    </td>

                    {/* Company Column */}
                    <td className="px-3 py-3 sm:px-4">
                      <div
                        className="flex cursor-pointer items-center gap-1.5 transition-colors group-hover:text-[var(--primary)]"
                        onClick={(e) => handleCompanyClick(e, companyId)}
                      >
                        <Store className="h-3.5 w-3.5 text-[var(--text-muted)] transition-colors group-hover:text-[var(--primary)]" />
                        <span className="text-sm text-[var(--text-primary)]">
                          {displayCompanyName}
                        </span>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="px-3 py-3 sm:px-4">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                        <span className="text-sm font-medium text-[var(--text-primary)]">
                          {jobRole}
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
                              className={`h-full rounded-full ${
                                matchScore >= 75
                                  ? "bg-[var(--success)]"
                                  : matchScore >= 40
                                    ? "bg-[var(--warning)]"
                                    : "bg-[var(--danger)]"
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
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && applications.length > 0 && (
        <div className="flex flex-col items-center justify-between gap-3 border-t border-[var(--border)] bg-[var(--background-soft)] px-3 py-3 sm:flex-row sm:px-4">
          <div className="order-2 text-[10px] text-[var(--text-muted)] sm:order-1">
            Showing {startIndex} to {endIndex} of {totalItems} applications
          </div>
          
          <div className="order-1 flex items-center gap-1.5 sm:order-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrev}
              className="
                inline-flex items-center gap-1 rounded-lg border
                border-[var(--border)] bg-[var(--background-soft)]
                px-2.5 py-1.5 text-[10px] font-medium
                text-[var(--text-muted)] transition-all
                hover:border-[var(--primary-border)]
                hover:bg-[var(--primary-soft)]
                hover:text-[var(--primary)]
                disabled:cursor-not-allowed disabled:opacity-40
                disabled:hover:border-[var(--border)]
                disabled:hover:bg-transparent
                disabled:hover:text-[var(--text-muted)]
              "
            >
              <ChevronLeft size={12} />
              Prev
            </button>

            <div className="flex items-center gap-1 rounded-lg border border-[var(--border)] bg-[var(--card-hover)] px-2.5 py-1">
              <span className="text-[10px] font-medium text-[var(--text-primary)]">
                {currentPage}
              </span>
              <span className="text-[10px] text-[var(--text-muted)]">/</span>
              <span className="text-[10px] text-[var(--text-muted)]">
                {totalPages}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              className="
                inline-flex items-center gap-1 rounded-lg border
                border-[var(--border)] bg-[var(--background-soft)]
                px-2.5 py-1.5 text-[10px] font-medium
                text-[var(--text-muted)] transition-all
                hover:border-[var(--primary-border)]
                hover:bg-[var(--primary-soft)]
                hover:text-[var(--primary)]
                disabled:cursor-not-allowed disabled:opacity-40
                disabled:hover:border-[var(--border)]
                disabled:hover:bg-transparent
                disabled:hover:text-[var(--text-muted)]
              "
            >
              Next
              <ChevronRight size={12} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}