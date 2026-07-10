"use client";

import { LeftPanelProps } from "@/types/dashboard";
import { useState } from "react";
import OverviewSection from "../dashboard/OverviewSection";
import RequirementSection from "../dashboard/RequirementSection";
import CompensationSection from "../dashboard/CompensationSection";
import ProcessSection from "../dashboard/ProcessSection";
import { applyJob, saveJob } from "@/services/job.service";
import { ArrowLeft, Building2, MapPin, Briefcase, Share2, Bookmark, BookmarkCheck, Send, Award, Target, Users, Clock, Eye } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JobDetailPage({ job }: LeftPanelProps) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    try {
      setIsSaving(true);
      console.log("###", job);

      await saveJob(
        job._id,
        job.jobType || "job",
        job.matchScore || 0
      );

      setIsSaved(true);
      alert("Job saved successfully");
    } catch (err) {
      console.error("Error saving job:", err);
      alert("Failed to save job");
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async () => {
    try {
      setIsApplying(true);
      console.log(job._id, job.jobType, job.matchScore);
      await applyJob(
        job._id,
        job.jobType,
        job.matchScore || 0
      );
      alert("Applied successfully");
    } catch (err) {
      console.error("Error applying:", err);
      alert("Failed to apply");
    } finally {
      setIsApplying(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: job.jobTitle?.[0] || "Job Opportunity",
        text: `Check out this job at ${job.candidatePosted?.currentCompany || "Company"}`,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: Briefcase },
    { id: "requirements", label: "Requirements", icon: Target },
    { id: "compensation", label: "Compensation", icon: Award },
    { id: "insights", label: "Match & Referral Insights", icon: Users },
  ];

  return (
    <div className="w-full overflow-y-auto p-3 sm:p-4 bg-gradient-to-br from-[#0F172A] to-[#1a2332] min-h-screen">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="group flex items-center gap-1.5 text-gray-400 hover:text-white transition-all duration-200 mb-3"
      >
        <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform duration-200" />
        <span className="text-xs font-medium">Back</span>
      </button>

      {/* Header Card */}
      <div className="mb-4 rounded-xl border border-slate-800 bg-gradient-to-br from-[#111827] to-[#1a2332] p-4 shadow-lg hover:border-slate-700 transition-all duration-300">
        {/* Top Row - Company Info & Action Buttons */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
          {/* Left Section - Company & Job Info */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-lg bg-gradient-to-br from-green-500/20 to-blue-500/20 border border-green-500/30 flex-shrink-0">
              <span className="text-base sm:text-lg font-bold text-green-400">
                {job.candidatePosted?.currentCompany?.charAt(0) || "J"}
              </span>
            </div>

            <div className="min-w-0">
              <h2 className="text-base sm:text-lg font-bold text-white truncate">
                {job.jobTitle?.[0] || job.jobRoles?.[0] || "Untitled Job"}
              </h2>

              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mt-0.5">
                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <Building2 size={12} className="text-gray-500" />
                  <span>{job.candidatePosted?.currentCompany || "Company"}</span>
                </div>

                <span className="text-gray-600 text-[10px]">•</span>

                <div className="flex items-center gap-1 text-xs text-gray-400">
                  <MapPin size={12} className="text-gray-500" />
                  <span>{job.location?.[0] || "Location"}</span>
                </div>

                {job.jobType && (
                  <>
                    <span className="text-gray-600 text-[10px]">•</span>
                    <span className={`text-[9px] font-medium px-2 py-0.5 rounded-full border ${
                      job.jobType === "Referral" 
                        ? "bg-purple-500/10 text-purple-400 border-purple-500/30" 
                        : "bg-blue-500/10 text-blue-400 border-blue-500/30"
                    }`}>
                      {job.jobType}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons (Save, Share, Apply in row) */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            {/* Apply Button */}
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="group flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 text-xs font-medium text-black transition-all duration-200 hover:from-green-400 hover:to-emerald-400 hover:shadow-lg hover:shadow-green-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isApplying ? (
                <>
                  <div className="h-3 w-3 animate-spin rounded-full border-2 border-black/30 border-t-black" />
                  <span>Applying...</span>
                </>
              ) : (
                <>
                  <Send size={13} />
                  <span>Apply</span>
                </>
              )}
            </button>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="group flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-gray-300 transition-all duration-200 hover:bg-slate-800/50 hover:border-slate-600 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaved ? (
                <BookmarkCheck size={13} className="text-green-400" />
              ) : (
                <Bookmark size={13} className="group-hover:text-green-400 transition-colors" />
              )}
              <span>{isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="group flex items-center gap-1.5 rounded-lg border border-slate-700 px-3 py-1.5 text-xs font-medium text-gray-300 transition-all duration-200 hover:bg-slate-800/50 hover:border-slate-600 hover:text-white"
            >
              <Share2 size={13} className="group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Bottom Row - Quick Stats (Openings & Employment Type) */}
        <div className="mt-3 pt-3 border-t border-slate-800/50 flex flex-wrap items-center gap-3 text-xs text-gray-400">
          {job.numberOfOpenings && (
            <div className="flex items-center gap-1.5 bg-slate-800/30 rounded-lg px-2.5 py-1">
              <Briefcase size={12} className="text-green-400" />
              <span className="text-white font-medium">{job.numberOfOpenings}</span>
              <span>Openings</span>
            </div>
          )}

          {job.employmentType && job.employmentType.length > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-800/30 rounded-lg px-2.5 py-1">
              <Clock size={12} className="text-blue-400" />
              <span className="text-white font-medium">{job.employmentType.join(", ")}</span>
            </div>
          )}

          {job.workMode && (
            <div className="flex items-center gap-1.5 bg-slate-800/30 rounded-lg px-2.5 py-1">
              <Eye size={12} className="text-purple-400" />
              <span className="text-white font-medium">{job.workMode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-4 flex flex-wrap gap-1.5">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = selectedTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`
                flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] sm:text-xs font-medium transition-all duration-200
                ${isActive 
                  ? "bg-gradient-to-r from-green-500 to-emerald-500 text-black shadow-lg shadow-green-500/20" 
                  : "border border-slate-700 text-gray-400 hover:bg-slate-800/50 hover:text-white hover:border-slate-600"
                }
              `}
            >
              <Icon size={13} />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">
                {tab.id === "overview" && "Overview"}
                {tab.id === "requirements" && "Req."}
                {tab.id === "compensation" && "Comp."}
                {tab.id === "insights" && "Insights"}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Sections */}
      <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-[#111827] to-[#1a2332] p-4 shadow-lg">
        {selectedTab === "overview" && <OverviewSection job={job} />}
        {selectedTab === "requirements" && <RequirementSection job={job} />}
        {selectedTab === "compensation" && <CompensationSection job={job} />}
        {selectedTab === "insights" && <ProcessSection job={job} />}
      </div>
    </div>
  );
}