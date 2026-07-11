"use client";

import { ApplicationDetailExperienceProps } from "@/types/applications";

export default function ApplicationDetailExperience({
  experiences,
}: ApplicationDetailExperienceProps) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-[#2a3a52]
        bg-gradient-to-r from-[#111827] to-[#1a2332]
        p-5
        shadow-xl
        shadow-black/20
        backdrop-blur-sm
      "
    >
      <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span className="bg-gradient-to-r from-green-500 to-emerald-600 w-1 h-6 rounded-full"></span>
        Experience
      </h2>

      {experiences?.length ? (    
        <div className="space-y-4">
          {experiences.map((experience: any, index: number) => (
            <div
              key={index}
              className="
                rounded-xl
                border
                border-[#2a3a52]
                bg-[#0f172a]
                p-4
                hover:border-green-500/30
                transition-all
                hover:scale-[1.01]
                group
              "
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-semibold text-white">
                    {experience?.role || "N/A"}
                  </h3>

                  <p className="text-sm text-blue-400 font-medium">
                    {experience?.company_display ||
                      experience?.company ||
                      "N/A"}
                  </p>
                </div>

                {experience?.isCurrent && (
                  <span
                    className="
                      px-2.5
                      py-0.5
                      rounded-full
                      bg-green-500/10
                      border
                      border-green-500/30
                      text-green-400
                      text-xs
                      font-medium
                      flex-shrink-0
                      ml-2
                    "
                  >
                    Current
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs text-slate-500 flex items-center gap-1">
                <span className="text-slate-400">📅</span>
                {experience?.startDate
                  ? new Date(
                      experience.startDate
                    ).toLocaleDateString("en-IN", {
                      month: "short",
                      year: "numeric",
                    })
                  : "N/A"}
                <span className="text-slate-600 mx-1">•</span>
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
                <p className="mt-2 text-sm text-slate-400 leading-relaxed line-clamp-2 group-hover:line-clamp-none transition-all">
                  {experience.description}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-4">
          No experience added
        </p>
      )}
    </div>
  );
}