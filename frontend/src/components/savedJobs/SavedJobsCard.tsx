"use client";

import { SavedJobCardProps } from "@/types/savedjobs";
import {
  MapPin,
  Briefcase,
  Clock,
  BookmarkCheck,
  BookmarkX,
  ChevronRight,
} from "lucide-react";

export default function SavedJobCard({
  savedJob,
  onUnsave,
  onClick,
}: SavedJobCardProps) {
  const job = savedJob.job;
  const matchScore = savedJob.matchScore;

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
    if (numericScore >= 75) return "High";
    if (numericScore >= 40) return "Medium";
    return "Low";
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
        rounded-xl
        border
        border-theme
        bg-card
        p-3
        transition-all
        duration-200
        hover:border-primary/50
        hover:shadow-md
        hover:-translate-y-0.5
        relative
        group
      "
    >
      {/* Row 1: Company & Title + Match Score & Saved Badge */}
      <div className="flex justify-between items-start">
        <div className="flex gap-2.5 min-w-0 flex-1">
          {/* Company Avatar - Smaller */}
          <div
            className="
              h-8
              w-8
              rounded-lg
              border
              border-theme
              text-muted
              flex
              items-center
              justify-center
              text-xs
              font-bold
              bg-background-soft
              flex-shrink-0
            "
          >
            {company?.charAt(0).toUpperCase() || "?"}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-semibold text-primary truncate pr-2">
              {job?.jobRoles?.[0] || job?.jobTitle?.[0] || "Untitled Job"}
            </h3>
            <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
              <p className="text-[10px] text-secondary truncate">{company}</p>

              {/* Job Type Badge - Smaller */}
              {job?.jobType && (
                <>
                  <span className="text-[8px] text-muted">•</span>
                  <span className="badge badge-info text-[8px] px-1.5 py-0.5 rounded-full border border-info/20 whitespace-nowrap">
                    {getJobTypeLabel()}
                  </span>
                </>
              )}

              {/* Work Mode - Smaller */}
              {job?.workMode?.[0] && (
                <>
                  <span className="text-[8px] text-muted">•</span>
                  <div className="flex items-center gap-0.5 text-[10px] text-secondary">
                    <Briefcase className="w-2.5 h-2.5 text-muted" />
                    <span className="capitalize">{job.workMode[0]}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Match Score & Saved Badge - Smaller */}
        <div className="flex items-center gap-1.5 ml-1.5 flex-shrink-0">
          {/* Match Score - Smaller */}
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
                px-1.5
                py-0.5
                text-[9px]
                font-medium
                text-primary
                whitespace-nowrap
                gap-0.5
              "
            >
              <span className={getMatchScoreColor(matchScore)}>
                {matchScore}%
              </span>
            </div>
          )}

          {/* Saved Badge - Smaller */}
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
              px-2
              py-0.5
              text-[9px]
              font-medium
              text-success
              whitespace-nowrap
              gap-0.5
            "
          >
            <BookmarkCheck className="w-2.5 h-2.5" />
            Saved
          </div>
        </div>
      </div>

      {/* Divider - Thinner */}
      <div className="mt-2 border-t border-divider pt-2" />

      {/* Row 2: All elements in a single flex row - Compact */}
      <div className="flex items-center justify-between gap-1.5 flex-wrap">
        {/* Left Side: Location, Posted By, Package */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {job?.location?.[0] && (
            <div className="flex items-center gap-0.5 text-[10px] text-secondary">
              <MapPin className="w-2.5 h-2.5 text-muted" />
              <span className="truncate max-w-[80px]">{job.location[0]}</span>
            </div>
          )}

          {job?.postedBy && (
            <>
              <span className="text-[8px] text-muted">•</span>
              <div className="flex items-center gap-0.5 text-[10px] text-secondary">
                <Clock className="w-2.5 h-2.5 text-muted" />
                <span className="truncate max-w-[60px]">By {job.postedBy}</span>
              </div>
            </>
          )}

          {/* Package Details - Compact */}
          {packageDisplay && (
            <>
              <span className="text-[8px] text-muted">•</span>
              <div className="flex items-center gap-0.5">
                <span className="text-[10px] font-semibold text-primary whitespace-nowrap">
                  {packageDisplay}
                </span>
                {job?.packageDetails?.totalCTC && (
                  <span className="text-[8px] text-muted font-medium">CTC</span>
                )}
              </div>
            </>
          )}

          {/* Match Score Label - Compact */}
          {matchScore !== undefined && matchScore !== null && (
            <>
              <span className="text-[8px] text-muted">•</span>
              <div className="flex items-center gap-1.5">
                <div className="w-10 h-1 bg-background-soft rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${getMatchScoreBg(matchScore)}`}
                    style={{
                      width: `${Math.min(Math.max(Number(matchScore) || 0, 0), 100)}%`,
                      transition: "width 0.5s ease-in-out",
                    }}
                  />
                </div>
                <span
                  className={`text-[8px] font-medium ${getMatchScoreColor(matchScore)}`}
                >
                  {getMatchScoreLabel(matchScore)}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Right Side: Unsave Button & View Details - Compact */}
        <div className="flex items-center gap-1 flex-shrink-0">
          {/* Unsave Button - Smaller */}
          <button
            onClick={handleUnsave}
            className="
              btn-danger
              inline-flex
              items-center
              gap-1
              rounded-lg
              border
              border-danger/30
              bg-danger-soft
              px-2
              py-1
              text-[9px]
              font-medium
              text-danger
              transition-all
              duration-200
              hover:bg-danger-soft
              hover:border-danger/50
              hover:shadow-md
              hover:shadow-danger/10
              group/unsave
            "
          >
            <BookmarkX className="w-3 h-3" />
            Unsave
          </button>

          {/* View Details Link - Smaller */}
          <span
            className="
              text-[9px]
              text-secondary 
              font-medium 
              transition-all 
              duration-200 
              hover:text-primary 
              inline-flex
              items-center
              gap-0
              whitespace-nowrap
            "
          >
            View
            <ChevronRight className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
}