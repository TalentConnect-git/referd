import { AlumniDetailReferralJobsProps } from "@/types/alumni";

export default function AlumniDetailReferralJobs({
  referralJobs,
}: AlumniDetailReferralJobsProps) {
  return (
    <div className="rounded-3xl border border-slate-800 bg-[#111827] p-6">
      <h2 className="mb-6 text-xl font-semibold text-blue-400">
        Referral Opportunities
      </h2>

      {referralJobs?.length === 0 ? (
        <p className="text-slate-400">
          No referral opportunities available.
        </p>
      ) : (
        <div className="space-y-4">
          {referralJobs.map((job) => (
            <div
              key={job._id}
              className="rounded-2xl border border-slate-700 p-4"
            >
              <h3 className="text-lg font-semibold text-white">
                {job.jobTitle?.[0] || "Referral Opportunity"}
              </h3>

              <p className="mt-1 text-slate-400">
                {job.companyName}
              </p>

              <div className="mt-3 flex items-center gap-3">
                <span className="rounded-full border border-green-700 px-3 py-1 text-xs text-green-400">
                  {job.jobStatus}
                </span>
              </div>

              {job.description && (
                <p className="mt-4 text-sm text-slate-400">
                  {job.description}
                </p>
              )}

              {/* {job.careerPageUrl && (
                <a
                  href={job.careerPageUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block rounded-lg border border-green-700 px-4 py-2 text-sm text-green-400 hover:bg-slate-800"
                >
                  View Opportunity
                </a>
              )} */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}









