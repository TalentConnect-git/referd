import { AlumniDetailProfileProps } from "@/types/alumni";

export default function AlumniDetailMetrics({
  profile,
}: AlumniDetailProfileProps) {
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
      <h2 className="mb-5 text-xl font-semibold text-white">
        Metrics
      </h2>

      <div className="space-y-5">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <span className="text-gray-400">
            Open Jobs
          </span>

          <span className="font-semibold text-white">
            {profile.referralJobs?.length || 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-400">
            Status
          </span>

          <span
            className={`font-semibold ${
              profile.isHiring
                ? "text-green-500"
                : "text-gray-300"
            }`}
          >
            {profile.isHiring ? "Hiring" : "Not Hiring"}
          </span>
        </div>
      </div>
    </div>
  );
}