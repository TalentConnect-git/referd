"use client";

import { AlumniDetailHeaderProps } from "@/types/alumni";

export default function AlumniDetailHeader({
  name,
  currentCompany,
  currentRole,
  college,
  locations,
  profileImage,
}: AlumniDetailHeaderProps) {
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
        {profileImage ? (
          <img
            src={profileImage}
            alt={name}
            className="
              h-20
              w-20
              rounded-full
              object-cover
              border
              border-slate-700
            "
          />
        ) : (
          <div
            className="
              h-20
              w-20
              rounded-full
              bg-green-600
              flex
              items-center
              justify-center
              text-2xl
              font-bold
              text-white
            "
          >
            {name?.charAt(0)?.toUpperCase() || "U"}
          </div>
        )}

        {/* Details */}
        <div className="flex-1">

          <h1 className="text-2xl font-bold text-green-500">
            {name}
          </h1>

          <p className="mt-1 text-slate-400">
            {currentRole} @ {currentCompany}
          </p>
          

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">

            <div>
              <span className="text-slate-400">
                College:
              </span>{" "}
              {college || "N/A"}
            </div>

            <div>
              <span className="text-slate-400">
                Current Company:
              </span>{" "}
              {currentCompany || "N/A"}
            </div>

            <div>
              <span className="text-slate-400">
                Current Role:
              </span>{" "}
              {currentRole || "N/A"}
            </div>

            <div>
              <span className="text-slate-400">
                Preferred Locations:
              </span>{" "}
              {locations?.length
                ? locations.join(", ")
                : "N/A"}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}