// components/applications/ApplicationsList.tsx

"use client";

import StageIndicator from "./StageIndicator";
import { ApplicationTableProps } from "@/types/applications";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { Building2, Briefcase, Calendar, Target, User, Store } from "lucide-react";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance"

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
  [ApplicationStatus.Applied]: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  [ApplicationStatus.ApplicationSent]: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  [ApplicationStatus.AwaitingRecruiterAction]: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  [ApplicationStatus.Shortlisted]: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  [ApplicationStatus.InterviewScheduled]: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  [ApplicationStatus.OfferExtended]: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  [ApplicationStatus.Accepted]: "bg-green-500/10 text-green-400 border-green-500/20",
  [ApplicationStatus.Rejected]: "bg-red-500/10 text-red-400 border-red-500/20",
  [ApplicationStatus.ReferredToCompany]: "bg-orange-500/10 text-orange-400 border-orange-500/20",
  [ApplicationStatus.OfferAccepted]: "bg-green-600/10 text-green-500 border-green-600/20",
  [ApplicationStatus.OfferRejected]: "bg-red-600/10 text-red-500 border-red-600/20",
  [ApplicationStatus.JoinedTheCompany]: "bg-teal-500/10 text-teal-400 border-teal-500/20",
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
  const colorClass = statusColors[statusKey] || "bg-gray-500/10 text-gray-400 border-gray-500/20";
  
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
      {status}
    </span>
  );
};

// Get job type badge color
const getJobTypeColor = (jobType?: string): string => {
  if (jobType === "Internship") return "bg-green-500/10 text-green-400 border-green-500/20";
  if (jobType === "Referral") return "bg-purple-500/10 text-purple-400 border-purple-500/20";
  if (jobType === "Off-campus" || jobType === "Offcampus") return "bg-blue-500/10 text-blue-400 border-blue-500/20";
  return "bg-gray-500/10 text-gray-400 border-gray-500/20";
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
}

// Interface for user details
interface UserDetails {
  _id: string;
  name: string;
  profileImage?: string | null;
  email?: string;
  phone?: string;
}

