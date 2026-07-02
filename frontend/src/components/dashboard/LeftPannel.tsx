import { LeftPanelProps } from "@/types/dashboard";
import { useState } from "react";
import OverviewSection from "./OverviewSection";
import RequirementSection from "./RequirementSection";
import CompensationSection from "./CompensationSection";
import ProcessSection from "./ProcessSection";
import { saveJob } from "@/services/job.service";

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

  return (
    
    <div className="w-[72%] overflow-y-auto p-6">

            {/* Header */}
            <div className="mb-6 flex items-center justify-between rounded-xl border border-[#1e293b] bg-[#111827] p-5">

              <div className="flex items-center gap-4">

                <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-[#1e293b] text-xl font-bold text-white">
                  {/* {job.companyPosted?.companyDetails?.companyName?.charAt(0) ||
                    "J"} */}
                    {job.candidatePosted?.currentCompany?.charAt(0) ||
                    "J"}
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {job.jobTitle?.[0] ||
                      job.jobRoles?.[0] ||
                      "Untitled Job"}
                  </h2>

                  <p className="text-sm text-gray-400">
                    {/* {job.companyPosted?.companyDetails?.companyName ||
                      "Company"} */}
                      {job.candidatePosted?.currentCompany?.charAt(0) ||
                    "J"}
                  </p>

                  <p className="text-sm text-gray-500">
                    📍 {job.location?.[0] || "Location"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleSave} className="rounded-lg border border-[#334155] px-4 py-2 text-sm text-white bg-green-500 hover:bg-green-400 transition">
                  Save
                </button>

                <button className="rounded-lg border border-[#334155] px-4 py-2 text-sm text-white hover:bg-green-500 transition">
                  Share
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-6 flex gap-3">
              <button onClick={() => setSelectedTab("overview")}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${selectedTab === "overview"? "bg-green-500 text-black": "border border-[#334155] text-gray-300"}`}>Overview</button>


              <button onClick={() => setSelectedTab("requirements")}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${selectedTab === "requirements"? "bg-green-500 text-black": "border border-[#334155] text-gray-300"}`}>Requirements</button>

              
              <button onClick={() => setSelectedTab("compensation")}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${selectedTab === "compensation"? "bg-green-500 text-black": "border border-[#334155] text-gray-300"}`}>Compensation</button>

              
              <button onClick={() => setSelectedTab("Match & Referral Insights")}
              className={`rounded-lg px-5 py-2 text-sm font-semibold transition-all ${selectedTab === "Match & Referral Insights"? "bg-green-500 text-black": "border border-[#334155] text-gray-300"}`}>Match & Referral Insights</button>
            </div>


            {selectedTab === "overview" && <OverviewSection job={job}/>}
            {selectedTab === "requirements" && <RequirementSection job={job}/>}
            {selectedTab === "compensation" && <CompensationSection job={job} />}
            {selectedTab==="Match & Referral Insights" && <ProcessSection job={job} />}
            
        </div>
  );
}