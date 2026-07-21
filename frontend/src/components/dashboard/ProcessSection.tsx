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

  // Get color based on match score
  const getScoreColor = (score: number) => {
    if (score >= 75) return "#22c55e"; // Green
    if (score >= 50) return "#eab308"; // Yellow
    if (score >= 30) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return "Excellent";
    if (score >= 50) return "Good";
    if (score >= 30) return "Average";
    return "Low";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 75) return "text-green-400";
    if (score >= 50) return "text-yellow-400";
    if (score >= 30) return "text-orange-400";
    return "text-red-400";
  };

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

          <div className="relative flex h-[100px] w-[100px] items-center justify-center">
            {/* Glow effect behind circle */}
            <div 
              className="absolute inset-0 rounded-full blur-xl opacity-20"
              style={{ 
                background: `radial-gradient(circle, ${getScoreColor(job.matchScore ?? 0)}33 0%, transparent 70%)`,
                transform: 'scale(0.8)'
              }}
            />
            
            <svg width="100" height="100" className="-rotate-90 relative z-10">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="#1e293b"
                strokeWidth="7"
                fill="none"
              />
              {/* Progress circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke={getScoreColor(job.matchScore ?? 0)}
                strokeWidth="7"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: "stroke-dashoffset 1.2s ease-out" }}
              />
            </svg>

            <div className="absolute inset-0 z-20 flex flex-col items-center justify-center">
              <div className={`text-[22px] font-bold ${getScoreTextColor(job.matchScore ?? 0)}`}>
                {job.matchScore ?? 0}%
              </div>
              <div className={`text-[9px] font-medium ${getScoreTextColor(job.matchScore ?? 0)}`}>
                {getScoreLabel(job.matchScore ?? 0)}
              </div>
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
          <div className="p-3">
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