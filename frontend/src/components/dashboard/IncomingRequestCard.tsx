// components/professional/IncomingRequestCard.tsx
"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  Briefcase,
  Building2,
  CheckCircle,
  ChevronDown,
  GraduationCap,
  Loader2,
  MessageSquare,
  Star,
  User,
  XCircle,
} from "lucide-react";
import toast from "react-hot-toast";

import { updateApplicationStatus } from "@/services/application.service";
import { useAuth } from "@/context/AuthContext";
import type { IncomingRequestCardProps } from "@/types/applications";

interface Education {
  _id?: string;
  college?: string;
  degree?: string;
  educationType?: string;
  isCurrent?: boolean;
  yearOfGraduation?: string;
  graduationYear?: string;
  [key: string]: unknown;
}

type MatchLevel = {
  label: "High" | "Medium" | "Low";
  scoreClass: string;
  badgeClass: string;
  dotClass: string;
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

const IncomingRequestCard: React.FC<IncomingRequestCardProps> = ({
  application,
  onStatusUpdate,
}) => {
  const router = useRouter();
  const { profile } = useAuth();

  const role = profile?.profileType || "professional";

  const [isUpdating, setIsUpdating] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const {
    applicant,
    job,
    matchScore,
    adminComment,
    rating,
    _id: applicationId,
    currentStatus,
  } = application || {};

  const applicantName = applicant?.name?.trim() || "N/A";
  const profileImage = applicant?.profileImage || null;
  const currentCompany = applicant?.currentCompany?.trim() || "";

  const jobTitle = Array.isArray(job?.jobTitle)
    ? job.jobTitle[0]?.trim() || "N/A"
    : job?.jobTitle?.trim() || "N/A";

  const education: Education = applicant?.educations?.[0] || {};
  const collegeName = education?.college?.trim() || "";

  const hasCollege = Boolean(collegeName);
  const hasCurrentCompany = Boolean(currentCompany);

  const numericMatchScore = Math.max(
    0,
    Math.min(Number(matchScore) || 0, 100),
  );

  const numericRating = Math.max(
    0,
    Math.min(Number(rating) || 0, 5),
  );

  const isAlreadyReferred =
    currentStatus === "Referred To Company";

  const isRejected = currentStatus === "Rejected";

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
    if (!applicationId) return;

    router.push(`/${role}/applications/to-me/${applicationId}`);
  };

  const getMatchLevel = (score: number): MatchLevel => {
    if (score >= 75) {
      return {
        label: "High",
        scoreClass: "text-green-400",
        badgeClass:
          "border-green-500/30 bg-green-500/10 text-green-400",
        dotClass: "bg-green-400",
      };
    }

    if (score >= 40) {
      return {
        label: "Medium",
        scoreClass: "text-orange-400",
        badgeClass:
          "border-orange-500/30 bg-orange-500/10 text-orange-400",
        dotClass: "bg-orange-400",
      };
    }

    return {
      label: "Low",
      scoreClass: "text-red-400",
      badgeClass:
        "border-red-500/30 bg-red-500/10 text-red-400",
      dotClass: "bg-red-400",
    };
  };

  const matchLevel = getMatchLevel(numericMatchScore);

  const handleStatusUpdate = async (status: string) => {
    if (!applicationId) {
      toast.error("Application ID is missing");
      return;
    }

    setIsUpdating(true);
    setShowDropdown(false);

    try {
      const response = await updateApplicationStatus(
        applicationId,
        status,
      );

      if (!response?.success && response?.status !== 200) {
        throw new Error("Failed to update status");
      }

      const statusText =
        status === "Referred To Company"
          ? "referred"
          : "rejected";

      toast.success(
        `Application ${statusText} successfully!`,
      );

      onStatusUpdate?.(applicationId, status);
    } catch (error: unknown) {
      console.error(
        "Failed to update application status:",
        error,
      );

      const requestError = error as RequestError;

      const errorMessage =
        requestError.response?.data?.msg ||
        requestError.response?.data?.message ||
        requestError.message ||
        "Failed to update status. Please try again.";

      toast.error(errorMessage);
    } finally {
      setIsUpdating(false);
    }
  };

  const renderStars = (): React.ReactNode => {
    return (
      <div className="flex items-center justify-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-3 w-3 ${
              star <= numericRating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-600"
            }`}
          />
        ))}
      </div>
    );
  };

  const truncateComment = (
    text: string,
    maxLength = 9,
  ): string => {
    if (!text) return "";

    if (text.length <= maxLength) {
      return text;
    }

    return `${text.slice(0, maxLength)}...`;
  };

  return (
    <div
      onClick={handleCardClick}
      className="
        w-full cursor-pointer
        border-b border-[#1e293b]
        px-4 py-3
        transition-colors duration-150
        hover:bg-[#111a2e]
        last:border-b-0
      "
    >
      <div
        className="
          grid w-full items-center gap-x-3

          grid-cols-[minmax(0,1fr)_96px_96px]

          sm:grid-cols-[200px_repeat(2,minmax(90px,1fr))_96px]

          lg:grid-cols-[215px_repeat(3,minmax(90px,1fr))_96px]

          xl:grid-cols-[225px_repeat(4,minmax(90px,1fr))_96px]
        "
      >
        {/* Applicant Details — Leftmost */}
        <div className="flex min-w-0 items-center gap-3 justify-self-start">
          {/* Profile Image */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center">
            {profileImage ? (
              <Image
                src={profileImage}
                alt={applicantName}
                width={36}
                height={36}
                className="
                  h-9 w-9 rounded-full
                  border border-blue-500/30
                  object-cover
                  transition-all
                  hover:border-blue-500/60
                "
              />
            ) : (
              <div
                className="
                  flex h-9 w-9 items-center justify-center
                  rounded-full
                  border border-blue-500/30
                  bg-gradient-to-br
                  from-blue-500/20
                  to-purple-500/20
                "
              >
                <span className="text-sm font-semibold text-blue-400">
                  {applicantName.charAt(0).toUpperCase() || "A"}
                </span>
              </div>
            )}
          </div>

          {/* Name, College and Company */}
          <div className="min-w-0">
            <p
              title={applicantName}
              className="truncate text-sm font-medium text-white"
            >
              {applicantName}
            </p>

            {(hasCollege || hasCurrentCompany) && (
              <div className="mt-0.5 flex min-w-0 items-center gap-1.5">
                {hasCollege && (
                  <div className="flex min-w-0 items-center gap-1">
                    <GraduationCap className="h-3 w-3 shrink-0 text-gray-500" />

                    <span
                      title={collegeName}
                      className="max-w-[70px] truncate text-[9px] text-gray-400"
                    >
                      {collegeName}
                    </span>
                  </div>
                )}

                {hasCollege && hasCurrentCompany && (
                  <span className="shrink-0 text-[10px] text-gray-600">
                    |
                  </span>
                )}

                {hasCurrentCompany && (
                  <div className="flex min-w-0 items-center gap-1">
                    <Building2 className="h-3 w-3 shrink-0 text-gray-500" />

                    <span
                      title={currentCompany}
                      className="max-w-[70px] truncate text-[9px] text-gray-400"
                    >
                      {currentCompany}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Job Title */}
        <div className="hidden min-w-0 items-center justify-center sm:flex">
          <div className="flex max-w-[150px] min-w-0 items-center gap-1.5">
            <Briefcase className="h-3.5 w-3.5 shrink-0 text-gray-500" />

            <span
              title={jobTitle}
              className="truncate text-xs text-gray-400"
            >
              {jobTitle}
            </span>
          </div>
        </div>

        {/* Match Score */}
        <div className="flex min-w-0 items-center justify-center">
          <div className="flex items-center justify-center gap-1.5">
            <span
              className={`whitespace-nowrap text-sm font-bold ${matchLevel.scoreClass}`}
            >
              {numericMatchScore}%
            </span>

            <div
              className={`
                inline-flex h-5 min-w-[58px]
                items-center justify-center gap-1
                rounded-full border
                px-1.5
                text-[9px] font-semibold
                ${matchLevel.badgeClass}
              `}
            >
              <span
                className={`
                  h-1.5 w-1.5 shrink-0 rounded-full
                  ${matchLevel.dotClass}
                `}
              />

              <span>{matchLevel.label}</span>
            </div>
          </div>
        </div>

        {/* Rating */}
        <div className="hidden min-w-0 items-center justify-center lg:flex">
          {numericRating > 0 ? (
            renderStars()
          ) : (
            <span className="whitespace-nowrap text-[10px] text-gray-500">
              No rating
            </span>
          )}
        </div>

        {/* Comment */}
        <div className="hidden min-w-0 items-center justify-center xl:flex">
          {adminComment ? (
            <div
              title={adminComment}
              className="flex max-w-[90px] min-w-0 items-center justify-center gap-1"
            >
              <MessageSquare className="h-3.5 w-3.5 shrink-0 text-gray-500" />

              <span className="truncate text-[10px] text-gray-400">
                {truncateComment(adminComment)}
              </span>
            </div>
          ) : (
            <span className="text-[10px] text-gray-500">
              —
            </span>
          )}
        </div>

        {/* Action — Rightmost */}
        <div
          ref={dropdownRef}
          className="relative flex w-[96px] justify-end justify-self-end"
        >
          {isAlreadyReferred ? (
            <div
              className="
                flex h-8 w-[96px]
                items-center justify-center gap-1.5
                rounded-lg
                border border-green-500/30
                bg-green-500/10
                px-2
              "
            >
              <CheckCircle className="h-3.5 w-3.5 shrink-0 text-green-400" />

              <span className="whitespace-nowrap text-xs font-medium text-green-400">
                Referred
              </span>
            </div>
          ) : isRejected ? (
            <div
              className="
                flex h-8 w-[96px]
                items-center justify-center gap-1.5
                rounded-lg
                border border-red-500/30
                bg-red-500/10
                px-2
              "
            >
              <XCircle className="h-3.5 w-3.5 shrink-0 text-red-400" />

              <span className="whitespace-nowrap text-xs font-medium text-red-400">
                Rejected
              </span>
            </div>
          ) : (
            <>
              <button
                type="button"
                disabled={isUpdating}
                onClick={(event) => {
                  event.stopPropagation();

                  setShowDropdown(
                    (previous) => !previous,
                  );
                }}
                className="
                  flex h-8 w-[96px]
                  items-center justify-center gap-1
                  rounded-lg
                  border border-green-500/30
                  bg-green-500/10
                  px-2
                  text-xs font-medium text-green-400
                  transition-colors duration-200
                  hover:bg-green-500/20
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    <span>Updating</span>
                  </>
                ) : (
                  <>
                    <User className="h-3.5 w-3.5" />

                    <span>Action</span>

                    <ChevronDown
                      className={`
                        h-3.5 w-3.5
                        transition-transform
                        ${
                          showDropdown
                            ? "rotate-180"
                            : ""
                        }
                      `}
                    />
                  </>
                )}
              </button>

              {/* Dropdown - Opens UPWARD */}
              {showDropdown && !isUpdating && (
                <div
                  onClick={(event) =>
                    event.stopPropagation()
                  }
                  className="
                    absolute bottom-full right-0 z-50
                    mb-1 w-40 overflow-hidden
                    rounded-lg
                    border border-[#334155]
                    bg-[#1e293b]
                    shadow-xl
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      handleStatusUpdate(
                        "Referred To Company",
                      )
                    }
                    className="
                      flex w-full items-center gap-2
                      px-4 py-2.5
                      text-left text-xs text-green-400
                      transition-colors
                      hover:bg-green-500/10
                    "
                  >
                    <CheckCircle className="h-3.5 w-3.5" />
                    Refer
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleStatusUpdate("Rejected")
                    }
                    className="
                      flex w-full items-center gap-2
                      border-t border-[#334155]
                      px-4 py-2.5
                      text-left text-xs text-red-400
                      transition-colors
                      hover:bg-red-500/10
                    "
                  >
                    <XCircle className="h-3.5 w-3.5" />
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