"use client";

import { saveJob, applyJob } from "@/services/job.service";
import { JobRowProps } from "@/types/dashboard";
import toast from "react-hot-toast";
import {
  Building2,
  MapPin,
  Briefcase,
  Bookmark,
  Send,
  CheckCircle,
  Clock,
} from "lucide-react";
import { useState, useEffect } from "react";

export default function JobRow({
  id,
  logoLetter,
  title,
  company,
  location,
  referredBy,
  matchScore,
  workMode,
  onClick,
  jobType,
  isSaved = false,
  isApplied = false,
}: JobRowProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [saved, setSaved] = useState(isSaved);
  const [applied, setApplied] = useState(isApplied);

  const truncateText = (text?: string, maxLength = 14) => {
    if (!text) return "";
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

  const [isMobile, setIsMobile] = useState(false);

  useState(() => {
    if (typeof window !== "undefined") {
      setIsMobile(window.innerWidth < 640);
    }
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (saved) {
      toast.success("Already saved");
      return;
    }

    setIsSaving(true);
    try {
      await saveJob(id, jobType, matchScore);
      setSaved(true);
      toast.success("Job saved successfully");
    } catch (err) {
      toast.error("Error saving job");
      console.log(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async (e: React.MouseEvent) => {
    e.stopPropagation();

    if (applied) {
      toast.success("Already applied");
      return;
    }

    setIsApplying(true);
    try {
      await applyJob(id, jobType, matchScore);
      setApplied(true);
      toast.success("Applied successfully");
    } catch (err) {
      toast.error("Error applying");
      console.log(err);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRowClick = () => {
    onClick?.();
  };

  // Get work mode display
  const getWorkModeDisplay = () => {
    if (!workMode || workMode.length === 0) return null;
    return workMode[0];
  };

  // Render details with dots between items
  const renderDetails = () => {
    const details = [];
    const workModeDisplay = getWorkModeDisplay();

    // Company
    if (company) {
      details.push(
        <div key="company" className="flex items-center gap-1">
          <Building2 className="h-3 w-3 flex-shrink-0 text-[var(--text-muted)]" />
          <span className="truncate text-xs text-[var(--text-secondary)]">
            {isMobile ? truncateText(company, 12) : company}
          </span>
        </div>,
      );
    }

    // Location
    if (location) {
      details.push(
        <div key="location" className="flex items-center gap-1">
          <MapPin className="h-3 w-3 flex-shrink-0 text-[var(--text-muted)]" />
          <span className="truncate text-xs text-[var(--text-muted)]">
            {location}
          </span>
        </div>,
      );
    }

    // Work Mode
    if (workModeDisplay) {
      details.push(
        <div key="workmode" className="flex items-center gap-1">
          <Briefcase className="h-3 w-3 flex-shrink-0 text-[var(--text-muted)]" />
          <span className="truncate text-xs text-[var(--text-muted)]">
            {workModeDisplay}
          </span>
        </div>,
      );
    }

    // Render with dots between items
    return details.map((item, index) => (
      <div key={index} className="flex items-center">
        {item}
        {index < details.length - 1 && (
          <span className="mx-1.5 text-[10px] text-[var(--text-muted)]">•</span>
        )}
      </div>
    ));
  };

  return (
    <div
      onClick={handleRowClick}
      className="group flex cursor-pointer items-center justify-between border-b border-[var(--border)] px-3 py-3 transition-all duration-200 hover:bg-[var(--card-hover)] last:border-b-0 sm:px-4"
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Logo */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background-soft)] text-xs font-bold text-[var(--text-secondary)] transition-colors duration-200 group-hover:border-[var(--border-strong)]">
          {logoLetter || "J"}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)]">
              {title}
            </h3>

            {matchScore > 0 && (
              <span className="badge badge-success inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium">
                <span className="h-1 w-1 rounded-full bg-[var(--success)]"></span>
                {matchScore}% match
              </span>
            )}
          </div>

          <div className="mt-0.5 flex flex-wrap items-center gap-1">
            {renderDetails()}
          </div>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-2">
        {/* Save Button - Hidden if already saved or applied */}
        {!saved && !applied && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-[var(--border)] bg-[var(--background-soft)] px-3 py-1.5 text-[11px] font-medium text-[var(--text-secondary)] transition-all duration-200 hover:border-[var(--border-strong)] hover:bg-[var(--card-hover)] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSaving ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-[var(--text-muted)] border-t-[var(--text-primary)]"></span>
                Saving...
              </>
            ) : (
              <>
                <Bookmark className="h-3.5 w-3.5" />
                Save
              </>
            )}
          </button>
        )}

        {/* Applied Badge */}
        {applied && (
          <span className="badge badge-success inline-flex items-center gap-1.5 rounded-lg border border-[var(--success-border)] bg-[var(--success-soft)] px-3 py-1.5 text-[11px] font-medium text-[var(--success)]">
            <CheckCircle className="h-3.5 w-3.5" />
            Applied
          </span>
        )}

        {/* Saved Badge */}
        {saved && !applied && (
          <span className="badge badge-info inline-flex items-center gap-1.5 rounded-lg border border-[var(--info-border)] bg-[var(--info-soft)] px-3 py-1.5 text-[11px] font-medium text-[var(--info)]">
            <Bookmark className="h-3.5 w-3.5 fill-[var(--info)]" />
            Saved
          </span>
        )}

        {/* Apply Button - Hidden if already applied or saved */}
        {!applied && !saved && (
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-semibold transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isApplying ? (
              <>
                <span className="h-3 w-3 animate-spin rounded-full border-2 border-black/30 border-t-black"></span>
                Applying...
              </>
            ) : (
              <>
                <Send className="h-3.5 w-3.5" />
                Apply
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
