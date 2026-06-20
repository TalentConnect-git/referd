"use client";

import { useRouter } from "next/navigation";
import { InternshipCardProps } from "@/types/internship";

export default function InternshipCard({
  title,
  company,
  location,
  matchScore,
  postedBy,
  secondaryInfo,
  route,
}: InternshipCardProps) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(route)}
      className="
        cursor-pointer
        rounded-3xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-6
        transition
        hover:border-green-500
        hover:shadow-lg
      "
    >
      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div
            className="
              h-12
              w-12
              rounded-2xl
              bg-slate-500
              border
              border-gray-500
              text-gray-500
              flex
              items-center
              justify-center
              text-xl
              font-bold
            "
          >
            {company.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-xl font-semibold">
              {title}
            </h3>

            <p className="mt-1 text-zinc-400 text-sm">
              {company}
              {location && ` • ${location}`}
            </p>
          </div>
        </div>

        {matchScore !== undefined &&
          matchScore !== null && (
            <div
              className="
                inline-flex
                items-center
                rounded-full
                border
                border-green-500/30
                bg-green-500/10
                px-1
                py-1
                text-xs
                font-medium
                text-green-400
                whitespace-nowrap
                h-fit
              "
            >
              {matchScore}% Match
            </div>
          )}
      </div>

      <div className="my-5 border-t border-[var(--border)]" />

      <div className="flex justify-between items-center">
        <div>
          <p className="text-zinc-400">
            Posted by {postedBy}
          </p>

          {secondaryInfo && (
            <p className="mt-1 text-sm text-green-500">
              {secondaryInfo}
            </p>
          )}
        </div>

        <span
          style={{
            color: "#9ca3af",
            cursor: "pointer",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = "#22c55e";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = "#9ca3af";
          }}
          className="font-medium"
        >
          View Details →
        </span>
      </div>
    </div>
  );
}