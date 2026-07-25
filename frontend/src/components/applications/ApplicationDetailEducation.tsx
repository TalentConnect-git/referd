"use client";

import { ApplicationDetailEducationProps } from "@/types/applications";

export default function ApplicationDetailEducation({
  educations,
}: ApplicationDetailEducationProps) {

  console.log("Educations:", educations);
  
  return (
    <div
      className="
        card
        rounded-2xl
        border
        border-theme
        bg-gradient-to-r from-card to-card-soft
        p-5
        shadow-xl
        shadow-black/20
        backdrop-blur-sm
      "
    >
      <h2 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
        <span className="bg-gradient-to-r from-primary to-primary-light w-1 h-6 rounded-full"></span>
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
                  border-success/50
                  pl-4
                  relative
                  hover:border-success
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
                    bg-gradient-to-r from-primary to-primary-light
                    group-hover:scale-110
                    transition-transform
                  "
                />

                <h3 className="font-semibold text-base text-primary">
                  {education?.college_display ||
                    education?.college ||
                    "N/A"}
                </h3>

                <p className="text-sm text-muted font-medium">
                  {education?.degree || "N/A"}
                </p>

                {education?.specialization && (
                  <p className="text-xs text-muted mt-0.5">
                    {education?.specialization}
                  </p>
                )}

                <div className="flex flex-wrap gap-3 mt-2 text-xs">
                  {education?.cgpa && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-background-soft border border-theme">
                      <span className="text-muted font-medium">CGPA:</span>
                      <span className="text-primary font-semibold">{education?.cgpa}</span>
                    </span>
                  )}

                  {education?.yearOfGraduation && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-background-soft border border-theme">
                      <span className="text-muted font-medium">Graduation:</span>
                      <span className="text-primary font-semibold">{education?.yearOfGraduation}</span>
                    </span>
                  )}

                  {education?.educationType && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-background-soft border border-theme">
                      <span className="text-muted font-medium">Type:</span>
                      <span className="text-primary font-semibold capitalize">{education?.educationType}</span>
                    </span>
                  )}
                </div>

                {education?.isCurrent && (
                  <span
                    className="
                      badge
                      badge-success
                      inline-block
                      mt-2
                      px-2.5
                      py-0.5
                      rounded-full
                      border
                      border-success/30
                      text-success
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
        <p className="text-sm text-muted text-center py-4">
          No education added
        </p>
      )}
    </div>
  );
}