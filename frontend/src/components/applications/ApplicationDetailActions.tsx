"use client";

import { ApplicationDetailActionsProps } from "@/types/applications";

export default function ApplicationDetailActions({
  application,
}: ApplicationDetailActionsProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        p-6
      "
    >
      <h2 className="text-xl font-semibold mb-6 text-blue-400">
        Actions
      </h2>


<div className="flex items-center gap-8">
  <button
    className="
      text-red-400
      font-medium
      transition-all
      hover:text-red-300
      hover:underline
      cursor-pointer
    "
  >
    Reject Candidate
  </button>

  <button
    className="
      text-green-400
      font-medium
      transition-all
      hover:text-green-300
      hover:underline
      cursor-pointer
    "
  >
    Refer Candidate
  </button>
</div>

      <div className="mt-6 text-sm text-slate-400">
        Application ID: {application?._id}
      </div>
    </div>
  );
}





