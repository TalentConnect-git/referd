"use client";

import { useRouter } from "next/navigation";
import { InternshipCardProps } from "@/types/internship";
import { useState, useEffect } from "react";
import {
  Bookmark,
  BookmarkCheck,
  Loader2,
  MapPin,
  Clock,
  DollarSign,
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

export default function InternshipCard({
  title,
  company,
  location,
  matchScore,
  secondaryInfo,
  route,
  jobId,
  jobType = "internship",
  isSaved = false,
  onSaveToggle,
  packageDetails,
  duration,
  onRemove,
  isRemoving = false,
  isSavedList = false,
}: InternshipCardProps & {
  jobId?: string;
  jobType?: string;
  isSaved?: boolean;
  onSaveToggle?: (jobId: string, isSaved: boolean) => void;
  packageDetails?: {
    currency?: string;
    totalCTC?: number;
    fixedPay?: number;
    joiningBonus?: number;
    stipend?: number;
  };
  duration?: string;
  onRemove?: (jobId: string) => void;
  isRemoving?: boolean;
  companyLogo?: string;
  isSavedList?: boolean;
}) {
  const router = useRouter();
  const [saved, setSaved] = useState(isSaved);
  const [isSaving, setIsSaving] = useState(false);
  const [isRemovingCard, setIsRemovingCard] = useState(false);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

  const getMatchScoreColor = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "text-[var(--success)]";
    if (numericScore >= 40) return "text-[var(--warning)]";
    return "text-[var(--danger)]";
  };

  const getMatchScoreBg = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "bg-[var(--success)]";
    if (numericScore >= 40) return "bg-[var(--warning)]";
    return "bg-[var(--danger)]";
  };

  const getMatchScoreBorder = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "border-[var(--success-border)]";
    if (numericScore >= 40) return "border-[var(--warning-border)]";
    return "border-[var(--danger-border)]";
  };

  const getMatchScoreLabel = (score?: number): string => {
    const numericScore = Number(score) || 0;
    if (numericScore >= 75) return "High";
    if (numericScore >= 40) return "Medium";
    return "Low";
  };

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!jobId) {
      showErrorToast("Internship ID is missing");
      return;
    }

    const type = jobType || "internship";

    if (saved) {
      setIsSaving(true);
      try {
        const response = await unsaveJob(jobId);
        if (response?.success || response?.status === 200) {
          setSaved(false);
          showSuccessToast("Internship removed from saved list");
          if (onSaveToggle) onSaveToggle(jobId, false);
          if (onRemove) {
            setIsRemovingCard(true);
            setTimeout(() => {
              onRemove(jobId);
            }, 300);
          }
        } else {
          throw new Error("Failed to unsave internship");
        }
      } catch (error: any) {
        console.error("Error unsaving internship:", error);
        showErrorToast(
          error?.response?.data?.msg ||
            error?.message ||
            "Failed to unsave internship",
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
        showInfoToast("Internship is already saved");
        setSaved(true);
        if (onSaveToggle) onSaveToggle(jobId, true);
        if (!isSavedList && onRemove) {
          setIsRemovingCard(true);
          setTimeout(() => {
            onRemove(jobId);
          }, 300);
        }
        return;
      }

      if (response?.success || response?.status === 200) {
        setSaved(true);
        showSuccessToast("Internship saved successfully");
        if (onSaveToggle) onSaveToggle(jobId, true);
        if (!isSavedList && onRemove) {
          setIsRemovingCard(true);
          setTimeout(() => {
            onRemove(jobId);
          }, 300);
        }
      } else {
        throw new Error("Failed to save internship");
      }
    } catch (error: any) {
      console.error("Error saving internship:", error);
      const errorMsg =
        error?.response?.data?.msg ||
        error?.message ||
        "Failed to save internship";

      if (errorMsg === "Already saved" || errorMsg.includes("already saved")) {
        showInfoToast("Internship is already saved");
        setSaved(true);
        if (onSaveToggle) onSaveToggle(jobId, true);
        if (!isSavedList && onRemove) {
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

  const formatCurrency = (amount: number, currency: string = "INR") => {
    if (!amount) return null;
    const symbol = currency === "INR" ? "₹" : currency === "USD" ? "$" : "€";
    if (amount >= 10000000) {
      return `${symbol}${(amount / 10000000).toFixed(1)}Cr`;
    } else if (amount >= 100000) {
      return `${symbol}${(amount / 100000).toFixed(1)}L`;
    }
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getPackageDisplay = () => {
    if (!packageDetails) return null;
    const { currency = "INR", totalCTC, fixedPay, joiningBonus } = packageDetails;
    if (totalCTC) return formatCurrency(totalCTC, currency);
    if (fixedPay && joiningBonus) {
      return `${formatCurrency(fixedPay, currency)} + ${formatCurrency(joiningBonus, currency)}`;
    }
    if (fixedPay) return formatCurrency(fixedPay, currency);
    return null;
  };

  const packageDisplay = getPackageDisplay();
  const matchColor = getMatchScoreColor(matchScore);
  const matchBorder = getMatchScoreBorder(matchScore);
  const matchLabel = getMatchScoreLabel(matchScore);

  return (
    <div
      onClick={() => router.push(route)}
      className={`
        group flex cursor-pointer items-center gap-3
        rounded-xl border border-[var(--border)]
        bg-[var(--card)] px-4 py-3
        transition-all duration-200
        hover:border-[var(--primary-border)]
        hover:bg-[var(--card-hover)]
        hover:shadow-md
        ${isRemovingCard || isRemoving ? "pointer-events-none scale-95 opacity-0" : "scale-100 opacity-100"}
        ${isRemovingCard ? "m-0 max-h-0 overflow-hidden border-0 p-0" : ""}
      `}
    >
      {/* Company Logo */}
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background-soft)] text-sm font-bold text-[var(--text-secondary)]">
        {company?.charAt(0).toUpperCase() || "?"}
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {/* Title & Company */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
            {title || "Untitled Internship"}
          </h3>
          <p className="truncate text-xs text-[var(--text-muted)]">{company}</p>
        </div>

        {/* Location */}
        {location && (
          <div className="hidden items-center gap-1 whitespace-nowrap text-xs text-[var(--text-muted)] sm:flex">
            <MapPin size={12} />
            <span className="max-w-[80px] truncate">{location}</span>
          </div>
        )}

        {/* Duration */}
        {duration && (
          <div className="hidden items-center gap-1 whitespace-nowrap text-xs text-[var(--text-muted)] md:flex">
            <Clock size={12} />
            <span>{duration}</span>
          </div>
        )}

        {/* Package */}
        {packageDisplay && (
          <div className="hidden items-center gap-1 whitespace-nowrap text-xs font-semibold text-[var(--primary)] lg:flex">
           
            <span>{packageDisplay} CTC</span>
          </div>
        )}

        {/* Match Score */}
        {matchScore !== undefined && matchScore !== null && (
          <div className="flex flex-shrink-0 items-center gap-2">
            <span className={`text-xs font-bold ${matchColor}`}>
              {matchScore}%
            </span>
            <span className={`text-[8px] font-medium ${matchColor}`}>
              {matchLabel}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 items-center gap-1.5">
        {/* Save Button */}
        {jobId && (
          <button
            onClick={handleSaveToggle}
            disabled={isSaving || isRemovingCard}
            className="
              rounded-lg p-1.5
              transition-all duration-200
              hover:bg-[var(--primary-soft)]
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
            aria-label={saved ? "Unsave internship" : "Save internship"}
          >
            {isSaving ? (
              <Loader2 className="h-4 w-4 animate-spin text-[var(--text-muted)]" />
            ) : saved ? (
              <BookmarkCheck className="h-4 w-4 fill-[var(--primary)] text-[var(--primary)]" />
            ) : (
              <Bookmark className="h-4 w-4 text-[var(--text-muted)] transition-colors group-hover:text-[var(--primary)]" />
            )}
          </button>
        )}

        {/* Arrow */}
        <ChevronRight className="h-4 w-4 text-[var(--text-muted)] transition-all group-hover:translate-x-0.5 group-hover:text-[var(--primary)]" />
      </div>
    </div>
  );
}