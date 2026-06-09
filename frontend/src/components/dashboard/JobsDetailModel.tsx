"use client";

import LeftPannel from "./LeftPannel";
import RightPannel from "./RightPannel";
import { saveJob } from "@/services/job.service";

interface JobDetailsModalProps {
  open: boolean;
  onClose: () => void;
  job: any;
  allJobs: any[];
  onSelectJob:(job: any) => void;
}

export default function JobDetailsModal({
  open,
  onClose,
  job,
  allJobs,
  onSelectJob,
}: JobDetailsModalProps) 
{
  if (!open || !job) return null;

  const otherJobs = allJobs.filter(
  (j) => j._id !== job._id
);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="relative h-[85vh] w-[85vw] overflow-hidden rounded-2xl border border-[#1e293b] bg-[#0f172a] shadow-2xl">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-50 text-xl text-gray-400 hover:text-white"
        >
          ✕
        </button>

        <div className="flex h-full">

          {/* LEFT PANEL */}
          <LeftPannel job={job} />

          {/* RIGHT PANEL */}
          <RightPannel allJobs={otherJobs} onSelectJob={onSelectJob} />
           
        </div>
        </div>

      </div>
  );
}