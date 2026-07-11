"use client";

import { ApplicationDetailEducationProps } from "@/types/applications";

export default function ApplicationDetailEducation({
  educations,
}: ApplicationDetailEducationProps) {

  console.log("Educations:", educations);
  
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
        Education
      </h2>

      {educations?.length ? (
        <div className="space-y-4">
          {educations.map(
            (education: any, index: number) => (
              <div
                key={index}
                className="
                  border-l-2
                  border-green-500/50
                  pl-4
                  relative
                  hover:border-green-500
                  transition-colors
                  group
                "
              >
                <div
                  className="
                    absolute
                    -left-[7px]
                    top-1.5
                    h-3
                    w-3
                    rounded-full
                    bg-gradient-to-r from-green-500 to-emerald-500
                    group-hover:scale-110
                    transition-transform
                  "
                />

                <h3 className="font-semibold text-base text-white">
                  {education?.college_display ||
                    education?.college ||
                    "N/A"}
                </h3>

                <p className="text-sm text-slate-400 font-medium">
                  {education?.degree || "N/A"}
                </p>

                {education?.specialization && (
                  <p className="text-xs text-slate-500 mt-0.5">
                    {education?.specialization}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 mt-2 text-xs">
                  {education?.cgpa && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                      <span className="text-slate-400 font-medium">CGPA:</span>
                      <span className="text-white font-semibold">{education?.cgpa}</span>
                    </span>
                  )}

                  {education?.yearOfGraduation && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                      <span className="text-slate-400 font-medium">Graduation:</span>
                      <span className="text-white font-semibold">{education?.yearOfGraduation}</span>
                    </span>
                  )}

                  {education?.educationType && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                      <span className="text-slate-400 font-medium">Type:</span>
                      <span className="text-white font-semibold capitalize">{education?.educationType}</span>
                    </span>
                  )}
                </div>

                {education?.isCurrent && (
                  <span
                    className="
                      inline-block
                      mt-2
                      px-2.5
                      py-0.5
                      rounded-full
                      bg-green-500/10
                      border
                      border-green-500/30
                      text-green-400
                      text-xs
                      font-medium
                    "
                  >
                    Current Education
                  </span>
                )}
              </div>
            )
          )}
        </div>
      ) : (
        <p className="text-sm text-slate-500 text-center py-4">
          No education added
        </p>
      )}
    </div>
  );
}