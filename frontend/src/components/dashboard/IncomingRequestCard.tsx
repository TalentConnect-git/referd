// components/professional/IncomingRequestCard.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  User, 
  Briefcase, 
  GraduationCap, 
  Calendar, 
  Star, 
  ExternalLink, 
  MessageSquare, 
  Loader2, 
  CheckCircle,
  ChevronDown,
  XCircle
} from "lucide-react";
import { updateApplicationStatus } from "@/services/application.service";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { IncomingRequestCardProps } from "@/types/applications";

interface Education {
  _id?: string;
  college?: string;
  degree?: string;
  educationType?: string;
  isCurrent?: boolean;
  yearOfGraduation?: string;
  graduationYear?: string;
  [key: string]: any;
}

interface Experience {
  _id?: string;
  company?: string;
  role?: string;
  isCurrent?: boolean;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

const IncomingRequestCard: React.FC<IncomingRequestCardProps> = ({ 
  application, 
  onStatusUpdate 
}) => {
  const router = useRouter();
  const { profile } = useAuth();
  const role = profile?.profileType || "professional";
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);

  const {
    applicant,
    job,
    matchScore,
    createdAt,
    adminComment,
    rating,
    applicantType,
    _id: applicationId,
    currentStatus
  } = application || {};

  const applicantName = applicant?.name || "N/A";
  const userId = applicant?.userId || null;

  const jobTitle = Array.isArray(job?.jobTitle) ? job.jobTitle[0] : job?.jobTitle || "N/A";
  const companyName = job?.companyName || "N/A";

  const education: Education = applicant?.educations?.[0] || {};
  const collegeName = education?.college || "N/A";
  const degree = education?.degree || "";
  const graduationYear = education?.yearOfGraduation || education?.graduationYear || "";

  const isAlreadyReferred = currentStatus === "Referred To Company";
  const isRejected = currentStatus === "Rejected";

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

  const getMatchScoreLabel = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "High Match";
    if (numericScore >= 40) return "Medium Match";
    return "Low Match";
  };

  const formatDateToIST = (dateString?: string): string => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "Invalid Date";
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Kolkata",
        year: "numeric",
        month: "short",
        day: "numeric",
      };
      return date.toLocaleString("en-IN", options);
    } catch (error) {
      return "Invalid Date";
    }
  };

  const handleProfileClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (userId) {
      router.push(`/${role}/profile/${userId}`);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!applicationId) {
      toast.error("Application ID is missing");
      return;
    }

    setIsUpdating(true);
    setShowDropdown(false);
    
    try {
      const response = await updateApplicationStatus(applicationId, status);
      
      if (response?.success || response?.status === 200) {
        toast.success(`Application ${status === "Referred To Company" ? "referred" : "rejected"} successfully!`);
        
        if (onStatusUpdate) {
          onStatusUpdate(applicationId, status);
        }
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error: any) {
      console.error("Failed to update application status:", error);
      toast.error(error?.response?.data?.msg || error?.message || "Failed to update status. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const renderStars = (rating?: number): React.ReactNode => {
    const numRating = Number(rating) || 0;
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-3 h-3 ${
              star <= numRating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="px-4 py-3 hover:bg-[#111a2e] transition-colors duration-150 border-b border-[#1e293b] last:border-b-0">
      <div className="flex items-center gap-4">
        
        {/* Profile Image */}
        <div 
          onClick={handleProfileClick}
          className="flex-shrink-0 cursor-pointer group relative"
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center group-hover:from-blue-500/30 group-hover:to-purple-500/30 transition-all border border-blue-500/30">
            <span className="text-blue-400 font-semibold text-sm group-hover:text-blue-300">
              {applicantName?.charAt(0)?.toUpperCase() || "A"}
            </span>
          </div>
        </div>

        {/* Name & Job Title */}
        <div className="min-w-0 flex-1">
          <p 
            onClick={handleProfileClick}
            className="font-medium text-white hover:text-blue-400 cursor-pointer transition-colors truncate text-sm"
          >
            {applicantName}
          </p>
          <p className="text-xs text-gray-400 truncate flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-gray-500" />
            {jobTitle} • {companyName}
          </p>
        </div>

        {/* Education */}
        <div className="hidden md:block min-w-0 flex-1">
          <p className="text-xs text-gray-300 truncate flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-gray-500 flex-shrink-0" />
            {collegeName}
          </p>
          <p className="text-[10px] text-gray-500 truncate">
            {degree}{graduationYear ? ` (${graduationYear})` : ""}
          </p>
        </div>

        {/* Match Score */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex flex-col items-end">
            <span className={`text-sm font-bold ${getMatchScoreColor(matchScore)}`}>
              {matchScore || 0}%
            </span>
            <span className={`text-[8px] font-medium ${getMatchScoreColor(matchScore)}`}>
              {getMatchScoreLabel(matchScore)}
            </span>
          </div>
          <div className="w-12 h-1 bg-[#1e293b] rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${getMatchScoreBg(matchScore)}`}
              style={{ 
                width: `${Math.min(Math.max(Number(matchScore) || 0, 0), 100)}%`,
                transition: 'width 0.5s ease-in-out'
              }}
            />
          </div>
        </div>

        {/* Rating & Comment */}
        <div className="hidden lg:block flex-shrink-0">
          {rating && rating > 0 && (
            <div className="flex flex-col items-center">
              {renderStars(rating)}
            </div>
          )}
          {adminComment && (
            <div className="flex items-center gap-1 mt-0.5">
              <MessageSquare className="w-3 h-3 text-gray-500" />
              <p className="text-[10px] text-gray-400 truncate max-w-[80px]">{adminComment}</p>
            </div>
          )}
        </div>

        {/* Created At */}
        <div className="hidden xl:block flex-shrink-0">
          <p className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="w-3 h-3 text-gray-500" />
            {formatDateToIST(createdAt)}
          </p>
        </div>

        {/* Action Button / Dropdown */}
        <div className="flex-shrink-0 relative">
          {isAlreadyReferred ? (
            <div className="flex items-center gap-1 px-3 py-1 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs font-medium text-green-400 whitespace-nowrap">
                Referred
              </span>
            </div>
          ) : isRejected ? (
            <div className="flex items-center gap-1 px-3 py-1 bg-red-500/10 border border-red-500/30 rounded-lg">
              <XCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-medium text-red-400 whitespace-nowrap">
                Rejected
              </span>
            </div>
          ) : (
            <>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                disabled={isUpdating}
                className="
                  flex items-center gap-1.5 px-3 py-1.5
                  bg-green-500/10 hover:bg-green-500/20 
                  border border-green-500/30
                  text-green-400 rounded-lg text-xs font-medium
                  transition-all duration-200 hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <User className="w-3 h-3" />
                    Action
                    <ChevronDown className={`w-3 h-3 transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
                  </>
                )}
              </button>

              {/* Dropdown */}
              {showDropdown && !isUpdating && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-[#1e293b] border border-[#334155] rounded-lg shadow-xl z-10 overflow-hidden">
                  <button
                    onClick={() => handleStatusUpdate("Referred To Company")}
                    className="w-full text-left px-4 py-2 text-xs text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Refer
                  </button>
                  <button
                    onClick={() => handleStatusUpdate("Rejected")}
                    className="w-full text-left px-4 py-2 text-xs text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-[#334155]"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomingRequestCard;