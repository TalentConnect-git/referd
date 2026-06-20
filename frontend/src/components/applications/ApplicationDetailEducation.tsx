"use client";

import { ApplicationDetailEducationProps } from "@/types/applications";

export default function ApplicationDetailEducation({
  educations,
}: ApplicationDetailEducationProps) {

    console.log("Educations:", educations);
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
        Education
      </h2>

      {educations?.length ? (
        <div className="space-y-5">
          {educations.map(
            (education: any, index: number) => (
              <div
                key={index}
                className="
                  border-l-2
                  border-blue-500
                  pl-5
                  relative
                "
              >
                <div
                  className="
                    absolute
                    -left-[7px]
                    top-2
                    h-3
                    w-3
                    rounded-full
                    bg-blue-500
                  "
                />

                <h3 className="font-semibold text-lg">
                  {education?.college_display ||
                    education?.college ||
                    "N/A"}
                </h3>

                <p className="text-slate-400">
                  {education?.degree || "N/A"}
                </p>

                <p className="text-sm text-slate-500 mt-1">
                  {education?.specialization || "N/A"}
                </p>

                <div className="flex flex-wrap gap-4 mt-3 text-sm">
                  <span>
                    <strong>CGPA:</strong>{" "}
                    {education?.cgpa || "N/A"}
                  </span>

                  <span>
                    <strong>Graduation:</strong>{" "}
                    {education?.yearOfGraduation ||
                      "N/A"}
                  </span>
                </div>

                {education?.isCurrent && (
                  <span
                    className="
                      inline-block
                      mt-3
                      px-3
                      py-1
                      rounded-full
                      bg-blue-500/10
                      border
                      border-blue-500/30
                      text-blue-400
                      text-xs
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
        <p className="text-slate-500">
          No education added
        </p>
      )}
    </div>
  );
}





