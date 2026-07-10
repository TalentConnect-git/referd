import { ProcessSectionProps } from "@/types/dashboard";
import { useEffect, useMemo, useState } from "react";

export default function ProcessSection({ job }: ProcessSectionProps) {
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(0);
    const timeout = setTimeout(() => {
      setProgress(job.matchScore ?? 0);
    }, 100);
    return () => clearTimeout(timeout);
  }, [job.matchScore]);

  const offset = useMemo(
    () => circumference - (progress / 100) * circumference,
    [progress, circumference]
  );

  return (
    <div className="space-y-4">
      {/* Match & Referral Insights */}
      <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-4">
        <h3 className="mb-3 text-base font-semibold text-white">
          Match & Referral Insights
        </h3>

        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm">📦</span>
              <span className="text-xs text-gray-400">Openings:</span>
              <span className="text-sm font-semibold text-white">
                {job.numberOfOpenings ?? "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm">✔️</span>
              <span className="text-xs text-gray-400">Selection Rounds:</span>
              <span className="text-sm font-semibold text-white">
                {job.rounds?.[0] || 0}
              </span>
            </div>
          </div>

          <div className="relative flex h-[80px] w-[80px] items-center justify-center">
            <svg width="80" height="80" className="-rotate-90 absolute">
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="#2b3446"
                strokeWidth="6"
                fill="none"
              />
              <circle
                cx="40"
                cy="40"
                r={radius}
                stroke="#22c55e"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
              />
            </svg>

            <div className="z-10 flex flex-col items-center">
              <div className="text-[18px] font-bold text-white">
                {job.matchScore ?? 0}%
              </div>
              <div className="text-[8px] text-green-500">Match Score</div>
            </div>
          </div>
        </div>
      </div>

      {/* Selection Process */}
      <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-4">
        <h3 className="mb-2 text-base font-semibold text-white">
          Selection Process
        </h3>

        {job.selectionProcess?.length ? (
          <div className="rounded-lg border border-[#334155] bg-[#161f2f] p-3">
            {job.selectionProcess.map((step: string, index: number) => (
              <p key={index} className="text-sm text-gray-300">
                {index + 1}. {step}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400">No selection process specified</p>
        )}
      </div>

      {/* Important Dates */}
      <div className="rounded-lg border border-[#1e293b] bg-[#111827] p-4">
        <h3 className="mb-2 text-base font-semibold text-white">
          Important Dates
        </h3>

        <div className="rounded-lg border border-[#334155] bg-[#161f2f] p-3">
          <p className="text-xs font-medium text-blue-400">
            Application Deadline
          </p>
          <p className="mt-1 text-sm font-semibold text-white">
            {job.endDate
              ? new Date(job.endDate).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })
              : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}