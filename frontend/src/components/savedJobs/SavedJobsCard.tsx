import { SavedJobCardProps } from "@/types/savedjobs";

export default function SavedJobCard({ savedJob,onUnsave }: SavedJobCardProps) {
  const job = savedJob.job;

  const company =
    job?.companyPosted?.companyDetails?.companyName ||
    job?.candidatePosted?.currentCompany ||
    "Unknown Company";

  return (
    <div className="rounded-3xl border border-[#1e293b] bg-[#0f172a] p-6 hover:border-green-500/40 transition-all mb-5">
      
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-semibold text-green-500">
            {job?.jobRoles?.[0] ||
              job?.jobTitle?.[0] ||
              "Job Role"}
          </h2>

          <p className="mt-1 text-gray-400">
            {company}
          </p>
        </div>

        <span className="rounded-full border border-green-500/30 bg-green-500/10 px-3 py-1 text-sm text-green-400">
          Saved
        </span>
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl border border-[#1e293b] p-4">
          <p className="text-xs text-green-500">
            LOCATION
          </p>
          <p className="mt-1 text-white">
            {job?.location?.[0] || "Remote"}
          </p>
        </div>

        <div className="rounded-2xl border border-[#1e293b] p-4">
          <p className="text-xs text-green-500">
            PACKAGE
          </p>
          <p className="mt-1 text-white">
            ₹{job?.packageDetails?.totalCTC || 0}
          </p>
        </div>

        <div className="rounded-2xl border border-[#1e293b] p-4">
          <p className="text-xs text-green-500">
            WORK MODE
          </p>
          <p className="mt-1 text-white">
            {job?.workMode?.[0] || "N/A"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-3 border-t border-[#1e293b] pt-4">


        <button onClick={() => onUnsave(job._id)} className="rounded-xl border border-[#334155] px-5 py-2 text-red-400 transition hover:border-red-500/40 hover:bg-red-500/10">
            Unsave
        </button>

      </div>
    </div>
  );
}