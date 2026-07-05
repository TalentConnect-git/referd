// "use client";

// import { ArrowLeft } from "lucide-react";
// import { useRouter } from "next/navigation";
// import { JobDetailPageProps } from "@/types/jobs";
// import { applyJob, saveJob } from "@/services/job.service";
// import { toast } from "react-hot-toast";
// import {useState} from "react";

// export default function JobDetailPage({
//   job,
// }: JobDetailPageProps) {

//   const router = useRouter();
//   const [saving, setSaving] = useState(false);
//   const [applying, setApplying] = useState(false);
//   const handleApply = async () => {
//   try {
//     setApplying(true);
//     await applyJob(
//       job._id,
//       job.jobType,
//       job.matchScore || 0
//     );

//     toast.success("Application submitted successfully");
//   } catch (error) {
//     console.error(error);

//     toast.error("Failed to apply");
//   }finally{
//     setApplying(false);
//   }
// };

// const handleSave = async () => {
//   try {
//     setSaving(true);
//     await saveJob(
//       job._id,
//       job.jobType,
//       job.matchScore || 0
//     );

//     toast.success("Job saved successfully");
//   } catch (error) {
//     console.error(error);
//     toast.error("Failed to save job");
//   }finally{
//     setSaving(false);
//   }
// };

//   return (
//     <div className="p-6">
//       {/* Back Button */}
//       <button
//         onClick={() => router.back()}
//         className="
//           mb-6
//           flex
//           items-center
//           gap-2
//           text-zinc-400
//           transition-colors
//         "
//       >
//     <ArrowLeft size={18} />
//         Back to Jobs
//       </button>

//       {/* Main Card */}
//       <div
//         className="
//           rounded-3xl
//           border
//           border-[var(--border)]
//           bg-[var(--card)]
//           p-8
//         "
//       >
//         {/* Header */}
//         <div className="flex items-start justify-between">
//           <div>
//             <h1 className="text-2xl mb-5 font-bold text-green-500">
//               {job.jobTitle?.[0] ||
//                 job.title ||
//                 "Untitled Job"}
//             </h1>

//             <p className="mt-2 text-zinc-400 ">
//               {job.receiverProfile?.currentCompany_display ||
//                 job.companyName ||
//                 "Unknown Company"}
//             </p>

//             <p className="mt-1 text-sm text-zinc-500">
//               📍{job.location?.[0] ||
//                 job.workLocation?.[0] ||
//                 "Remote"}
//             </p>
//           </div>

//           {job.matchScore && (
//             <div
//               className="
//                 rounded-full
//                 border
//                 border-green-500/30
//                 bg-green-500/10
//                 px-3
//                 py-1
//                 text-sm
//                 font-medium
//                 text-green-400
//               "
//             >
//               {job.matchScore}% Match
//             </div>
//           )}
//         </div>

//         {/* Divider */}
//         <div className="my-8 border-t border-[var(--border)] mt-5" />

//         {/* Description */}
//         <section>
//           <h2 className="mb-3 text-xl font-semibold mt-5 text-green-500">
//             Description
//           </h2>

//           <p className="whitespace-pre-wrap text-zinc-400 mb-5">
//             {job.description ||
//               "No description available"}
//           </p>
//         </section>

//         {/* Divider */}
//         <div className="my-8 border-t border-[var(--border)]" />

//         {/* Job Details */}
//         <section>
//           <h2 className="mb-4 text-xl font-semibold mt-5 text-green-500">
//             Job Details
//           </h2>

//           <div className="grid gap-4 md:grid-cols-2">
//             <div>
//               <p className="text-sm mb-2 text-blue-400">
//                 Employment Type
//               </p>
//               <p>
//                 {job.employmentType?.join(", ") ||
//                   "Not specified"}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-blue-400">
//                 Work Mode
//               </p>
//               <p>
//                 {job.workMode?.join(", ") ||
//                   "Not specified"}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-blue-400">
//                 Location
//               </p>
//               <p>
//                 📍{job.location?.join(", ") ||
//                   job.workLocation?.join(", ") ||
//                   "Not specified"}
//               </p>
//             </div>

//             <div>
//               <p className="text-sm text-blue-400">
//                 Posted By
//               </p>
//               <p>
//                 {job.receiverProfile?.name ||
//                   job.candidatePosted?.name ||
//                   "Anonymous"}
//               </p>
//             </div>
//           </div>
//         </section>

//         {/* Divider */}
//         <div className="my-8 border-t border-[var(--border)] mt-5" />

//         {/* Action Buttons */}
        

//          <div className="flex gap-10 mt-8">
//            <span
//             onClick={handleApply}
//              style={{
//                color: "#9ca3af",
//                cursor: "pointer",
//                fontSize: "18px",
//                fontWeight: "600",
//              }}
//              onMouseEnter={(e) => {
//                e.currentTarget.style.color = "#22c55e";
//              }}
//              onMouseLeave={(e) => {
//             e.currentTarget.style.color = "#9ca3af";
//              }}
//            >
//             {applying ? "Applying..." : "Apply Now"}
//              {/* Apply Now */}
//            </span>
         
//            <span
//             onClick={handleSave}
//             style={{
//             color: "#9ca3af",
//             cursor: "pointer",
//             fontSize: "18px",
//                 fontWeight: "600",
//             }}
//             onMouseEnter={(e) => {
//             e.currentTarget.style.color = "#22c55e";
//             }}
//             onMouseLeave={(e) => {
//             e.currentTarget.style.color = "#9ca3af";
//             }}
//                 >
//             {saving ? "Saving..." : "Save Job"}
//            </span>
//          </div>
         


//       </div>
//     </div>
//   );

// }





import { LeftPanelProps } from "@/types/dashboard";
import { useState } from "react";
import OverviewSection from "../dashboard/OverviewSection";
import RequirementSection from "../dashboard/RequirementSection";
import CompensationSection from "../dashboard/CompensationSection";
import ProcessSection from "../dashboard/ProcessSection";
import { applyJob, saveJob } from "@/services/job.service";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function JobDetailPage({ job }: LeftPanelProps) {
const [selectedTab, setSelectedTab] = useState("overview");
const router=useRouter();
const handleSave = async () => {
  try {
    console.log("###",job);

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
    
    <div className="w-full overflow-y-auto p-6">


      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="
          mb-6
          flex
          items-center
          gap-2
          text-zinc-400
          transition-colors
        "
      >
        <ArrowLeft size={18} />
        Back
      </button>

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
                      {job.candidatePosted?.currentCompany ||
                    "COMPANY"}
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


            <div className="mt-8 flex justify-center">

              <button  onClick={handleApply} className="rounded-lg bg-green-500 px-10 py-3 font-semibold text-black hover:bg-green-400">
                Apply Now
              </button>

            </div>
            
        </div>
  );
}


