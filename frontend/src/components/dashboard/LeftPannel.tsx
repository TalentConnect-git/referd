import { LeftPanelProps } from "@/types/dashboard";
import { useState } from "react";
import OverviewSection from "./OverviewSection";
import RequirementSection from "./RequirementSection";
import CompensationSection from "./CompensationSection";
import ProcessSection from "./ProcessSection";
import { applyJob, saveJob } from "@/services/job.service";

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

  return (
    <div className="w-[72%] overflow-y-auto p-6 bg-gradient-to-br from-[#0f172a] to-[#1a2332]">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between rounded-2xl border border-[#2a3a52] bg-gradient-to-r from-[#111827] to-[#1a2332] p-5 shadow-xl shadow-black/20 backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 text-xl font-bold text-white shadow-lg shadow-green-500/20">
            {job.candidatePosted?.currentCompany?.charAt(0) || "J"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {job.jobTitle?.[0] || job.jobRoles?.[0] || "Untitled Job"}
            </h2>
            <p className="text-xs text-gray-400 font-medium">
              {job.candidatePosted?.currentCompany || "COMPANY"}
            </p>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <span>📍</span> {job.location?.[0] || "Location"}
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSave}
            className="group relative rounded-lg border border-[#334155] px-3.5 py-2 text-xs font-semibold text-white transition-all duration-300 hover:border-green-500 hover:bg-green-500/10 hover:shadow-lg hover:shadow-green-500/10"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              Save
            </span>
          </button>

          <button className="group relative rounded-lg border border-[#334155] px-3.5 py-2 text-xs font-semibold text-white transition-all duration-300 hover:border-blue-500 hover:bg-blue-500/10 hover:shadow-lg hover:shadow-blue-500/10">
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              Share
            </span>
          </button>

          <button
            onClick={handleApply}
            className="group relative rounded-lg bg-gradient-to-r from-green-500 to-emerald-600 px-4 py-2 text-xs font-bold text-black transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-green-500/30 active:scale-95"
          >
            <span className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              Apply
            </span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-2 bg-[#0f172a] rounded-xl p-1 border border-[#2a3a52]">
        {["overview", "requirements", "compensation", "Match & Referral Insights"].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-300 ${
              selectedTab === tab
                ? "bg-green-500 text-black shadow-lg shadow-green-500/30 scale-[1.02]"
                : "text-gray-400 hover:text-white hover:bg-[#1e293b]"
            }`}
          >
            {tab === "Match & Referral Insights" ? "Match & Referral" : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content Sections */}
      <div className="bg-[#0f172a]/50 rounded-2xl border border-[#2a3a52] p-5 backdrop-blur-sm">
        {selectedTab === "overview" && <OverviewSection job={job} />}
        {selectedTab === "requirements" && <RequirementSection job={job} />}
        {selectedTab === "compensation" && <CompensationSection job={job} />}
        {selectedTab === "Match & Referral Insights" && <ProcessSection job={job} />}
      </div>

      {/* Removed separate Apply button section */}
    </div>
  );
}