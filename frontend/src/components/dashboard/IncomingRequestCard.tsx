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
  CheckCircle 
} from "lucide-react";
import { updateApplicationStatus } from "@/services/application.service";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { IncomingRequestCardProps } from "@/types/applications";

// Define Education type locally or import from types
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
  const [isReferring, setIsReferring] = useState<boolean>(false);

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

  // Extract applicant details
  const applicantName = applicant?.name || "N/A";
  const applicantEmail = applicant?.email || "N/A";
  const applicantPhone = applicant?.phone || "N/A";
  const userId = applicant?.userId || null;

  // Get job title
  const jobTitle = Array.isArray(job?.jobTitle) ? job.jobTitle[0] : job?.jobTitle || "N/A";
  const companyName = job?.companyName || "N/A";
  const isAskForReferral = job?.isAskForReferral;

  // Get education details - FIXED: Properly type the education object
  const education: Education = applicant?.educations?.[0] || {};
  const collegeName = education?.college || "N/A";
  const degree = education?.degree || "";
  const graduationYear = education?.yearOfGraduation || education?.graduationYear || "";

  // Get experience details - FIXED: Properly type the experience object
  const experience: Experience = applicant?.experiences?.find((exp: Experience) => exp.isCurrent) || 
                     applicant?.experiences?.[0] || {};
  const currentRole = experience?.role || "";
  const currentCompany = experience?.company || applicant?.currentCompany || "";

  // Check if already referred
  const isAlreadyReferred = currentStatus === "Referred To Company";

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

  const getMatchScoreLabel = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "High Match";
    if (numericScore >= 40) return "Medium Match";
    return "Low Match";
  };

  // Get status color
  const getStatusColor = (status?: string): string => {
    const statusMap: Record<string, string> = {
      "Application Sent": "bg-blue-500/20 text-blue-400",
      "Applied": "bg-yellow-500/20 text-yellow-400",
      "Referred To Company": "bg-green-500/20 text-green-400",
      "Accepted": "bg-green-500/20 text-green-400",
      "Approved": "bg-green-500/20 text-green-400",
      "Rejected": "bg-red-500/20 text-red-400",
      "Waitlist": "bg-purple-500/20 text-purple-400",
    };
    return statusMap[status || ""] || "bg-gray-500/20 text-gray-400";
  };

  // Format date to IST
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
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      };
      return date.toLocaleString("en-IN", options);
    } catch (error) {
      return "Invalid Date";
    }
  };

  // Handle profile navigation
  const handleProfileClick = (e: React.MouseEvent): void => {
    e.stopPropagation();
    if (userId) {
      router.push(`/${role}/profile/${userId}`);
    }
  };

  // Handle refer button click
  const handleRefer = async (e: React.MouseEvent): Promise<void> => {
    e.stopPropagation();
    
    if (isAlreadyReferred) {
      alert("Already referred to company");
      return;
    }

    if (!applicationId) {
      toast.error("Application ID is missing");
      return;
    }

    setIsReferring(true);
    try {
      const status = "Referred To Company"; 
      const response = await updateApplicationStatus(applicationId, status);
      
      if (response?.success || response?.status === 200) {
        toast.success("Application referred to company successfully!");
        
        // Call parent callback to update status
        if (onStatusUpdate) {
          onStatusUpdate(applicationId, status);
        }
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error: any) {
      console.error("Failed to update application status:", error);
      toast.error(error?.response?.data?.msg || error?.message || "Failed to refer application. Please try again.");
    } finally {
      setIsReferring(false);
    }
  };

  // Render stars for rating
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
    <div className="px-6 py-4 hover:bg-[#111a2e] transition-colors duration-150 border-b border-[#1e293b] last:border-b-0">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
        
        {/* Column 1: Applicant Info (3 cols) */}
        <div className="lg:col-span-3 flex items-start space-x-3">
          <div 
            onClick={handleProfileClick}
            className="flex-shrink-0 cursor-pointer group relative"
          >
            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
              <span className="text-blue-400 font-medium text-sm group-hover:text-blue-300">
                {applicantName?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
            <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <ExternalLink className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
          <div className="min-w-0 flex-1">
            <p 
              onClick={handleProfileClick}
              className="font-medium text-white hover:text-blue-400 cursor-pointer transition-colors truncate"
            >
              {applicantName}
            </p>
            <p className="text-xs text-[#64748b] truncate">{applicantEmail}</p>
            {applicantPhone && (
              <p className="text-xs text-[#64748b] truncate">{applicantPhone}</p>
            )}
          </div>
        </div>

        {/* Column 2: Job & Company (2.5 cols) */}
        <div className="lg:col-span-2.5">
          <p className="font-medium text-white truncate">{jobTitle}</p>
          {companyName && (
            <p className="text-sm text-[#64748b] truncate flex items-center gap-1">
              <Briefcase className="w-3 h-3" />
              {companyName}
            </p>
          )}
          {currentRole && currentCompany && (
            <p className="text-xs text-[#64748b] truncate">
              {currentRole} at {currentCompany}
            </p>
          )}
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(currentStatus)} mt-1`}
          >
            {currentStatus || "Pending"}
          </span>
        </div>

        {/* Column 3: Education (2 cols) */}
        <div className="lg:col-span-2">
          <p className="font-medium text-white truncate flex items-center gap-1">
            <GraduationCap className="w-3.5 h-3.5 text-[#64748b]" />
            {collegeName}
          </p>
          <p className="text-xs text-[#64748b] truncate">
            {degree}{graduationYear ? ` (${graduationYear})` : ""}
          </p>
          {applicantType && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20">
              {applicantType.charAt(0).toUpperCase() + applicantType.slice(1)}
            </span>
          )}
        </div>

        {/* Column 4: Match Score & Rating (2 cols) */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className={`text-2xl font-bold ${getMatchScoreColor(matchScore)}`}>
                  {matchScore || 0}%
                </span>
                <div className="w-12 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getMatchScoreBg(matchScore)}`}
                    style={{ 
                      width: `${Math.min(Math.max(Number(matchScore) || 0, 0), 100)}%`,
                      transition: 'width 0.5s ease-in-out'
                    }}
                  />
                </div>
              </div>
              <span className={`text-[10px] font-medium ${getMatchScoreColor(matchScore)}`}>
                {getMatchScoreLabel(matchScore)}
              </span>
            </div>
            
            {/* Rating */}
            {rating && rating > 0 && (
              <div className="flex flex-col items-center">
                {renderStars(rating)}
                <span className="text-[10px] text-[#64748b]">Rating</span>
              </div>
            )}
          </div>

          {/* Admin Comment */}
          {adminComment && (
            <div className="mt-1 flex items-start gap-1">
              <MessageSquare className="w-3 h-3 text-[#64748b] flex-shrink-0 mt-0.5" />
              <p className="text-xs text-[#94a3b8] truncate">{adminComment}</p>
            </div>
          )}
        </div>

        {/* Column 5: Applied Date & Action (2.5 cols) */}
        <div className="lg:col-span-2.5 flex items-center justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm font-medium text-white flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-[#64748b]" />
              {formatDateToIST(createdAt)}
            </p>
            <p className="text-[10px] text-[#64748b]">Applied on (IST)</p>
          </div>
          
          {/* Refer Button / Status Badge */}
          {isAlreadyReferred ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs font-medium text-green-400 whitespace-nowrap">
                Referred
              </span>
            </div>
          ) : (
            <button
              onClick={handleRefer}
              disabled={isReferring}
              className="
                px-4 
                py-1.5 
                bg-green-500/10 
                hover:bg-green-500/20 
                border 
                border-green-500/30 
                text-green-400 
                rounded-lg 
                text-xs 
                font-medium 
                transition-all 
                duration-200 
                hover:scale-105 
                whitespace-nowrap 
                flex 
                items-center 
                gap-1.5
                disabled:opacity-50
                disabled:cursor-not-allowed
                disabled:hover:scale-100
              "
            >
              {isReferring ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Referring...
                </>
              ) : (
                <>
                  <User className="w-3 h-3" />
                  Refer
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default IncomingRequestCard;