"use client";

import { ApplicationDetailHeaderProps } from "@/types/applications";

export default function ApplicationDetailHeader({
  applicant,
}: ApplicationDetailHeaderProps) {
  const currentEducation =
    applicant?.educations?.[0];

  const currentExperience =
    applicant?.experiences?.find(
      (exp: any) => exp.isCurrent
    ) || applicant?.experiences?.[0];

  return (
    <div
      className="
        rounded-3xl
        border
        border-slate-800
        bg-[#111827]
        p-6
      "
    >
      <div className="flex items-start gap-5">
        {/* Avatar */}

                    {applicant?.profileImage ? (
                          <img
                            src={applicant.profileImage}
                            alt={applicant?.name || "Applicant"}
                            className="
                              h-20
                              w-20
                              rounded-full
                              object-cover
                              border
                              border-slate-700
                            "/>) : (<div className="
                                      h-20
                                      w-20
                                      rounded-full
                                      bg-green-600
                                      flex
                                      items-center
                                      justify-center
                                      text-2xl
                                      font-bold
                                      text-white">{applicant?.name?.charAt(0)?.toUpperCase() ||"U"}</div>)}




        {/* Details */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold">
            {applicant?.name || "Unknown Applicant"}
          </h1>

          <p className="mt-1 text-slate-400">
            {applicant?.jobRoles?.join(" • ") ||
              "No Role Specified"}
          </p>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-slate-500">
                Email:
              </span>
              {" "}
              {applicant?.email || "N/A"}
            </div>

            <div>
              <span className="text-slate-500">
                Phone:
              </span>{" "}
              {applicant?.phone || "N/A"}
            </div>

            <div>
              <span className="text-slate-500">
                Current Company:
              </span>{" "}
              {currentExperience?.company_display ||
                currentExperience?.company ||
                applicant?.currentCompany ||
                "N/A"}
            </div>

            <div>
              <span className="text-slate-500">
                Current Role:
              </span>{" "}
              {currentExperience?.role || "N/A"}
            </div>

            <div>
              <span className="text-slate-500">
                College:
              </span>{" "}
              {currentEducation?.college_display ||
                currentEducation?.college ||
                "N/A"}
            </div>

            <div>
              <span className="text-slate-500">
                Degree:
              </span>{" "}
              {currentEducation?.degree || "N/A"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}