import { ProcessSectionProps } from "@/types/dashboard";
export default function ProcessSection({ job }: ProcessSectionProps) {
    return (

    <div className="space-y-6">

      {/* Selection Process */}
      <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">
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

      </div>

      {/* Important Dates */}

      <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">

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

      </div>

      {/* Contact Person */}

      <div className="rounded-xl border border-[#1e293b] bg-[#111827] p-6">

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

      </div>

    </div>

  );
}