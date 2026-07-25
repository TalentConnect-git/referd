"use client";

import { SavedJobCardProps } from "@/types/savedjobs";
import {
  MapPin,
  Briefcase,
  Clock,
  BookmarkCheck,
  BookmarkX,
} from "lucide-react";

export default function SavedJobCard({
  savedJob,
  onUnsave,
  onClick,
}: SavedJobCardProps) {
  const job = savedJob.job;
  const matchScore = savedJob.matchScore; // <-- Get matchScore from savedJob root

  const company =
    job?.companyPosted?.companyDetails?.companyName ||
    job?.candidatePosted?.currentCompany ||
    job?.companyName ||
    "Unknown Company";

  // Format currency
  const formatCurrency = (amount: number, currency: string = "INR") => {
    if (!amount) return null;
    const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";
    if (amount >= 10000000) {
      return `${symbol}${(amount / 10000000).toFixed(1)} Cr`;
    } else if (amount >= 100000) {
      return `${symbol}${(amount / 100000).toFixed(1)} L`;
    }
    return `${symbol}${amount.toLocaleString()}`;
  };

  // Get package display
  const getPackageDisplay = () => {
    const packageDetails = job?.packageDetails || job?.package;
    if (!packageDetails) return null;

    const {
      currency = "INR",
      totalCTC,
      fixedPay,
      joiningBonus,
    } = packageDetails;

    if (totalCTC) {
      return formatCurrency(totalCTC, currency);
    }
    if (fixedPay && joiningBonus) {
      return `${formatCurrency(fixedPay, currency)} + ${formatCurrency(joiningBonus, currency)} bonus`;
    }
    if (fixedPay) {
      return formatCurrency(fixedPay, currency);
    }
    return null;
  };

  const packageDisplay = getPackageDisplay();

  // Get job type label
  const getJobTypeLabel = () => {
    const jobType = job?.jobType || job?.broadcastType;
    if (jobType === "referral" || jobType === "Referral") return "Referral";
    if (jobType === "offcampus" || jobType === "Off-campus")
      return "Off-Campus";
    if (jobType === "internship" || jobType === "Internship")
      return "Internship";
    return jobType || "Job";
  };

  // Get match score color
  const getMatchScoreColor = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "text-success";
    if (numericScore >= 40) return "text-warning";
    return "text-danger";
  };

  const getMatchScoreBg = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "bg-success";
    if (numericScore >= 40) return "bg-warning";
    return "bg-danger";
  };

  const getMatchScoreLabel = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "High Match";
    if (numericScore >= 40) return "Medium Match";
    return "Low Match";
  };

  const handleUnsave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUnsave(job._id);
  };

  return (
    <div
      onClick={onClick}
      className="
        card
        cursor-pointer
        rounded-2xl
        border
        border-theme
        bg-card
        p-4
        transition-all
        duration-200
        hover:border-primary/50
        hover:shadow-lg
        hover:shadow-primary/5
        relative
        group
        mb-3
      "
    >
      {/* Row 1: Company & Title + Match Score & Saved Badge */}
      <div className="flex justify-between items-start">
        <div className="flex gap-3 min-w-0 flex-1">
          {/* Company Avatar */}
          <div
            className="
              h-10
              w-10
              rounded-xl
              border
              border-theme
              text-muted
              flex
              items-center
              justify-center
              text-base
              font-bold
              bg-background-soft
              flex-shrink-0
            "
          >
            {company?.charAt(0).toUpperCase() || "?"}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-primary truncate pr-2">
              {job?.jobRoles?.[0] || job?.jobTitle?.[0] || "Untitled Job"}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs text-secondary truncate">{company}</p>

              {/* Job Type Badge */}
              {job?.jobType && (
                <>
                  <div className="w-px h-3 bg-divider" />
                  <span className="badge badge-info text-[10px] px-2 py-0.5 rounded-full border border-info/20 whitespace-nowrap">
                    {getJobTypeLabel()}
                  </span>
                </>
              )}

              {/* Work Mode */}
              {job?.workMode?.[0] && (
                <>
                  <div className="w-px h-3 bg-divider" />
                  <div className="flex items-center gap-1 text-secondary text-xs">
                    <Briefcase className="w-3 h-3 text-muted" />
                    <span className="capitalize">{job.workMode[0]}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Match Score & Saved Badge */}
        <div className="flex items-center gap-2 ml-2 flex-shrink-0">
          {/* Match Score - Using matchScore from savedJob root */}
          {matchScore !== undefined && matchScore !== null && (
            <div
              className="
                badge
                badge-primary
                inline-flex
                items-center
                rounded-full
                border
                border-primary/30
                bg-primary-soft
                px-2
                py-0.5
                text-xs
                font-medium
                text-primary
                whitespace-nowrap
                gap-1
              "
            >
              <span className={getMatchScoreColor(matchScore)}>
                {matchScore}%
              </span>
            </div>
          )}

          {/* Saved Badge */}
          <div
            className="
              badge
              badge-success
              inline-flex
              items-center
              rounded-full
              border
              border-success/30
              bg-success-soft
              px-2.5
              py-0.5
              text-xs
              font-medium
              text-success
              whitespace-nowrap
              gap-1
            "
          >
            <BookmarkCheck className="w-3 h-3" />
            Saved
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="mt-2.5 pt-2.5 border-t border-divider" />

      {/* Row 2: All elements in a single flex row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Left Side: Location, Posted By, Employment Type, Package */}
        <div className="flex items-center gap-2 flex-wrap">
          {job?.location?.[0] && (
            <div className="flex items-center gap-1 text-secondary text-xs">
              <MapPin className="w-3 h-3 text-muted" />
              <span className="truncate max-w-[100px]">{job.location[0]}</span>
            </div>
          )}

          {job?.postedBy && (
            <>
              <div className="w-px h-3 bg-divider" />
              <div className="flex items-center gap-1 text-secondary text-xs">
                <Clock className="w-3 h-3 text-muted" />
                <span>By {job.postedBy}</span>
              </div>
            </>
          )}

          {/* Package Details */}
          {packageDisplay && (
            <>
              <div className="w-px h-3 bg-divider" />
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-primary whitespace-nowrap">
                  {packageDisplay}
                </span>
                {job?.packageDetails?.totalCTC && (
                  <span className="text-[10px] text-muted font-medium">
                    CTC
                  </span>
                )}
              </div>
            </>
          )}

          {/* Match Score Label - Using matchScore from savedJob root */}
          {matchScore !== undefined && matchScore !== null && (
            <>
              <div className="w-px h-3 bg-divider" />
              <div className="flex items-center gap-2">
                <div className="w-12 h-1.5 bg-background-soft rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getMatchScoreBg(matchScore)}`}
                    style={{
                      width: `${Math.min(Math.max(Number(matchScore) || 0, 0), 100)}%`,
                      transition: "width 0.5s ease-in-out",
                    }}
                  />
                </div>
                <span
                  className={`text-[10px] font-medium ${getMatchScoreColor(matchScore)}`}
                >
                  {getMatchScoreLabel(matchScore)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right Side: Unsave Button & View Details */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Unsave Button */}
          <button
            onClick={handleUnsave}
            className="
              btn-danger
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              border
              border-danger/30
              bg-danger-soft
              px-3
              py-1.5
              text-xs
              font-medium
              text-danger
              transition-all
              duration-200
              hover:bg-danger-soft
              hover:border-danger/50
              hover:shadow-lg
              hover:shadow-danger/10
              group/unsave
            "
          >
            <BookmarkX className="w-3.5 h-3.5" />
            Unsave
          </button>

          {/* View Details Link */}
          <span
            className="
              text-xs
              text-secondary 
              font-medium 
              transition-all 
              duration-200 
              hover:text-primary 
              inline-flex
              items-center
              gap-0.5
              whitespace-nowrap
            "
          >
            View
            <svg
              className="w-3 h-3 transition-transform duration-200 group-hover:translate-x-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}