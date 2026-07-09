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
  User,
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
}: JobCardProps) {
  const router = useRouter();
  const [saved, setSaved] = useState(isSaved);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setSaved(isSaved);
  }, [isSaved]);

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
        return;
      }

      if (response?.success || response?.status === 200) {
        setSaved(true);
        showSuccessToast("Job saved successfully");
        if (onSaveToggle) onSaveToggle(jobId, true);
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

  return (
    <div
      onClick={() => router.push(`${route}?matchScore=${matchScore ?? 0}`)}
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
      "
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

              {/* Job Type Badge - Displayed with company name */}
              {/* {jobType && (
                <>
                  <div className="w-px h-3 bg-[var(--border)]" />
                  <span className="text-[10px] bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/20 whitespace-nowrap">
                    {getJobTypeLabel()}
                  </span>
                </>
              )} */}

              {secondaryInfo && (
                <>
                  <div className="w-px h-3 bg-[var(--border)]" />
                  <div className="flex items-center gap-1 text-xs">
                    <span className="font-semibold text-green-400 bg-green-500/10 px-2 py-0.5 rounded-full border border-green-500/20">
                      {secondaryInfo}
                    </span>
                  </div>
                </>
              )}

              {/* Work Mode - Displayed with company name */}
              {workMode && (
                <>
                  <div className="w-px h-3 bg-[var(--border)]" />
                  <div className="flex items-center gap-1 text-zinc-400 text-xs">
                    <Briefcase className="w-3 h-3" />
                    <span className="capitalize">{workMode}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Match Score */}
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
              h-fit
              ml-2
              flex-shrink-0
            "
          >
            {matchScore}%
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="mt-2.5 pt-2.5 border-t border-[var(--border)]" />

      {/* Row 2: ALL elements in a single flex row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        {/* Left Side: Location, Posted By, Secondary Info */}
        <div className="flex items-center gap-2 flex-wrap">
          {location && (
            <div className="flex items-center gap-1 text-zinc-400 text-xs">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[100px]">{location}</span>
            </div>
          )}

         {postedBy && (
  <>
    <div className="w-px h-3 bg-[var(--border)]" />
    <div className="flex items-center gap-1 text-zinc-400 text-xs">
      <User className="w-3 h-3" />
      <span>By {postedBy}</span>
    </div>
  </>
)}

          {/* Package Details - Displayed in Left Side */}
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
              disabled={isSaving}
              className="
                p-1.5
                rounded-full
                transition-all
                duration-200
                hover:bg-white/5
                disabled:opacity-50
                disabled:cursor-not-allowed
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
    </div>
  );
}
