"use client";

import { ApplicationDetailAssessmentProps } from "@/types/applications";

export default function ApplicationDetailAssessment({
  application,
  applicant,
}: ApplicationDetailAssessmentProps) {
  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        p-6
      "
    >
      <h2 className="text-xl font-semibold mb-5 text-blue-400">
        Candidate Assessment
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <div className="rounded-xl bg-slate-900 p-3">
          <p className="text-slate-400 text-sm">
            Match Score
          </p>

          <p className="text-2xl font-bold text-green-500">
            {application?.matchScore ?? 0}%
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-slate-400 text-sm">
            Current Status
          </p>

          <p className="text-lg font-semibold">
            {application?.currentStatus || "N/A"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-slate-400 text-sm">
            Looking For
          </p>

          <p className="text-lg font-semibold">
            {applicant?.lookingFor?.join(", ") ||
              "N/A"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-slate-400 text-sm">
            Employment Type
          </p>

          <p className="text-lg font-semibold">
            {applicant?.employmentType?.join(", ") ||
              "N/A"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-slate-400 text-sm">
            Industry
          </p>

          <p className="text-lg font-semibold">
            {applicant?.industry?.join(", ") ||
              "N/A"}
          </p>
        </div>

        <div className="rounded-xl bg-slate-900 p-4">
          <p className="text-slate-400 text-sm">
            Notice Period
          </p>

          <p className="text-lg font-semibold">
            {applicant?.noticePeriod || "N/A"}
          </p>
        </div>

      </div>
    </div>
  );
}