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
    <div className="min-h-screen w-full overflow-y-auto bg-gradient-to-br from-[var(--background)] to-[var(--background-soft)] p-3 sm:p-4">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="group mb-3 flex items-center gap-1.5 text-[var(--text-muted)] transition-all duration-200 hover:text-[var(--text-primary)]"
      >
        <ArrowLeft size={14} className="transition-transform duration-200 group-hover:-translate-x-1" />
        <span className="text-xs font-medium">Back</span>
      </button>

      {/* Header Card */}
      <div className="surface-card mb-4 rounded-xl border border-[var(--border)] p-4 shadow-lg transition-all duration-300 hover:border-[var(--border-strong)]">
        {/* Top Row - Company Info & Action Buttons */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Section - Company & Job Info */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)] sm:h-12 sm:w-12">
              <span className="text-base font-bold text-[var(--primary)] sm:text-lg">
                {job.candidatePosted?.currentCompany?.charAt(0) || "J"}
              </span>
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-[var(--text-primary)] sm:text-lg">
                {job.jobTitle?.[0] || job.jobRoles?.[0] || "Untitled Job"}
              </h2>

              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Building2 size={12} className="text-[var(--text-muted)]" />
                  <span>{job.candidatePosted?.currentCompany || "Company"}</span>
                </div>

                <span className="text-[10px] text-[var(--text-muted)]">•</span>

                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <MapPin size={12} className="text-[var(--text-muted)]" />
                  <span>{job.location?.[0] || "Location"}</span>
                </div>

                {job.jobType && (
                  <>
                    <span className="text-[10px] text-[var(--text-muted)]">•</span>
                    <span className={`badge rounded-full px-2 py-0.5 text-[9px] font-medium ${
                      job.jobType === "Referral" 
                        ? "badge-primary" 
                        : "badge-info"
                    }`}>
                      {job.jobType}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Right Section - Action Buttons */}
          <div className="flex flex-shrink-0 items-center gap-1.5">
            {/* Apply Button */}
            <button
              onClick={handleApply}
              disabled={isApplying}
              className="btn-primary group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[var(--primary)]/25 disabled:cursor-not-allowed disabled:opacity-70"
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
              className="btn-secondary group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSaved ? (
                <BookmarkCheck size={13} className="text-[var(--success)]" />
              ) : (
                <Bookmark size={13} className="transition-colors group-hover:text-[var(--primary)]" />
              )}
              <span>{isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="btn-secondary group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Share2 size={13} className="transition-transform group-hover:scale-110" />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Bottom Row - Quick Stats */}
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-3 text-xs text-[var(--text-muted)]">
          {job.numberOfOpenings && (
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--background-soft)] px-2.5 py-1">
              <Briefcase size={12} className="text-[var(--primary)]" />
              <span className="font-medium text-[var(--text-primary)]">{job.numberOfOpenings}</span>
              <span>Openings</span>
            </div>
          )}

          {job.employmentType && job.employmentType.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--background-soft)] px-2.5 py-1">
              <Clock size={12} className="text-[var(--info)]" />
              <span className="font-medium text-[var(--text-primary)]">{job.employmentType.join(", ")}</span>
            </div>
          )}

          {job.views !== undefined && (
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--background-soft)] px-2.5 py-1">
              <Eye size={12} className="text-[var(--primary)]" />
              <span className="font-medium text-[var(--text-primary)]">{job.views}</span>
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
                flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-medium transition-all duration-200 sm:text-xs
                ${isActive 
                  ? "btn-primary shadow-lg shadow-[var(--primary)]/20" 
                  : "btn-secondary"
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
      <div>
        {selectedTab === "overview" && <OverviewSection job={job} />}
        {selectedTab === "requirements" && <RequirementSection job={job} />}
        {selectedTab === "compensation" && <CompensationSection job={job} />}
        {selectedTab === "insights" && <ProcessSection job={job} />}
      </div>
    </div>
  );
}