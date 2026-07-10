"use client";

import StageIndicator from "./StageIndicator";
import { ApplicationTableProps } from "@/types/applications";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import Image from "next/image";
import { RefreshCw, ChevronDown, Check, Building2, Briefcase, Calendar, Target } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { updateApplicationStatus } from "@/services/application.service";

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

export default function ApplicationTable({
  applicationType,
  applications,
  page = 1,
  meta,
  onPageChange,
  onStatusUpdate,
}: ApplicationTableProps) {
  const { user, role } = useAuth();
  const userType = role || user?.userType || "professional";
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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
  const handleStatusUpdate = async (e: React.MouseEvent, applicationId: string, newStatus: string) => {
    e.stopPropagation();
    
    // Only allow specific status values
    const allowedStatuses = ["Referred To Company", "Rejected", "Accepted"];
    if (!allowedStatuses.includes(newStatus)) {
      console.warn(`Status "${newStatus}" is not allowed for this action`);
    }

    try {
      setUpdatingStatus(applicationId);
      
      const response = await updateApplicationStatus(
        applicationId,
        newStatus as "Referred To Company" | "Rejected" | "Accepted"
      );
      
      if (response?.success || response?.status === 200) {
        setOpenDropdown(null);
        setShowSuccessToast(`Status updated to "${newStatus}" successfully!`);
        
        if (onStatusUpdate) {
          onStatusUpdate();
        }
      } else {
        console.error("Failed to update status:", response?.msg || "Unknown error");
        alert(`Failed to update status: ${response?.msg || "Unknown error"}`);
      }
    } catch (error: any) {
      console.error("Failed to update status:", error);
      alert(`Failed to update status: ${error?.response?.data?.msg || error?.message || "Unknown error"}`);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const statusOptions = Object.values(ApplicationStatus);

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

  return (
    <div className="rounded-3xl border border-slate-800 overflow-hidden min-h-[420px] flex flex-col ml-5">
      {/* Success Toast */}
      {showSuccessToast && (
        <div className="fixed top-4 right-4 z-50 bg-green-500/10 border border-green-500/30 text-green-400 px-4 py-3 rounded-lg shadow-lg max-w-md animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5" />
            <span className="text-sm font-medium">{showSuccessToast}</span>
          </div>
        </div>
      )}

      <table className="w-full">
        <thead className="bg-[#111827]">
          <tr className="text-left text-gray-400">
            <th className="px-6 py-4">Applicant</th>
            <th className="px-6 py-4">Company</th>
           
            <th className="px-6 py-4">Stage</th>
            <th className="px-6 py-4">Applied</th>
            <th className="px-6 py-4">Match Score</th>
            <th className="px-6 py-4 text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          {applications.length === 0 ? (
            <tr>
              <td colSpan={7} className="h-[320px] text-center">
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
              const isUpdating = updatingStatus === application._id;
              const isOpen = openDropdown === application._id;
              
              // Get applicant data from the applicant object
              const applicant = application.applicant || {};
              const applicantName = applicant?.name || "Unknown";
              const applicantImage = applicant?.profileImage || null;
              const applicantUserId = applicant?.userId || null;
              
              // Get job details
              const jobDetails = application.job || application.jobDetails || {};
              const receiverProfile = jobDetails.receiverProfile || {};
              
              // Get job title from jobDetails
              const jobRole = jobDetails.jobTitle?.[0] || jobDetails.jobRoles?.[0] || "N/A";
              
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
              const appliedDate = application.createdAt || application.statusHistory?.[0]?.date;
              
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

              return (
                <tr
                  key={application._id}
                  className="border-t border-slate-800 hover:bg-slate-800/30 transition-colors cursor-pointer"
                  onClick={() => handleRowClick(application._id)}
                >
                  {/* Applicant Column */}
                  <td className="px-6 py-4">
                    <div 
                      className="flex items-center gap-3 cursor-pointer"
                      onClick={(e) => handleProfileClick(e, applicantUserId)}
                    >
                      {applicantImage ? (
                        <Image
                          src={applicantImage}
                          alt={applicantName}
                          width={40}
                          height={40}
                          className="h-10 w-10 rounded-full object-cover border border-gray-600/30"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center border border-gray-600/30">
                          <span className="text-blue-400 font-medium text-sm">
                            {getInitials(applicantName)}
                          </span>
                        </div>
                      )}
                      <div>
                        <span className="text-white font-medium hover:text-blue-400 transition-colors">
                          {applicantName}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Company Column */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="text-white">{referralCompany}</span>
                      {jobDetails.isAskForReferral && (
                        <span className="text-[10px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20">
                          Referral
                        </span>
                      )}
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

                  {/* Actions Column */}
                  <td className="px-6 py-4">
                    <div className="relative" ref={isOpen ? dropdownRef : undefined}>
                      <button
                        onClick={(e) => handleUpdateClick(e, application._id)}
                        disabled={isUpdating}
                        className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#0F1115] px-4 py-2 text-sm font-medium text-white transition-all hover:bg-[#171A20] hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUpdating ? (
                          <>
                            <RefreshCw className="h-4 w-4 animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <RefreshCw className="h-4 w-4" />
                            Update
                            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                          </>
                        )}
                      </button>

                      {/* Dropdown Menu */}
                      {isOpen && !isUpdating && (
                        <div className="absolute right-0 mt-2 w-64 max-h-80 overflow-y-auto rounded-lg border border-slate-700 bg-[#0F1115] shadow-xl z-50 py-1">
                          <div className="px-3 py-2 text-xs text-gray-500 border-b border-slate-700">
                            Change Status
                          </div>
                          {statusOptions.map((status) => {
                            const isSelected = status === currentStatus;
                            
                            return (
                              <button
                                key={status}
                                onClick={(e) => handleStatusUpdate(e, application._id, status)}
                                className={`w-full flex items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-slate-800/50 ${
                                  isSelected ? 'text-white bg-slate-800/30' : 'text-gray-300'
                                }`}
                              >
                                <span className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${statusColors[status]?.split(' ')[0] || 'bg-gray-500'}`} />
                                  {status}
                                </span>
                                {isSelected && <Check className="h-4 w-4 text-green-400" />}
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