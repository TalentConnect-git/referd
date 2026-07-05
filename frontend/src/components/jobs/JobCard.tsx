"use client"
import { JobCardProps } from "@/types/jobs";
import { useRouter } from "next/navigation";

export default function JobCard({
  title,
  company,
  location,
  matchScore,
  postedBy,
  secondaryInfo,
  route,
  workMode
}: JobCardProps) {

  const router = useRouter();
  console.log("Items Received ");
  console.log(matchScore);
  console.log(workMode);
  
  return (
    
    <div onClick={() => router.push(`${route}?matchScore=${matchScore ?? 0}`)}
      className="
        cursor-pointer
        rounded-3xl
        border
        border-[var(--border)]
        bg-[var(--card)]
        p-6
        transition
        hover:border-green-500
        hover:shadow-lg">

      {/* Top Section */}
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          {/* Company Avatar */}
          <div
            className="
              h-12
              w-12
              rounded-2xl
              border
              border-gray-500
              text-gray-300
              flex
              items-center
              justify-center
              text-xl
              font-bold"> 
            {company.charAt(0).toUpperCase()}
         </div> 


          {/* <div className="h-12 w-12 rounded-2xl border border-slate-400 flex items-center justify-corner text-xl text-slate-400">{company.charAt(0).toUpperCase()}</div> */}

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

        {/* Match Score */}

        {matchScore !== undefined && matchScore !== null && (
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
                    h-fit"
          >
            {matchScore}% Match
          </div>

        )}

      </div>

      {/* Divider */}
      <div className="my-5 border-t border-[var(--border)]" />
      {/* Bottom Section */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-zinc-400">
            Posted by {postedBy}
          </p>
          <p className="text-sm text-zinc-400">
            {workMode}
          </p>
          {secondaryInfo && (
            <p className="mt-1 text-sm text-green-500">
              {secondaryInfo}
            </p>
          )}
        </div>
        <span style={{color: "#9ca3af",cursor: "pointer"}} onMouseEnter={(e) => {e.currentTarget.style.color = "#22c55e";}} onMouseLeave={(e) => {e.currentTarget.style.color = "#9ca3af";}} className="text-gray-400 font-medium hover:text-2xl">
          View Details →
        </span>
      </div>
    </div>

  );

}