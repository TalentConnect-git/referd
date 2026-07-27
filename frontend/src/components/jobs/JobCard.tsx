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
  ChevronRight,
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
      background: "var(--card)",
      color: "var(--text-primary)",
      border: "1px solid var(--info-border)",
      borderRadius: "8px",
      padding: "10px 16px",
    },
  });
};

const showSuccessToast = (message: string) => {
  toast.success(message, {
    duration: 3000,
    style: {
      background: "var(--card)",
      color: "var(--text-primary)",
      border: "1px solid var(--success-border)",
      borderRadius: "8px",
      padding: "10px 16px",
    },
  });
};

const showErrorToast = (message: string) => {
  toast.error(message, {
    duration: 3000,
    style: {
      background: "var(--card)",
      color: "var(--text-primary)",
      border: "1px solid var(--danger-border)",
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

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  // Get match score color and label
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

  const getMatchScoreBorder = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "border-success-border";
    if (numericScore >= 40) return "border-warning-border";
    return "border-danger-border";
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
        card group relative cursor-pointer
        rounded-xl p-3
        transition-all duration-300
        hover:border-primary/40
        hover:shadow-md
        hover:-translate-y-0.5
        ${isRemovingCard || isRemoving ? 
          'pointer-events-none scale-95 opacity-0' : 
          'scale-100 opacity-100'
        }
        ${isRemovingCard ? 'm-0 max-h-0 overflow-hidden border-0 p-0' : ''}
      `}
      style={{
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      {/* Row 1: Company & Title + Match Score */}
      <div className="flex items-start justify-between">
        <div className="flex min-w-0 flex-1 gap-2.5">
          {/* Company Avatar - Smaller */}
          <div
            className="
              flex h-8 w-8 flex-shrink-0 items-center
              justify-center rounded-lg border border-theme
              bg-background-soft text-xs font-bold text-secondary
            "
          >
            {company?.charAt(0).toUpperCase() || "?"}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate pr-2 text-sm font-semibold text-primary">
              {title}
            </h3>
            <div className="mt-0.5 flex flex-wrap items-center gap-1.5">
              <p className="truncate text-[10px] text-muted">{company}</p>

              {workMode && (
                <>
                  <span className="text-[8px] text-muted">•</span>
                  <div className="flex items-center gap-0.5 text-[10px] text-muted">
                    <Briefcase className="h-2.5 w-2.5" />
                    <span className="capitalize">{workMode}</span>
                  </div>
                </>
              )}

              {location && (
                <>
                  <span className="text-[8px] text-muted">•</span>
                  <div className="flex items-center gap-0.5 text-[10px] text-muted">
                    <MapPin className="h-2.5 w-2.5" />
                    <span className="max-w-[80px] truncate">{location}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Match Score - Smaller */}
        {matchScore !== undefined && matchScore !== null && (
          <div className="ml-1.5 flex flex-shrink-0 flex-col items-end gap-0.5">
            <div
              className={`
                inline-flex items-center rounded-full border
                px-2 py-0.5 text-[9px] font-bold whitespace-nowrap
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
            <span className={`text-[8px] font-medium ${matchColor}`}>
              {matchLabel}
            </span>
          </div>
        )}
      </div>

      {/* Divider - Thinner */}
      <div className="mt-2 border-t border-divider pt-2" />
      
      {/* Row 2: ALL elements in a single flex row - Compact */}
      <div className="flex flex-wrap items-center justify-between gap-1.5">
        {/* Left Side: Location, Posted By, Secondary Info */}
        <div className="flex flex-wrap items-center gap-1.5">
          {postedBy && (
            <>
              <div className="flex items-center gap-0.5 text-[10px] text-muted">
                <User className="h-2.5 w-2.5" />
                <span className="truncate max-w-[60px]">{postedBy}</span>
              </div>
              <span className="text-[8px] text-muted">•</span>
            </>
          )}

          {/* Alumni Count - Compact */}
          {alumniCount !== undefined && alumniCount !== null && alumniCount > 0 && (
            <>
              <div className="flex items-center gap-0.5 text-[10px]">
                <Users className="h-2.5 w-2.5 text-primary" />
                <span className="badge badge-success rounded-full px-1.5 py-0 text-[8px] font-semibold">
                  {alumniCount}
                </span>
              </div>
              <span className="text-[8px] text-muted">•</span>
            </>
          )}

          {/* Package Details - Compact */}
          {packageDisplay && (
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-semibold text-primary whitespace-nowrap">
                {packageDisplay}
              </span>
            </div>
          )}
        </div>

        {/* Right Side: Save Button & View Details - Compact */}
        <div className="flex flex-shrink-0 items-center gap-1">
          {/* Save Button - Smaller */}
          {jobId && (
            <button
              onClick={handleSaveToggle}
              disabled={isSaving || isRemovingCard}
              className="
                relative rounded-full p-1
                transition-all duration-200
                hover:bg-card-hover
                disabled:cursor-not-allowed disabled:opacity-50
              "
              aria-label={saved ? "Unsave job" : "Save job"}
            >
              {isSaving ? (
                <Loader2 className="h-3 w-3 animate-spin text-muted" />
              ) : saved ? (
                <BookmarkCheck className="h-3 w-3 fill-success text-success" />
              ) : (
                <Bookmark className="h-3 w-3 text-muted transition-colors hover:text-primary" />
              )}
            </button>
          )}

          {/* View Details Link - Smaller */}
          <span
            className="
              inline-flex items-center gap-0
              whitespace-nowrap text-[9px] font-medium
              text-muted transition-all duration-200
              hover:text-primary
            "
          >
            View
            <ChevronRight className="h-3 w-3" />
          </span>
        </div>
      </div>

      {/* Remove indicator badge */}
      {isRemovingCard && (
        <div className="absolute inset-0 flex items-center justify-center rounded-xl bg-card/80 backdrop-blur-sm">
          <div className="flex items-center gap-2 text-primary">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-xs font-medium">Removing...</span>
          </div>
        </div>
      )}
    </div>
  );
}