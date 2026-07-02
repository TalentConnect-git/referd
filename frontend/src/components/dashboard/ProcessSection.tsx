import { ProcessSectionProps } from "@/types/dashboard";
export default function ProcessSection({ job }: ProcessSectionProps) {
    
  const SIZE = 110;       // Overall circle size
  const THICKNESS = 10;   // Ring thickness

  const INNER_SIZE = SIZE - THICKNESS * 2;
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
          {job.rounds?.length || 0}
        </span>
      </div>
    </div>

    {/* Match Score Circle */}
    <div
      style={{
        width: 100,
        height: 100,
        borderRadius: "50%",
        background: `conic-gradient(
          #22c55e ${(job.matchScore ?? 0) * 3.6}deg,
          #2b3446 ${(job.matchScore ?? 0) * 3.6}deg
        )`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div
        style={{
          width: 82,
          height: 82,
          borderRadius: "50%",
          background: "#111827",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#fff",
          }}
        >
          {job.matchScore ?? 0}%
        </div>

        <div
          style={{
            fontSize: 9,
            color: "#22c55e",
            marginTop: 2,
          }}
        >
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