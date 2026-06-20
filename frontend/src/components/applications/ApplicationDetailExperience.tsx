"use client";

import { ApplicationDetailExperienceProps } from "@/types/applications";

export default function ApplicationDetailExperience({
  experiences,
}: ApplicationDetailExperienceProps) {
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
        Experience
      </h2>

      {experiences?.length ? (    
    <div className="space-y-6">
  {experiences.map((experience: any, index: number) => (
    <div
      key={index}
      className="
        rounded-2xl
        border
        border-slate-800
        bg-slate-900/40
        p-5
      "
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">
            {experience?.role || "N/A"}
          </h3>

          <p className="text-blue-400">
            {experience?.company_display ||
              experience?.company ||
              "N/A"}
          </p>
        </div>

        {experience?.isCurrent && (
          <span
            className="
              px-3
              py-1
              rounded-full
              bg-green-500/10
              border
              border-green-500/30
              text-green-400
              text-xs
            "
          >
            Current
          </span>
        )}
      </div>

      <p className="mt-3 text-sm text-slate-500">
        {experience?.startDate
          ? new Date(
              experience.startDate
            ).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })
          : "N/A"}
        {" • "}
        {experience?.isCurrent
          ? "Present"
          : experience?.endDate
          ? new Date(
              experience.endDate
            ).toLocaleDateString("en-IN", {
              month: "short",
              year: "numeric",
            })
          : "N/A"}
      </p>

      {experience?.description && (
        <p className="mt-3 text-slate-300">
          {experience.description}
        </p>
      )}
    </div>
  ))}
</div>




      ) : (
        <p className="text-slate-500">
          No experience added
        </p>
      )}
    </div>
  );
}