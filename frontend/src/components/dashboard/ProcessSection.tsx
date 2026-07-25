import { ProcessSectionProps } from "@/types/dashboard";
import { useEffect, useMemo, useState } from "react";
import { Calendar, Clock, Users, CheckCircle2 } from "lucide-react";

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
    if (score >= 75) return "var(--success)"; // Green
    if (score >= 50) return "var(--warning)"; // Yellow
    if (score >= 30) return "var(--warning)"; // Orange
    return "var(--danger)"; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return "Excellent";
    if (score >= 50) return "Good";
    if (score >= 30) return "Average";
    return "Low";
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 75) return "text-[var(--success)]";
    if (score >= 50) return "text-[var(--warning)]";
    if (score >= 30) return "text-[var(--warning)]";
    return "text-[var(--danger)]";
  };

  return (
    <div className="space-y-4">
      {/* Match & Referral Insights */}
      <div className="surface-card rounded-lg p-4">
        <h3 className="mb-3 text-base font-semibold text-[var(--text-primary)]">
          Match & Referral Insights
        </h3>

        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">Openings:</span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">
                {job.numberOfOpenings ?? "N/A"}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-[var(--text-muted)]" />
              <span className="text-xs text-[var(--text-muted)]">Selection Rounds:</span>
              <span className="text-sm font-semibold text-[var(--text-primary)]">
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
            
            <svg width="100" height="100" className="relative z-10 -rotate-90">
              {/* Background circle */}
              <circle
                cx="50"
                cy="50"
                r={radius}
                stroke="var(--border)"
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
      <div className="surface-card rounded-lg p-4">
        <h3 className="mb-2 text-base font-semibold text-[var(--text-primary)]">
          Selection Process
        </h3>

        {job.selectionProcess?.length ? (
          <div className="space-y-1.5 p-2">
            {job.selectionProcess.map((step: string, index: number) => (
              <p key={index} className="text-sm text-[var(--text-secondary)]">
                {index + 1}. {step}
              </p>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[var(--text-muted)]">No selection process specified</p>
        )}
      </div>

      {/* Important Dates */}
      <div className="surface-card rounded-lg p-4">
        <h3 className="mb-2 text-base font-semibold text-[var(--text-primary)]">
          Important Dates
        </h3>

        <div className="rounded-lg border border-[var(--border)] bg-[var(--background-soft)] p-3">
          <p className="flex items-center gap-1.5 text-xs font-medium text-[var(--info)]">
            <Calendar className="h-3.5 w-3.5" />
            Application Deadline
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--text-primary)]">
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