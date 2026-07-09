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

  const handleUnsave = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUnsave(job._id);
  };

  return (
    <div
      onClick={onClick}
      className="
        cursor-pointer
        rounded-2xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-4
        transition-all
        duration-200
        hover:border-green-500/50
        hover:shadow-lg
        hover:shadow-green-500/5
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
              border-gray-600/30
              text-gray-300
              flex
              items-center
              justify-center
              text-base
              font-bold
              bg-gray-800/30
              flex-shrink-0
            "
          >
            {company?.charAt(0).toUpperCase() || "?"}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-white truncate pr-2">
              {job?.jobRoles?.[0] || job?.jobTitle?.[0] || "Untitled Job"}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs text-zinc-400 truncate">{company}</p>

              {/* Job Type Badge */}
              {job?.jobType && (
                <>
                  <div className="w-px h-3 bg-[var(--border)]" />
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 whitespace-nowrap">
                    {getJobTypeLabel()}
                  </span>
                </>
              )}

              {/* Work Mode */}
              {job?.workMode?.[0] && (
                <>
                  <div className="w-px h-3 bg-[var(--border)]" />
                  <div className="flex items-center gap-1 text-zinc-400 text-xs">
                    <Briefcase className="w-3 h-3" />
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
                inline-flex
                items-center
                rounded-full
                border
                border-green-500/30
                bg-green-500/10
                px-2
                py-0.5
                text-xs
                font-medium
                text-green-400
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
              inline-flex
              items-center
              rounded-full
              border
              border-green-500/30
              bg-green-500/10
              px-2.5
              py-0.5
              text-xs
              font-medium
              text-green-400
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
      <div className="mt-2.5 pt-2.5 border-t border-[var(--border)]" />

      {/* Row 2: All elements in a single flex row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Left Side: Location, Posted By, Employment Type, Package */}
        <div className="flex items-center gap-2 flex-wrap">
          {job?.location?.[0] && (
            <div className="flex items-center gap-1 text-zinc-400 text-xs">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{job.location[0]}</span>
            </div>
          )}

          {job?.postedBy && (
            <>
              <div className="w-px h-3 bg-[var(--border)]" />
              <div className="flex items-center gap-1 text-zinc-400 text-xs">
                <Clock className="w-3 h-3" />
                <span>By {job.postedBy}</span>
              </div>
            </>
          )}

          

          {/* Package Details */}
          {packageDisplay && (
            <>
              <div className="w-px h-3 bg-[var(--border)]" />
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-white whitespace-nowrap">
                  {packageDisplay}
                </span>
                {job?.packageDetails?.totalCTC && (
                  <span className="text-[10px] text-zinc-500 font-medium">
                    CTC
                  </span>
                )}
              </div>
            </>
          )}

          {/* Match Score Label - Using matchScore from savedJob root */}
          {matchScore !== undefined && matchScore !== null && (
            <>
              <div className="w-px h-3 bg-[var(--border)]" />
              <div className="flex items-center gap-2">
                <div className="w-12 h-1.5 bg-[#1e293b] rounded-full overflow-hidden">
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
              inline-flex
              items-center
              gap-1.5
              rounded-lg
              border
              border-red-500/30
              bg-red-500/10
              px-3
              py-1.5
              text-xs
              font-medium
              text-red-400
              transition-all
              duration-200
              hover:bg-red-500/20
              hover:border-red-500/50
              hover:shadow-lg
              hover:shadow-red-500/10
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
              text-zinc-400 
              font-medium 
              transition-all 
              duration-200 
              hover:text-green-500 
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