export default function ApplicationsList({
  applicationType,
  applications,
  page = 1,
  meta,
  onPageChange,
}: ApplicationsListProps) {
  const { user, role } = useAuth();
  const userType = role || user?.userType || "professional";
  const router = useRouter();

  // State to store user details for referral applications
  const [userDetailsMap, setUserDetailsMap] = useState<Record<string, UserDetails>>({});
  const [loadingUsers, setLoadingUsers] = useState<Record<string, boolean>>({});

  // Fetch user details for a given userId
  const fetchUserDetails = async (userId: string) => {
    if (!userId || userDetailsMap[userId]) return;
    
    setLoadingUsers(prev => ({ ...prev, [userId]: true }));
    
    try {
      const response = await axiosInstance.get(`/api/onboarding/get-details/${userId}`);
      if (response.data?.success) {
        const userData = response.data.data;
        setUserDetailsMap(prev => ({
          ...prev,
          [userId]: {
            _id: userData._id,
            name: userData.name || "Unknown",
            profileImage: userData.profileImage || null,
            email: userData.email,
            phone: userData.phone
          }
        }));
      }
    } catch (error) {
      console.error(`Failed to fetch user details for ${userId}:`, error);
      setUserDetailsMap(prev => ({
        ...prev,
        [userId]: {
          _id: userId,
          name: "Unknown User",
          profileImage: null
        }
      }));
    } finally {
      setLoadingUsers(prev => ({ ...prev, [userId]: false }));
    }
  };

  // Fetch user details for referral applications
  useEffect(() => {
    const uniqueUserIds = new Set<string>();
    applications.forEach(app => {
      const jobType = app?.jobType || app?.jobDetails?.jobType || "";
      // Only fetch for referral type
      if (jobType === "Referral") {
        // Get postedByUser from jobDetails
        const postedByUser = app?.jobDetails?.postedByUser;
        if (postedByUser && !userDetailsMap[postedByUser]) {
          uniqueUserIds.add(postedByUser);
        }
      }
    });

    // Fetch details for each unique user
    uniqueUserIds.forEach(userId => {
      fetchUserDetails(userId);
    });
  }, [applications]);

  // Handle row click - navigate to application details
  const handleRowClick = (applicationId: string) => {
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
  const handleCompanyClick = (e: React.MouseEvent, companyId: string) => {
    e.stopPropagation();
    if (companyId) {
      router.push(`/${userType}/applications/${companyId}`);
    }
  };

  // Handle pagination with proper null checks
  const handlePreviousPage = () => {
    if (page > 1 && onPageChange) {
      onPageChange(page - 1);
    }
  };

  const handleNextPage = () => {
    if (meta?.hasNext && onPageChange) {
      onPageChange(page + 1);
    }
  };

  // Safely calculate pagination values
  const currentPage = meta?.page ?? page;
  const totalPages = meta?.totalPages ?? 1;
  const totalItems = meta?.total ?? 0;
  const itemsPerPage = meta?.limit ?? 10;
  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);
  const hasPrev = meta?.hasPrev ?? false;
  const hasNext = meta?.hasNext ?? false;

  // Get user details and render avatar
  const renderUserAvatar = (userId?: string | null, userName?: string, profileImage?: string | null) => {
    const getInitials = (name?: string) => {
      if (!name) return "?";
      return name.charAt(0).toUpperCase();
    };

    const displayName = userName || "Unknown";
    const image = profileImage || null;

    if (image) {
      return (
        <div className="h-10 w-10 rounded-full overflow-hidden border border-gray-600/30 flex-shrink-0">
          <Image
            src={image}
            alt={displayName}
            width={40}
            height={40}
            className="h-full w-full object-cover"
          />
        </div>
      );
    }

    return (
      <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-gray-600/30 flex-shrink-0">
        <span className="text-blue-400 font-medium text-sm">
          {getInitials(displayName)}
        </span>
      </div>
    );
  };

  return (
    <div className="rounded-3xl border border-slate-800 overflow-hidden min-h-[420px] flex flex-col ml-5">
      <table className="w-full">
        <thead className="bg-[#111827]">
          <tr className="text-left text-gray-400">
            <th className="px-6 py-4">
              {applicationType === "Referral" ? "Referred By" : "Posted By"}
            </th>
            <th className="px-6 py-4">Company</th>
            <th className="px-6 py-4">Role</th>
            <th className="px-6 py-4">Stage</th>
            <th className="px-6 py-4">Applied</th>
            <th className="px-6 py-4">Match Score</th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={6} className="h-[320px] text-center">
                <div className="flex flex-col items-center justify-center">
                  <p className="text-lg font-medium text-gray-300">
                    No {applicationType} applications found
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    You haven't applied to any {applicationType?.toLowerCase()} opportunities yet.
                  </p>
                </div>
              </td>
            </tr>
          ) : (
            applications.map((application: any) => {
              // Get data from jobDetails
              const jobDetails = application.jobDetails || {};
              const companyProfile = application.companyProfile || {};
              const jobType = application?.jobType || jobDetails?.jobType || "";
              
              // Get poster info from companyProfile (for Internship/Off-campus)
              const employerDetails = companyProfile.employerDetails || {};
              const posterName = employerDetails?.name || "Unknown";
              const posterDesignation = employerDetails?.designation || "";
              
              const companyId = companyProfile?._id || null;
              
              // Get company name from companyProfile
              const companyDetails = companyProfile.companyDetails || {};
              const companyName = 
                companyDetails?.companyName || 
                application.displayCompanyName || 
                jobDetails.companyName ||
                "N/A";
              
              // Get job title - for Internship use jobRoles, for others use jobTitle
              const jobRole = 
                jobDetails.jobRoles?.[0] || 
                jobDetails.jobTitle?.[0] || 
                "N/A";
              
              // Get status
              const currentStatus = application.currentStatus || "Applied";
              
              // Get match score
              const matchScore = application.matchScore ?? 0;
              
              // Get applied date
              const appliedDate = application.createdAt || application.statusHistory?.[0]?.date;
              
              // For Referral type: Get postedByUser from jobDetails
              let referralUserId = null;
              let referralUserName = "";
              let referralUserImage = null;
              
              if (jobType === "Referral") {
                // Get postedByUser from jobDetails
                referralUserId = jobDetails?.postedByUser || null;
                const userDetails = referralUserId ? userDetailsMap[referralUserId] : null;
                referralUserName = userDetails?.name || "Unknown";
                referralUserImage = userDetails?.profileImage || null;
              }
              
              // Format date
              const formatDate = (dateString: string) => {
                if (!dateString) return "N/A";
                try {
                  return new Date(dateString).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric"
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

              return (
                <tr
                  key={application._id}
                  className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(application._id)}
                >
                  {/* Posted By / Referred By Column */}
                  <td className="px-6 py-4">
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={(e) => handleProfileClick(e, displayUserId)}
                    >
                      {/* Avatar with image or first letter */}
                      {isReferral ? (
                        renderUserAvatar(displayUserId, displayName, displayImage)
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-gray-600/30 flex-shrink-0">
                          <span className="text-blue-400 font-medium text-sm">
                            {getInitials(displayName)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-white font-medium hover:text-blue-400 transition-colors">
                          {displayName}
                        </span>
                        {displayDesignation && (
                          <p className="text-xs text-gray-400">{displayDesignation}</p>
                        )}
                        {isReferral && referralUserId && loadingUsers[referralUserId] && (
                          <p className="text-xs text-gray-500">Loading...</p>
                        )}
                      </div>
                    </div>
                  </td>

                  {/* Company Column */}
                  <td className="px-6 py-4">
                    <div 
                      className="flex items-center gap-2 cursor-pointer hover:text-blue-400 transition-colors"
                      onClick={(e) => handleCompanyClick(e, companyId)}
                    >
                      <Store className="w-4 h-4 text-gray-500" />
                      <span className="text-white">{companyName}</span>
                    </div>
                  </td>

                  {/* Role Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-gray-500" />
                      <span className="text-white font-medium">{jobRole}</span>
                    </div>
                  </td>

                  {/* Stage Column */}
                  <td className="px-6 py-4">
                    <StatusBadge status={currentStatus} />
                  </td>

                  {/* Applied Date Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-gray-300">{formatDate(appliedDate)}</span>
                    </div>
                  </td>

                  {/* Match Score Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-gray-500" />
                      <span className={`font-semibold ${getMatchScoreColor(matchScore)}`}>
                        {matchScore}%
                      </span>
                      {matchScore > 0 && (
                        <div className="w-12 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              matchScore >= 75 ? "bg-green-500" :
                              matchScore >= 40 ? "bg-orange-500" :
                              "bg-red-500"
                            }`}
                            style={{ width: `${Math.min(matchScore, 100)}%` }}
                          />
                        </div>
                      )}
                      <span className={`text-[9px] font-medium ${getMatchScoreColor(matchScore)}`}>
                        {matchScore >= 75 ? "High" : matchScore >= 40 ? "Medium" : "Low"}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* Pagination - with proper null checks */}
      {meta && applications.length > 0 && totalItems > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-[#0F1115]">
          <div className="text-sm text-gray-400">
            Showing {startIndex} to {endIndex} of {totalItems} results
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousPage}
              disabled={!hasPrev}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-gray-400 hover:bg-slate-800/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            <span className="text-sm text-gray-400">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={!hasNext}
              className="px-3 py-1.5 rounded-lg border border-slate-700 text-sm text-gray-400 hover:bg-slate-800/50 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}