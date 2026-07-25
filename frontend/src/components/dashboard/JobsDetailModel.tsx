"use client";

import LeftPannel from "./LeftPannel";
import RightPannel from "./RightPannel";
import { saveJob } from "@/services/job.service";
import { JobDetailsModalProps } from '@/types/dashboard'
import { X } from "lucide-react";

export default function JobDetailsModal({
  open,
  onClose,
  job,
  allJobs,
  onSelectJob,
}: JobDetailsModalProps) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--overlay)] backdrop-blur-sm p-4">
      <div className="relative h-[85vh] w-full max-w-[85vw] overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card)] shadow-2xl sm:w-[85vw]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)] sm:right-5 sm:top-5"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-full flex-col sm:flex-row">
          {/* LEFT PANEL */}
          <LeftPannel job={job} />

          {/* RIGHT PANEL */}
          <RightPannel allJobs={otherJobs} onSelectJob={onSelectJob} />
        </div>
      </div>
    </div>
  );
}