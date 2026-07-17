"use client";
import { JobCardProps } from "@/types/jobs";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Loader2,
  MapPin,
  Briefcase,
  Clock,
  User,
  Users,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import toast from "react-hot-toast";

// API Functions
const saveOpportunity = async (jobId: string, jobType: string) => {
  const { data } = await axiosInstance.post(`/application/saveopportunity`, {
    jobId,
    jobType,
  });
  return data;
};

const unsaveJob = async (jobId: string) => {
  const { data } = await axiosInstance.delete(
    `/application/saveopportunity/${jobId}`,
  );
  return data;
};

// Custom toast helpers
const showInfoToast = (message: string) => {
  toast(message, {
    icon: "ℹ️",
    duration: 3000,
    style: {
      background: "#1a2332",
      color: "#fff",
      border: "1px solid #3b82f6",
      borderRadius: "8px",
      padding: "10px 16px",
    },
  });
};

const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: "#1a2332",
      color: "#fff",
      border: "1px solid #22c55e",
      borderRadius: "8px",
      padding: "10px 16px",
    },
  });
};

const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 3000,
    style: {
      background: "#1a2332",
      color: "#fff",
      border: "1px solid #ef4444",
      borderRadius: "8px",
      padding: "10px 16px",
    },
  });
};

export default function JobCard({
  title,
  company,
  location,
  matchScore,
  postedBy,
  secondaryInfo,
  route,
  workMode,
  jobId,
  jobType,
  isSaved = false,
  onSaveToggle,
  packageDetails,
  alumniCount,
  onRemove,
  isRemoving = false,
}: JobCardProps & { 
  onRemove?: (jobId: string) => void;
  isRemoving?: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(isSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingCard, setIsRemovingCard] = useState(false);

  console.log("posted", postedBy);
  console.log("matchscore",matchScore);
  console.log("alumni count",alumniCount);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  // Get match score color and label
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

  const getMatchScoreBorder = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "border-green-500/30";
    if (numericScore >= 40) return "border-orange-500/30";
    return "border-red-500/30";
  };

  const getMatchScoreLabel = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "High Match";
    if (numericScore >= 40) return "Medium Match";
    return "Low Match";
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!jobId) {
      showErrorToast("Job ID is missing");
      return;
    }

    const type = jobType || "offcampus";

    if (saved) {
      setIsSaving(true);
      try {
        const response = await unsaveJob(jobId);
        if (response?.success || response?.status === 200) {
          setSaved(false);
          showSuccessToast("Job removed from saved list");
          if (onSaveToggle) onSaveToggle(jobId, false);
          
          if (onRemove) {
            setIsRemovingCard(true);
            setTimeout(() => {
              onRemove(jobId);
            }, 300);
          }
        } else {
          throw new Error("Failed to unsave job");
        }
      } catch (error: any) {
        console.error("Error unsaving job:", error);
        showErrorToast(
          error?.response?.data?.msg ||
            error?.message ||
            "Failed to unsave job",
        );
      } finally {
        setIsSaving(false);
      }
      return;
    }

    setIsSaving(true);
    try {
      const response = await saveOpportunity(jobId, type);

      if (response?.msg === "Already saved") {
        showInfoToast("Job is already saved");
        setSaved(true);
        if (onSaveToggle) onSaveToggle(jobId, true);
        
        if (onRemove) {
          setIsRemovingCard(true);
          setTimeout(() => {
            onRemove(jobId);
          }, 300);
        }
        return;
      }

      if (response?.success || response?.status === 200) {
        setSaved(true);
        showSuccessToast("Job saved successfully");
        if (onSaveToggle) onSaveToggle(jobId, true);
        
        if (onRemove) {
          setIsRemovingCard(true);
          setTimeout(() => {
            onRemove(jobId);
          }, 300);
        }
      } else {
        throw new Error("Failed to save job");
      }
    } catch (error: any) {
      console.error("Error saving job:", error);

      const errorMsg =
        error?.response?.data?.msg || error?.message || "Failed to save job";

      if (errorMsg === "Already saved" || errorMsg.includes("already saved")) {
        showInfoToast("Job is already saved");
        setSaved(true);
        if (onSaveToggle) onSaveToggle(jobId, true);
        
        if (onRemove) {
          setIsRemovingCard(true);
          setTimeout(() => {
            onRemove(jobId);
          }, 300);
        }
      } else {
        showErrorToast(errorMsg);
      }
    } finally {
      setIsSaving(false);
    }
  };

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
    if (jobType === "referral") return "Referral";
    if (jobType === "offcampus") return "Off-Campus";
    if (jobType === "internship") return "Internship";
    return jobType || "Job";
  };

  const matchColor = getMatchScoreColor(matchScore);
  const matchBg = getMatchScoreBg(matchScore);
  const matchBorder = getMatchScoreBorder(matchScore);
  const matchLabel = getMatchScoreLabel(matchScore);

  return (
    <div
      onClick={() => router.push(`${route}?matchScore=${matchScore ?? 0}`)}
      className={`
        cursor-pointer
        rounded-2xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-4
        transition-all
        duration-300
        hover:border-green-500/50
        hover:shadow-lg
        hover:shadow-green-500/5
        relative
        group
        ${isRemovingCard || isRemoving ? 
          'opacity-0 scale-95 transform pointer-events-none' : 
          'opacity-100 scale-100'
        }
        ${isRemovingCard ? 'max-h-0 overflow-hidden p-0 m-0 border-0' : ''}
      `}
      style={{
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Row 1: Company & Title + Match Score */}
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
              {title}
            </h3>
            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
              <p className="text-xs text-zinc-400 truncate">{company}</p>

              {workMode && (
                <>
                  <div className="w-px h-3 bg-[var(--border)]" />
                  <div className="flex items-center gap-1 text-zinc-400 text-xs">
                    <Briefcase className="w-3 h-3" />
                    <span className="capitalize">{workMode}</span>
                  </div>
                </>
              )}

              {location && (
                <>
                  <div className="w-px h-3 bg-[var(--border)]" />
                  <div className="flex items-center gap-1 text-zinc-400 text-xs">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate max-w-[100px]">{location}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Match Score - With Color Coding */}
        {matchScore !== undefined && matchScore !== null && (
          <div className="flex flex-col items-end gap-0.5 ml-2 flex-shrink-0">
            <div
              className={`
                inline-flex
                items-center
                rounded-full
                border
                px-2.5
                py-0.5
                text-xs
                font-bold
                whitespace-nowrap
                ${matchBorder}
                ${matchColor}
                bg-opacity-10
              `}
              style={{
                backgroundColor: matchScore >= 75 ? 'rgba(34, 197, 94, 0.1)' :
                                 matchScore >= 40 ? 'rgba(251, 146, 60, 0.1)' :
                                 'rgba(239, 68, 68, 0.1)'
              }}
            >
              {matchScore}%
            </div>
            <span className={`text-[9px] font-medium ${matchColor}`}>
              {matchLabel}
            </span>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mt-2.5 pt-2.5 border-t border-[var(--border)]" />
      
      {/* Row 2: ALL elements in a single flex row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Left Side: Location, Posted By, Secondary Info */}
        <div className="flex items-center gap-2 flex-wrap">
          {postedBy && (
            <>
              <div className="w-px h-3 bg-[var(--border)]" />
              <div className="flex items-center gap-1 text-zinc-400 text-xs">
                <User className="w-3 h-3" />
                <span>By {postedBy}</span>
              </div>
            </>
          )}

          {/* Alumni Count */}
          {alumniCount !== undefined && alumniCount !== null && (
            <>
              <div className="w-px h-3 bg-[var(--border)]" />
              <div className="flex items-center gap-1 text-xs">
                <Users className="w-3 h-3 text-green-400" />
                <span className="font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                  {alumniCount} Alumni{alumniCount !== 1 ? "s" : ""}
                </span>
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
                {packageDetails?.totalCTC && (
                  <span className="text-[10px] text-zinc-500 font-medium">
                    CTC
                  </span>
                )}
              </div>
            </>
          )}

          
        </div>

        {/* Right Side: Save Button & View Details */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {/* Save Button */}
          {jobId && (
            <button
              onClick={handleSaveToggle}
              disabled={isSaving || isRemovingCard}
              className="
                p-1.5
                rounded-full
                transition-all
                duration-200
                hover:bg-white/5
                disabled:opacity-50
                disabled:cursor-not-allowed
                relative
              "
              aria-label={saved ? "Unsave job" : "Save job"}
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 text-zinc-400 animate-spin" />
              ) : saved ? (
                <BookmarkCheck className="w-3.5 h-3.5 text-green-500 fill-green-500" />
              ) : (
                <Bookmark className="w-3.5 h-3.5 text-zinc-500 hover:text-white transition-colors" />
              )}
            </button>
          )}

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

      {/* Remove indicator badge */}
      {isRemovingCard && (
        <div className="absolute inset-0 flex items-center justify-center bg-[var(--card)]/80 backdrop-blur-sm rounded-2xl">
          <div className="flex items-center gap-2 text-green-400">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="text-sm font-medium">Removing...</span>
          </div>
        </div>
      )}
    </div>
  );
}