import { LeftPanelProps } from "@/types/dashboard";
import { useState } from "react";
import OverviewSection from "./OverviewSection";
import RequirementSection from "./RequirementSection";
import CompensationSection from "./CompensationSection";
import ProcessSection from "./ProcessSection";
import { applyJob, saveJob } from "@/services/job.service";
import { Bookmark, Share2, Send, Building2, MapPin, ChevronRight } from "lucide-react";

export default function LeftPanel({ job }: LeftPanelProps) {
  const [selectedTab, setSelectedTab] = useState("overview");

  const handleSave = async () => {
    try {
      console.log(job);
      await saveJob(
        job._id,
        job.jobType || "job",
        job.matchScore || 0
      );
      alert("Job saved successfully");
    } catch (err) {
      console.error("Error saving job:", err);
    }
  };

  const handleApply = async () => {
    try {
      console.log("Job in detail component is ", job);
      console.log(
        job._id,
        job.jobType,
        job.matchScore
      );
      await applyJob(
        job._id,
        job.jobType,
        job.matchScore || 0
      );
      alert("Applied successfully");
    } catch (err) {
      console.error("Error applying:", err);
    }
  };

  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "requirements", label: "Requirements" },
    { id: "compensation", label: "Compensation" },
    { id: "match-referral", label: "Match & Referral" },
  ];

  return (
    <div className="w-full overflow-y-auto bg-gradient-to-br from-[var(--background)] to-[var(--background-soft)] p-4 sm:p-5 md:p-6 lg:w-[72%]">
      {/* Header */}
      <div className="surface-card mb-6 rounded-2xl border border-[var(--border)] p-4 shadow-lg shadow-black/20 backdrop-blur-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-dark)] text-xl font-bold text-black shadow-lg shadow-[var(--primary)]/20">
              {job.candidatePosted?.currentCompany?.charAt(0) || "J"}
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                {job.jobTitle?.[0] || job.jobRoles?.[0] || "Untitled Job"}
              </h2>
              <p className="text-xs font-medium text-[var(--text-muted)]">
                {job.candidatePosted?.currentCompany || "COMPANY"}
              </p>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--text-muted)]">
                <MapPin className="h-3 w-3" />
                {job.location?.[0] || "Location"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleSave}
              className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <Bookmark className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              Save
            </button>

            <button className="btn-secondary inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold transition-all duration-200 hover:scale-105 active:scale-95">
              <Share2 className="h-3.5 w-3.5 transition-transform group-hover:scale-110" />
              Share
            </button>

            <button
              onClick={handleApply}
              className="btn-primary inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold transition-all duration-200 hover:scale-105 hover:shadow-lg hover:shadow-[var(--primary)]/30 active:scale-95"
            >
              <Send className="h-3.5 w-3.5 transition-transform group-hover:rotate-12" />
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 rounded-xl border border-[var(--border)] bg-[var(--background)] p-1">
        <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedTab(tab.id)}
              className={`rounded-lg px-2 py-2 text-xs font-semibold transition-all duration-300 sm:px-3 ${
                selectedTab === tab.id
                  ? "bg-[var(--primary)] text-black shadow-lg shadow-[var(--primary)]/30 scale-[1.02]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--card-hover)]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content Sections */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)]/50 p-4 backdrop-blur-sm sm:p-5">
        {selectedTab === "overview" && <OverviewSection job={job} />}
        {selectedTab === "requirements" && <RequirementSection job={job} />}
        {selectedTab === "compensation" && <CompensationSection job={job} />}
        {selectedTab === "match-referral" && <ProcessSection job={job} />}
      </div>
    </div>
  );
}