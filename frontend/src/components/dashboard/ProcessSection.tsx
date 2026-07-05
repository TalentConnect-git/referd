import { ProcessSectionProps } from "@/types/dashboard";
import { useEffect,useMemo, useState } from "react";
export default function ProcessSection({ job }: ProcessSectionProps) {
    

const radius = 42;
const circumference = 2 * Math.PI * radius;

const [progress, setProgress] = useState(0);

useEffect(() => {
  // Start hidden
  setProgress(0);

  // Let the initial render happen
  const timeout = setTimeout(() => {
    setProgress(job.matchScore ?? 0);
  }, 100);

  return () => clearTimeout(timeout);
}, [job.matchScore]);

const offset = useMemo(
  () =>
    circumference -
    (progress / 100) * circumference,
  [progress, circumference]
);

  // this is match & referral insights component 



  console.log("****************** ",job);
  return (

    <div className="space-y-6">
   <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">
  <h3 className="mb-6 text-xl font-semibold text-white">
    Match & Referral Insights
  </h3>

  <div className="flex items-center justify-between">
    {/* Left Side */}
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <span className="text-lg">📦</span>
        <span className="text-gray-400">
          Openings:
        </span>
        <span className="font-semibold text-white">
          {job.numberOfOpenings ?? "N/A"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-lg">✔️</span>
        <span className="text-gray-400">
          Selection Rounds:
        </span>
        <span className="font-semibold text-white">
          {job.rounds?.[0] || 0}
        </span>
      </div>
    </div>

    {/* Match Score Circle */}


  <div className="relative flex h-[100px] w-[100px] items-center justify-center">
  <svg
    width="100"
    height="100"
    className="-rotate-90 absolute"
  >
    {/* Background */}
    <circle
      cx="50"
      cy="50"
      r={42}
      stroke="#2b3446"
      strokeWidth="8"
      fill="none"
    />

    {/* Animated Progress */}
    <circle
      cx="50"
      cy="50"
      r={42}
      stroke="#22c55e"
      strokeWidth="8"
      fill="none"
      strokeLinecap="round"
      strokeDasharray={circumference}
      strokeDashoffset={offset}
      style={{
        transition: "stroke-dashoffset 1.2s ease-out",
      }}
    />
  </svg>

  <div className="z-10 flex flex-col items-center">
    <div className="text-[22px] font-bold text-white">
      {job.matchScore ?? 0}%
    </div>

    <div className="text-[9px] text-green-500">
      Match Score
    </div>
  </div>
</div>




  </div>
</div>



      {/* Selection Process */}
      {/* <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">
        <h3 className="mb-5 text-xl font-semibold text-white">
          Selection Process
        </h3>

        {job.selectionProcess?.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {job.selectionProcess.map(
              (round: string, index: number) => (
                <div key={index} className="rounded-lg border border-[#334155] p-4">

                  <div className="mb-2 flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-sm font-bold text-white">
                      {index + 1}
                    </div>

                    <h4 className="font-semibold text-white">
                      Round {index + 1}
                    </h4>

                  </div>
                  <p className="text-gray-400">
                    {round}
                  </p>
                </div> )
            )}
          </div>) : (

          <p className="text-gray-400">
            No selection process specified
          </p>
        )}

      </div> */}


      <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">
  <h3 className="mb-5 text-xl font-semibold text-white">
    Selection Process
  </h3>

  {job.selectionProcess?.length ? (
    <div className="rounded-lg border border-[#334155] bg-[#161f2f] p-5">
      {job.selectionProcess.map((step: string, index: number) => (
        <p
          key={index}
          className="text-gray-300"
        >
          {step}
        </p>
      ))}
    </div>
  ) : (
    <p className="text-gray-400">
      No selection process specified
    </p>
  )}
</div>

      {/* Important Dates */}

      {/* <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">

        <h3 className="mb-5 text-xl font-semibold text-white">
          Important Dates
        </h3>

        <div className="grid gap-4 grid-cols-2 ">

          <div className="rounded-lg border border-[#334155] p-4">
            <p className="text-sm text-green-400">
              Application Deadline
            </p>
            <p className="mt-4 text-lg font-semibold text-white">
              {new Date(job.endDate).toLocaleDateString()}
            </p>
          </div>

          <div className="rounded-lg border border-[#334155] p-4">
            <p className="text-sm text-green-400">
              Online Test Date
            </p>
            <p className="mt-4 text-lg font-semibold text-white">
              N/A
            </p>
          </div>

          <div className="rounded-lg border border-[#334155] p-4">
            <p className="text-sm text-green-400">
              Interview Window
            </p>

            <p className="mt-4 text-lg font-semibold text-white">
              N/A
            </p>
          </div>

          <div className="rounded-lg border border-[#334155] p-4">
            <p className="text-sm text-green-400">
              Offer Rollout
            </p>
            <p className="mt-4 text-lg font-semibold text-white">
              N/A
            </p>
          </div>

        </div>
      </div> */}



      {/* Important Dates */}

<div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">
  <h3 className="mb-5 text-xl font-semibold text-white">
    Important Dates
  </h3>

  <div className="rounded-lg border border-[#334155] bg-[#161f2f] p-5">
    <p className="text-sm font-medium text-blue-400">
      Application Deadline
    </p>

    <p className="mt-3 text-lg font-semibold text-white">
      {job.endDate
        ? new Date(job.endDate).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "N/A"}
    </p>
  </div>
</div>

      {/* Contact Person */}

      {/* <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">

        <h3 className="mb-5 text-xl font-semibold text-white">
          Contact Person
        </h3>

        <div className="rounded-xl border border-[#334155] bg-green-500/2 p-5">

          <h4 className="text-lg font-semibold text-white">
            {job.candidatePosted?.name || "N/A"}
          </h4>

          <p className="mt-2 text-gray-300">
            📧 {job.postedByUser?.email || "N/A"}
          </p>

        </div>

      </div> */}




      

    </div>

  );
}