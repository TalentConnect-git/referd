"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Building2,
  MapPin,
  Briefcase,
  Share2,
  Bookmark,
  BookmarkCheck,
  Send,
  Award,
  Target,
  Users,
  Clock,
  Eye,
  GraduationCap,
  DollarSign,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { applyJob, saveJob } from "@/services/job.service";
import OverviewSection from "../dashboard/OverviewSection";
import RequirementSection from "../dashboard/RequirementSection";
import CompensationSection from "../dashboard/CompensationSection";
import ProcessSection from "../dashboard/ProcessSection";

interface OffCampusDetailPageProps {
  opportunity: any;
}

export default function OffCampusDetailPage({
  opportunity,
}: OffCampusDetailPageProps) {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isSaving, setIsSaving] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const router = useRouter();

  const data = Array.isArray(opportunity) ? opportunity[0] : opportunity;

  const jobRole = data?.jobRoles?.[0] || "Untitled Opportunity";

  const companyName =
    data?.companyPosted?.companyDetails?.companyName ||
    data?.companyName ||
    "Unknown Company";

  
  const location = data?.location?.[0] || data?.venue || "Remote";


  const matchScore = data?.matchScore || 0;

  const packageDetails = data?.packageDetails || null;

  const formatPackage = (pkg: any) => {
    if (!pkg) return null;
    if (pkg.totalCTC) {
      return `${pkg.currency || "₹"} ${pkg.totalCTC} LPA`;
    }
    if (pkg.stipend) {
      return pkg.stipend;
    }
    return null;
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await saveJob(
        data._id,
        data.jobType || "offcampus",
        data.matchScore || 0,
      );
      setIsSaved(true);
      toast.success("Opportunity saved successfully");
    } catch (err) {
      console.error("Error saving:", err);
      toast.error("Failed to save opportunity");
    } finally {
      setIsSaving(false);
    }
  };

  const handleApply = async () => {
    try {
      setIsApplying(true);
      await applyJob(
        data._id,
        data.jobType || "offcampus",
        data.matchScore || 0,
      );
      toast.success("Applied successfully");
    } catch (err) {
      console.error("Error applying:", err);
      toast.error("Failed to apply");
    } finally {
      setIsApplying(false);
    }
  };

  const handleShare = async () => {
    try {
      await navigator.share({
        title: jobRole,
        text: `Check out this off-campus opportunity at ${companyName}`,
        url: window.location.href,
      });
    } catch (err) {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard!");
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
        <ArrowLeft
          size={14}
          className="transition-transform duration-200 group-hover:-translate-x-1"
        />
        <span className="text-xs font-medium">Back</span>
      </button>

      {/* Header Card */}
      <div className="surface-card mb-4 rounded-xl border border-[var(--border)] p-4 shadow-lg transition-all duration-300 hover:border-[var(--border-strong)]">
        {/* Top Row - Company Info & Action Buttons */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Left Section - Company & Job Info */}
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)] sm:h-12 sm:w-12">
              {data?.companyPosted?.profileImageUrl ? (
                <img
                  src={data.companyPosted.profileImageUrl}
                  alt={companyName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-base font-bold text-[var(--primary)] sm:text-lg">
                  {companyName.charAt(0) || "O"}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-base font-bold text-[var(--text-primary)] sm:text-lg">
                {jobRole}
              </h2>

              <div className="mt-0.5 flex flex-wrap items-center gap-1.5 sm:gap-2">
                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <Building2 size={12} className="text-[var(--text-muted)]" />
                  <span>{companyName}</span>
                </div>

                <span className="text-[10px] text-[var(--text-muted)]">•</span>

                <div className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                  <MapPin size={12} className="text-[var(--text-muted)]" />
                  <span>{location}</span>
                </div>

                {data?.jobType && (
                  <>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      •
                    </span>
                    <span
                      className={`badge rounded-full px-2 py-0.5 text-[9px] font-medium ${
                        data.jobType === "Referral"
                          ? "badge-primary"
                          : data.jobType === "Internship"
                            ? "badge-info"
                            : "badge-warning"
                      }`}
                    >
                      {data.jobType}
                    </span>
                  </>
                )}

                {matchScore > 0 && (
                  <>
                    <span className="text-[10px] text-[var(--text-muted)]">
                      •
                    </span>
                    <span
                      className={`badge rounded-full px-2 py-0.5 text-[9px] font-medium ${
                        matchScore >= 75
                          ? "badge-success"
                          : matchScore >= 40
                            ? "badge-warning"
                            : "badge-danger"
                      }`}
                    >
                      {matchScore}% Match
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
                <Bookmark
                  size={13}
                  className="transition-colors group-hover:text-[var(--primary)]"
                />
              )}
              <span>{isSaving ? "Saving..." : isSaved ? "Saved" : "Save"}</span>
            </button>

            {/* Share Button */}
            <button
              onClick={handleShare}
              className="btn-secondary group flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Share2
                size={13}
                className="transition-transform group-hover:scale-110"
              />
              <span className="hidden sm:inline">Share</span>
            </button>
          </div>
        </div>

        {/* Bottom Row - Quick Stats */}
        <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-[var(--border)] pt-3 text-xs text-[var(--text-muted)]">
          {data?.numberOfOpenings && (
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--background-soft)] px-2.5 py-1">
              <Briefcase size={12} className="text-[var(--primary)]" />
              <span className="font-medium text-[var(--text-primary)]">
                {data.numberOfOpenings}
              </span>
              <span>Openings</span>
            </div>
          )}

          {data?.employmentType &&
            data.employmentType.length > 0 && (
              <div className="flex items-center gap-1.5 rounded-lg bg-[var(--background-soft)] px-2.5 py-1">
                <Clock size={12} className="text-[var(--info)]" />
                <span className="font-medium text-[var(--text-primary)]">
                  {data.employmentType.join(", ")}
                </span>
              </div>
            )}

          {data?.workMode && data.workMode.length > 0 && (
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--background-soft)] px-2.5 py-1">
              <Briefcase size={12} className="text-[var(--info)]" />
              <span className="font-medium text-[var(--text-primary)]">
                {data.workMode.join(", ")}
              </span>
            </div>
          )}

          {data?.venue && (
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--background-soft)] px-2.5 py-1">
              <MapPin size={12} className="text-[var(--warning)]" />
              <span className="font-medium text-[var(--text-primary)]">
                Venue: {data.venue}
              </span>
            </div>
          )}

          {formatPackage(packageDetails) && (
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--background-soft)] px-2.5 py-1">
              
              <span className="font-medium text-[var(--text-primary)]">
                {formatPackage(packageDetails)}
              </span>
            </div>
          )}

          {data?.cgpa && (
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--background-soft)] px-2.5 py-1">
              <GraduationCap size={12} className="text-[var(--info)]" />
              <span className="font-medium text-[var(--text-primary)]">
                CGPA: {data.cgpa}+
              </span>
            </div>
          )}

          {data?.views !== undefined && (
            <div className="flex items-center gap-1.5 rounded-lg bg-[var(--background-soft)] px-2.5 py-1">
              <Eye size={12} className="text-[var(--primary)]" />
              <span className="font-medium text-[var(--text-primary)]">
                {data.views}
              </span>
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
                ${
                  isActive
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
        {selectedTab === "overview" && <OverviewSection job={data} />}
        {selectedTab === "requirements" && (
          <RequirementSection job={data} />
        )}
        {selectedTab === "compensation" && (
          <CompensationSection job={data} />
        )}
        {selectedTab === "insights" && <ProcessSection job={data} />}
      </div>
    </div>
  );
}