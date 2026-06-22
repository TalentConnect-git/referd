"use client";

import { ApplicationDetailActionsProps } from "@/types/applications";
import { updateApplicationStatus } from "@/services/application.service";
import toast from "react-hot-toast";

export default function ApplicationDetailActions({
  application,
}: ApplicationDetailActionsProps) {



  const handleStatusUpdate = async (
    status: "Referred To Company" | "Rejected" | "Accepted"
  ) => {
    try {
      await updateApplicationStatus(application._id, status);
      toast.success(`Application ${status} successfully`);

    } catch (error) {
      console.error("Failed to update application status:", error);
      toast.error("Something went wrong");
    }

  };


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
  <button onClick={() => handleStatusUpdate("Rejected")}
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

  <button onClick={() => handleStatusUpdate("Referred To Company")}
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

      <button

          onClick={() => handleStatusUpdate("Accepted")}

          className="
            text-blue-400
            font-medium
            transition-all
            hover:text-blue-300
            hover:underline
            cursor-pointer"
        >
          Approve Candidate
        </button>

</div>

      <div className="mt-6 text-sm text-slate-400">
        Application ID: {application?._id}
      </div>
    </div>
  );
}





