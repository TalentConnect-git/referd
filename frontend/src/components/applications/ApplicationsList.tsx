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
    // Navigate to the application details page
    router.push(`/${userType}/applications/${applicationId}`);
  };

  // Handle profile navigation
  const handleProfileClick = (e: React.MouseEvent, userId?: string | null) => {
    e.stopPropagation();
    if (userId) {
      router.push(`/${userType}/profile/${userId}`);
    }
  };

  // Handle company profile click - FIXED: Navigate to company profile
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
        <div className="h-8 w-8 rounded-full overflow-hidden border border-gray-600/30 flex-shrink-0">
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
      <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-gray-600/30 flex-shrink-0">
        <span className="text-blue-400 font-medium text-[11px]">
          {getInitials(displayName)}
        </span>
      </div>
    );
  };

  return (
    <div className="rounded-2xl ml-4  border border-[#2a3a52] overflow-hidden min-h-[420px] flex flex-col ">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#111827] border-b border-[#2a3a52]">
            <tr className="text-left text-gray-400">
              <th className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider">
                {applicationType === "Referral" ? "Referred By" : "Posted By"}
              </th>
              <th className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider">
                Company
              </th>
              <th className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider">
                Stage
              </th>
              <th className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider">
                Applied
              </th>
              <th className="px-4 py-2.5 text-[10px] font-medium uppercase tracking-wider">
                Match Score
              </th>
            </tr>
          </thead>

          <tbody>
            {applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="h-[320px] text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="h-12 w-12 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
                      <Briefcase className="h-6 w-6 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium text-gray-300">
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

                // Get job title - for Internship use jobRoles, for others use jobTitle
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
                    className="border-t border-[#2a3a52] hover:bg-[#1a2332] transition-colors cursor-pointer group"
                    onClick={() => handleRowClick(application?._id)}
                  >
                    {/* Posted By / Referred By Column */}
                    <td className="px-4 py-3">
                      <div
                        className="flex items-center gap-2.5 cursor-pointer"
                        onClick={(e) => handleProfileClick(e, displayUserId)}
                      >
                        {isReferral ? (
                          renderUserAvatar(
                            displayUserId,
                            displayName,
                            displayImage,
                          )
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-blue-500/10 flex items-center justify-center border border-gray-600/30 flex-shrink-0">
                            <span className="text-blue-400 font-medium text-[11px]">
                              {getInitials(displayName)}
                            </span>
                          </div>
                        )}
                        <div>
                          <span className="text-white font-medium text-[13px] group-hover:text-green-400 transition-colors">
                            {displayName}
                          </span>
                          {displayDesignation && (
                            <p className="text-[10px] text-gray-400">
                              {displayDesignation}
                            </p>
                          )}
                          {isReferral &&
                            referralUserId &&
                            loadingUsers[referralUserId] && (
                              <p className="text-[10px] text-gray-500">
                                Loading...
                              </p>
                            )}
                        </div>
                      </div>
                    </td>

                    {/* Company Column - Now displays referral's company for referral applications */}
                    <td className="px-4 py-3">
                      <div
                        className="flex items-center gap-1.5 cursor-pointer group-hover:text-green-400 transition-colors"
                        onClick={(e) => handleCompanyClick(e, companyId)}
                      >
                        <Store className="w-3.5 h-3.5 text-gray-500 group-hover:text-green-400 transition-colors" />
                        <span className="text-white text-[13px]">
                          {displayCompanyName}
                        </span>
                        
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-gray-500" />
                        <span className="text-white font-medium text-[13px]">
                          {jobRole}
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
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {meta && applications.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 border-t border-[#2a3a52] bg-[#0f172a]/50">
          <div className="text-[10px] text-slate-500 order-2 sm:order-1">
            Showing {startIndex} to {endIndex} of {totalItems} applications
          </div>
          
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={!hasPrev}
              className="
                inline-flex
                items-center
                gap-1
                px-2.5
                py-1.5
                rounded-lg
                border
                border-[#2a3a52]
                bg-[#0f172a]
                text-[10px]
                font-medium
                text-slate-400
                transition-all
                hover:border-green-500/30
                hover:bg-green-500/10
                hover:text-green-400
                disabled:opacity-40
                disabled:cursor-not-allowed
                disabled:hover:border-[#2a3a52]
                disabled:hover:bg-transparent
                disabled:hover:text-slate-400
              "
            >
              <ChevronLeft size={12} />
              Prev
            </button>

            <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1a2332] border border-[#2a3a52]">
              <span className="text-[10px] font-medium text-white">
                {currentPage}
              </span>
              <span className="text-[10px] text-slate-500">/</span>
              <span className="text-[10px] text-slate-500">
                {totalPages}
              </span>
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={!hasNext}
              className="
                inline-flex
                items-center
                gap-1
                px-2.5
                py-1.5
                rounded-lg
                border
                border-[#2a3a52]
                bg-[#0f172a]
                text-[10px]
                font-medium
                text-slate-400
                transition-all
                hover:border-green-500/30
                hover:bg-green-500/10
                hover:text-green-400
                disabled:opacity-40
                disabled:cursor-not-allowed
                disabled:hover:border-[#2a3a52]
                disabled:hover:bg-transparent
                disabled:hover:text-slate-400
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