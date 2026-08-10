"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import LeftPannel from "./LeftPannel";
import RightPannel from "./RightPannel";
import { saveJob } from "@/services/job.service";
import { JobDetailsModalProps } from "@/types/dashboard";
import { X } from "lucide-react";

export default function JobDetailsModal({
  open,
  onClose,
  job,
  allJobs,
  onSelectJob,
}: JobDetailsModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    return () => {
      setMounted(false);
    };
  }, []);

  if (!mounted || !open || !job) {
    return null;
  }

  const otherJobs = allJobs.filter(
    (j) => j._id !== job._id
  );

  const handleSave = async () => {
    try {
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

  return createPortal(
    <div
      className="
        fixed
        inset-0
        z-[999999]
        flex
        items-center
        justify-center
        bg-[var(--overlay)]
        p-4
        backdrop-blur-sm
      "
    >
      {/* MODAL */}
      <div
        className="
          relative
          z-[1000000]
          h-[85vh]
          w-full
          max-w-[85vw]
          overflow-hidden
          rounded-2xl
          border
          border-[var(--border)]
          bg-[var(--card)]
          shadow-2xl
          sm:w-[85vw]
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close job details"
          className="
            absolute
            right-4
            top-4
            z-[1000001]
            rounded-lg
            p-1.5
            text-[var(--text-muted)]
            transition-colors
            hover:bg-[var(--card-hover)]
            hover:text-[var(--text-primary)]
            sm:right-5
            sm:top-5
          "
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex h-full flex-col sm:flex-row">
          {/* LEFT */}
          <LeftPannel job={job} />

          {/* RIGHT */}
          <RightPannel
            allJobs={otherJobs}
            onSelectJob={onSelectJob}
          />
        </div>
      </div>
    </div>,
    document.body
  );
}