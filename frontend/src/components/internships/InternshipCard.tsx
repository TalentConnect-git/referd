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
        cursor-pointer
        rounded-xl
        border
        border-[#2a3a52]
        bg-[#0f172a]
        px-4
        py-3
        transition-all
        duration-200
        hover:border-green-500/40
        hover:bg-[#1a2332]
        hover:shadow-lg
        hover:shadow-green-500/5
        group
        flex
        items-center
        gap-3
        ${isRemovingCard || isRemoving ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
        ${isRemovingCard ? "max-h-0 overflow-hidden p-0 m-0 border-0" : ""}
      `}
    >
      {/* Company Logo */}
      <div className="h-10 w-10 rounded-lg border border-[#2a3a52] bg-[#1a2332] flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
        {company?.charAt(0).toUpperCase() || "?"}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 flex items-center gap-3">
        {/* Title & Company */}
        <div className="min-w-0 flex-1">
          <h3 className="text-sm font-semibold text-white truncate group-hover:text-green-400 transition-colors">
            {title || "Untitled Internship"}
          </h3>
          <p className="text-xs text-slate-400 truncate">{company}</p>
        </div>

        {/* Location */}
        {location && (
          <div className="hidden sm:flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap">
            <MapPin size={12} />
            <span className="truncate max-w-[80px]">{location}</span>
          </div>
        )}

        {/* Duration */}
        {duration && (
          <div className="hidden md:flex items-center gap-1 text-xs text-slate-500 whitespace-nowrap">
            <Clock size={12} />
            <span>{duration}</span>
          </div>
        )}

        {/* Package */}
        {packageDisplay && (
          <div className="hidden lg:flex items-center gap-1 text-xs text-green-400 font-semibold whitespace-nowrap">
           
            <span>{packageDisplay} CTC</span>
          </div>
        )}

        {/* Match Score */}
        {matchScore !== undefined && matchScore !== null && (
          <div className="flex items-center gap-2 flex-shrink-0">
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
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {/* Save Button */}
        {jobId && (
          <button
            onClick={handleSaveToggle}
            disabled={isSaving || isRemovingCard}
            className="
              p-1.5
              rounded-lg
              transition-all
              duration-200
              hover:bg-green-500/10
              disabled:opacity-50
              disabled:cursor-not-allowed
            "
            aria-label={saved ? "Unsave internship" : "Save internship"}
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 text-slate-400 animate-spin" />
            ) : saved ? (
              <BookmarkCheck className="w-4 h-4 text-green-500 fill-green-500" />
            ) : (
              <Bookmark className="w-4 h-4 text-slate-500 group-hover:text-green-400 transition-colors" />
            )}
          </button>
        )}

        {/* Arrow */}
        <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-green-400 group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  );
}