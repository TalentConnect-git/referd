// components/professional/IncomingRequestCard.tsx
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
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
  XCircle,
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
  onStatusUpdate,
}) => {
  const router = useRouter();
  const { profile } = useAuth();
  const role = profile?.profileType || "professional";
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    applicant,
    job,
    matchScore,
    createdAt,
    adminComment,
    rating,
    applicantType,
    _id: applicationId,
    currentStatus,
  } = application || {};

  const applicantName = applicant?.name || "N/A";
  const profileImage = applicant?.profileImage || null;

  const jobTitle = Array.isArray(job?.jobTitle)
    ? job.jobTitle[0]
    : job?.jobTitle || "N/A";
  const companyName = job?.companyName || null;

  const education: Education = applicant?.educations?.[0] || {};
  const collegeName = education?.college || "N/A";

  const isAlreadyReferred = currentStatus === "Referred To Company";
  const isRejected = currentStatus === "Rejected";

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCardClick = () => {
    if (applicationId) {
      router.push(`/${role}/applications/${applicationId}`);
    }
  };

  const getMatchScoreColor = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "text-green-400";
    if (numericScore >= 40) return "text-orange-400";
    return "text-red-400";
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
        toast.success(
          `Application ${status === "Referred To Company" ? "referred" : "rejected"} successfully!`,
        );

        if (onStatusUpdate) {
          onStatusUpdate(applicationId, status);
        }
      } else {
        throw new Error("Failed to update status");
      }
    } catch (error: any) {
      console.error("Failed to update application status:", error);
      toast.error(
        error?.response?.data?.msg ||
          error?.message ||
          "Failed to update status. Please try again.",
      );
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
              star <= numRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
        <span className="text-[10px] text-gray-500 ml-1">
          {numRating}/5
        </span>
      </div>
    );
  };

  return (
    <div
      onClick={handleCardClick}
      className="px-4 py-3 hover:bg-[#111a2e] transition-colors duration-150 border-b border-[#1e293b] last:border-b-0 cursor-pointer"
    >
      <div className="flex items-center gap-4">
        {/* Profile Image */}
        <div className="flex-shrink-0">
          {profileImage ? (
            <Image
              src={profileImage}
              alt={applicantName}
              width={36}
              height={36}
              className="w-9 h-9 rounded-full object-cover border border-blue-500/30 hover:border-blue-500/60 transition-all"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 flex items-center justify-center border border-blue-500/30">
              <span className="text-blue-400 font-semibold text-sm">
                {applicantName?.charAt(0)?.toUpperCase() || "A"}
              </span>
            </div>
          )}
        </div>

        {/* Name */}
        <div className="min-w-0 flex-1 max-w-[150px]">
          <p className="font-medium text-white text-sm truncate">
            {applicantName}
          </p>
        </div>

        {/* Job Title */}
        <div className="hidden sm:flex min-w-0 flex-1 max-w-[150px]">
          <p className="text-xs text-gray-400 truncate flex items-center gap-1.5">
            <Briefcase className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <span className="truncate">{jobTitle}</span>
          </p>
        </div>

        {/* Education */}
        <div className="hidden md:flex min-w-0 flex-1 max-w-[150px]">
          <p className="text-xs text-gray-400 truncate flex items-center gap-1.5">
            <GraduationCap className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            <span className="truncate">{collegeName}</span>
          </p>
        </div>

        {/* Match Score */}
        <div className="flex flex-col items-center flex-shrink-0 min-w-[50px]">
          <span className={`text-sm font-bold ${getMatchScoreColor(matchScore)}`}>
            {matchScore || 0}%
          </span>
        </div>

        {/* Rating */}
        <div className="hidden lg:flex flex-shrink-0 min-w-[100px] items-center">
          {rating && rating > 0 ? (
            renderStars(rating)
          ) : (
            <span className="text-[10px] text-gray-500">No rating</span>
          )}
        </div>

        {/* Created At */}
        <div className="hidden xl:flex flex-shrink-0 min-w-[90px]">
          <p className="text-xs text-gray-400 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-gray-500 flex-shrink-0" />
            {formatDateToIST(createdAt)}
          </p>
        </div>

        {/* Action Button / Dropdown */}
        <div className="flex-shrink-0 relative" ref={dropdownRef}>
          {isAlreadyReferred ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-lg">
              <CheckCircle className="w-3.5 h-3.5 text-green-400" />
              <span className="text-xs font-medium text-green-400 whitespace-nowrap">
                Referred
              </span>
            </div>
          ) : isRejected ? (
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/10 border border-red-500/30 rounded-lg">
              <XCircle className="w-3.5 h-3.5 text-red-400" />
              <span className="text-xs font-medium text-red-400 whitespace-nowrap">
                Rejected
              </span>
            </div>
          ) : (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                disabled={isUpdating}
                className="
                  flex items-center gap-1.5 px-3 py-1.5
                  bg-green-500/10 hover:bg-green-500/20 
                  border border-green-500/30
                  text-green-400 rounded-lg text-xs font-medium
                  transition-all duration-200 hover:scale-105
                  disabled:opacity-50 disabled:cursor-not-allowed
                  whitespace-nowrap
                "
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  <>
                    <User className="w-3.5 h-3.5" />
                    Action
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform ${showDropdown ? "rotate-180" : ""}`}
                    />
                  </>
                )}
              </button>

              {/* Dropdown - Opens upward */}
              {showDropdown && !isUpdating && (
                <div className="absolute right-0 bottom-full mb-1 w-40 bg-[#1e293b] border border-[#334155] rounded-lg shadow-xl z-50 overflow-hidden">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate("Referred To Company");
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-green-400 hover:bg-green-500/10 transition-colors flex items-center gap-2"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Refer
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStatusUpdate("Rejected");
                    }}
                    className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-500/10 transition-colors flex items-center gap-2 border-t border-[#334155]"
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