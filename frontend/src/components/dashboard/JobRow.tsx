"use client";

import { saveJob, applyJob } from "@/services/job.service";
import { JobRowProps } from "@/types/dashboard";
import toast from "react-hot-toast";
import { Building2, MapPin, Briefcase, Bookmark, Send, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

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
    if (!workMode || workMode.length === 0) return "-";
    return workMode[0];
  };

  return (
    <div 
      onClick={handleRowClick} 
      className="group flex cursor-pointer items-center justify-between border-b border-slate-800/50 px-4 py-3 transition-all duration-200 hover:bg-slate-800/20 last:border-b-0"
    >
      <div className="flex min-w-0 items-center gap-3">
        {/* Logo */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-700/50 bg-[#1e293b] text-xs font-bold text-white group-hover:border-slate-600 transition-colors duration-200">
          {logoLetter || "J"}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-[13px] font-semibold text-white group-hover:text-green-400 transition-colors duration-200">
              {title}
            </h3>

            {matchScore > 0 && (
              <span className="inline-flex items-center gap-1 rounded-full bg-green-500/10 px-2 py-0.5 text-[10px] font-medium text-green-400">
                <span className="w-1 h-1 rounded-full bg-green-400"></span>
                {matchScore}% match
              </span>
            )}

            
          </div>

          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <span className="text-xs text-gray-300 truncate">{company}</span>
            </div>
            
            <span className="text-gray-600 text-[10px]">•</span>
            
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-gray-500 flex-shrink-0" />
              <span className="text-xs text-gray-400 truncate">{location}</span>
            </div>
            
            <span className="text-gray-600 text-[10px]">•</span>
            
            
          </div>
        </div>
      </div>

      <div className="ml-3 flex shrink-0 items-center gap-2">
        {/* Save Button - Hidden if already saved or applied */}
        {!saved && !applied && (
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#1e293b] px-3 py-1.5 text-[11px] font-medium text-white transition-all duration-200 hover:border-slate-500 hover:bg-[#263449] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? (
              <>
                <span className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                Saving...
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5" />
                Save
              </>
            )}
          </button>
        )}

        {/* Applied Badge */}
        {applied && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5 text-[11px] font-medium text-green-400">
            <CheckCircle className="w-3.5 h-3.5" />
            Applied
          </span>
        )}

        {/* Saved Badge */}
        {saved && !applied && (
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 px-3 py-1.5 text-[11px] font-medium text-blue-400">
            <Bookmark className="w-3.5 h-3.5 fill-blue-400" />
            Saved
          </span>
        )}

        {/* Apply Button - Hidden if already applied or saved (if you want to hide when saved too) */}
        {!applied && !saved && (
          <button
            onClick={handleApply}
            disabled={isApplying}
            className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 text-[11px] font-semibold text-black transition-all duration-200 hover:shadow-lg hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isApplying ? (
              <>
                <span className="w-3 h-3 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                Applying...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" />
                Apply
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}