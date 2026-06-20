"use client";

import { ApplicationDetailReferralRequestProps } from "@/types/applications";

export default function ApplicationDetailReferralRequest({
  job,
}: ApplicationDetailReferralRequestProps) {
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
        Referral Request Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div>
          <p className="text-slate-500 text-sm">
            Company
          </p>

          <p className="font-medium">
            {job?.companyName || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-slate-500 text-sm">
            Job Type
          </p>

          <p className="font-medium">
            {job?.jobType || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-slate-500 text-sm">
            Job Title
          </p>

          <p className="font-medium">
            {job?.jobTitle?.[0] || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-slate-500 text-sm">
            Looking For
          </p>

          <p className="font-medium">
            {job?.lookingFor || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-slate-500 text-sm">
            Posted By
          </p>

          <p className="font-medium">
            {job?.candidatePosted?.name || "N/A"}
          </p>
        </div>

        <div>
          <p className="text-slate-500 text-sm">
            Current Company
          </p>

          <p className="font-medium">
            {job?.candidatePosted?.currentCompany ||
              "N/A"}
          </p>
        </div>

      </div>

      {job?.description && (
        <div className="mt-6">
          <p className="text-slate-500 text-sm mb-2">
            Description
          </p>

          <p className="text-slate-300">
            {job.description}
          </p>
        </div>
      )}

      {job?.careerPageUrl && (
        <div className="mt-6">
          <a
            href={job.careerPageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
              inline-flex
              items-center
              rounded-xl
              border
              border-green-500/30
              bg-green-500/10
              px-4
              py-2
              text-green-400
              hover:bg-green-500/20
            "
          >
            View Career Page →
          </a>
        </div>
      )}
    </div>
  );
}