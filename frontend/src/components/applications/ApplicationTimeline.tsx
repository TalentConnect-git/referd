"use client";

import { CheckCircle, Circle, Clock, Check, X, Users, CalendarCheck, Briefcase, UserCheck, UserX } from "lucide-react";

interface TimelineProps {
  currentStatus: string;
}

// Stage configuration with icons and colors using theme variables
const stageConfig = {
  "Applied": {
    icon: Clock,
    color: "text-[var(--info)]",
    bgColor: "bg-[var(--info-soft)]",
    borderColor: "border-[var(--info-border)]",
  },
  "Application Sent": {
    icon: Check,
    color: "text-[var(--info)]",
    bgColor: "bg-[var(--info-soft)]",
    borderColor: "border-[var(--info-border)]",
  },
  "Referred To Company": {
    icon: Users,
    color: "text-[var(--primary)]",
    bgColor: "bg-[var(--primary-soft)]",
    borderColor: "border-[var(--primary-border)]",
  },
  "Shortlisted": {
    icon: CheckCircle,
    color: "text-[var(--success)]",
    bgColor: "bg-[var(--success-soft)]",
    borderColor: "border-[var(--success-border)]",
  },
  "Interview Scheduled": {
    icon: CalendarCheck,
    color: "text-[var(--info)]",
    bgColor: "bg-[var(--info-soft)]",
    borderColor: "border-[var(--info-border)]",
  },
  "Offer Extended": {
    icon: Briefcase,
    color: "text-[var(--success)]",
    bgColor: "bg-[var(--success-soft)]",
    borderColor: "border-[var(--success-border)]",
  },
  "Offer Accepted / Offer Rejected": {
    icon: UserCheck,
    color: "text-[var(--success)]",
    bgColor: "bg-[var(--success-soft)]",
    borderColor: "border-[var(--success-border)]",
  },
  "Joined the Company": {
    icon: UserCheck,
    color: "text-[var(--success)]",
    bgColor: "bg-[var(--success-soft)]",
    borderColor: "border-[var(--success-border)]",
  },
};

export default function ApplicationTimeline({
  currentStatus,
}: TimelineProps) {
  const stages = [
    "Applied",
    "Application Sent",
    "Referred To Company",
    "Shortlisted",
    "Interview Scheduled",
    "Offer Extended",
    "Offer Accepted / Offer Rejected",
    "Joined the Company",
  ];

  // Normalize status for matching
  const normalizedStatus =
    currentStatus === "Accepted"
      ? "Referred To Company"
      : currentStatus === "Offer Accepted"
      ? "Offer Accepted / Offer Rejected"
      : currentStatus === "Offer Rejected"
      ? "Offer Accepted / Offer Rejected"
      : currentStatus === "JoinedTheCompany"
      ? "Joined the Company"
      : currentStatus;

  const activeIndex = stages.findIndex(
    (stage) => stage === normalizedStatus
  );

  // Get stage color
  const getStageColor = (stage: string, isCompleted: boolean) => {
    if (!isCompleted) return "text-[var(--text-muted)]";
    return stageConfig[stage as keyof typeof stageConfig]?.color || "text-[var(--text-muted)]";
  };

  const getStageBgColor = (stage: string, isCompleted: boolean) => {
    if (!isCompleted) return "bg-[var(--background-soft)]";
    return stageConfig[stage as keyof typeof stageConfig]?.bgColor || "bg-[var(--background-soft)]";
  };

  const getStageBorderColor = (stage: string, isCompleted: boolean) => {
    if (!isCompleted) return "border-[var(--border)]";
    return stageConfig[stage as keyof typeof stageConfig]?.borderColor || "border-[var(--border)]";
  };

  const getIcon = (stage: string, isCompleted: boolean) => {
    if (!isCompleted) return Circle;
    return stageConfig[stage as keyof typeof stageConfig]?.icon || CheckCircle;
  };

  return (
    <div className="surface-card rounded-2xl border border-[var(--border)] bg-[var(--card)] p-4">
      {/* Compact Header */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Timeline</h3>
          <span className="badge badge-success rounded-full border border-[var(--success-border)] bg-[var(--success-soft)] px-1.5 py-0.5 text-[10px] text-[var(--success)]">
            {activeIndex + 1}/{stages.length}
          </span>
        </div>
        <div className="text-[11px] text-[var(--text-muted)]">
          <span className="font-medium text-[var(--text-primary)]">{currentStatus}</span>
        </div>
      </div>

      {/* Compact Timeline */}
      <div className="relative space-y-0">
        {stages.map((stage, index) => {
          const isCompleted = index <= activeIndex;
          const isCurrent = index === activeIndex;
          const Icon = getIcon(stage, isCompleted);
          const color = getStageColor(stage, isCompleted);
          const bgColor = getStageBgColor(stage, isCompleted);
          const borderColor = getStageBorderColor(stage, isCompleted);

          return (
            <div key={stage} className="flex items-start group">
              {/* Icon Circle - Smaller */}
              <div className="mr-3 flex flex-col items-center">
                <div
                  className={`
                    flex h-6 w-6 items-center justify-center rounded-full
                    border transition-all duration-300
                    ${isCompleted ? `${borderColor} ${bgColor}` : 'border-[var(--border)] bg-[var(--background-soft)]'}
                    ${isCurrent ? 'scale-105 ring-2 ring-[var(--primary)]/20' : ''}
                  `}
                >
                  <Icon
                    size={12}
                    className={`
                      ${color}
                      ${isCompleted ? 'opacity-100' : 'opacity-40'}
                      transition-all duration-300
                    `}
                  />
                </div>

                {/* Connector Line - Shorter */}
                {index !== stages.length - 1 && (
                  <div
                    className={`
                      h-6 w-0.5 transition-all duration-500
                      ${isCompleted ? 'bg-gradient-to-b from-[var(--primary)] to-[var(--primary)]/20' : 'bg-[var(--border)]'}
                    `}
                  />
                )}
              </div>

              {/* Stage Content - Compact */}
              <div className="flex-1 pb-1.5 pt-0.5">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p
                    className={`
                      text-xs font-medium transition-all duration-300
                      ${isCompleted ? 'text-[var(--text-primary)]' : 'text-[var(--text-muted)]'}
                      ${isCurrent ? 'text-[var(--primary)]' : ''}
                    `}
                  >
                    {stage}
                  </p>

                  {/* Status Badges - Smaller */}
                  {isCurrent && (
                    <span className="badge badge-success rounded-full border border-[var(--success-border)] bg-[var(--success-soft)] px-1.5 py-0.5 text-[8px] text-[var(--success)]">
                      Current
                    </span>
                  )}
                  {isCompleted && !isCurrent && (
                    <span className="badge badge-success rounded-full border border-[var(--success-border)] bg-[var(--success-soft)] px-1.5 py-0.5 text-[8px] text-[var(--success)]">
                      Done
                    </span>
                  )}
                  {!isCompleted && (
                    <span className="badge rounded-full border border-[var(--border)] bg-[var(--background-soft)] px-1.5 py-0.5 text-[8px] text-[var(--text-muted)]">
                      Pending
                    </span>
                  )}
                </div>

                {/* Progress Bar - Smaller */}
                {isCurrent && (
                  <div className="mt-1 w-full max-w-[120px]">
                    <div className="h-0.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
                      <div
                        className="h-full animate-pulse rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]"
                        style={{ width: '60%' }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Compact Progress Summary */}
      <div className="mt-3 border-t border-[var(--border)] pt-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[var(--success)]" />
              <span className="text-[10px] text-[var(--text-muted)]">Done</span>
              <span className="text-[10px] font-medium text-[var(--text-primary)]">{activeIndex + 1}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="h-2 w-2 rounded-full bg-[var(--text-muted)]" />
              <span className="text-[10px] text-[var(--text-muted)]">Pending</span>
              <span className="text-[10px] font-medium text-[var(--text-primary)]">{stages.length - activeIndex - 1}</span>
            </div>
          </div>
          <div className="text-[10px] text-[var(--text-muted)]">
            <span className="font-medium text-[var(--text-primary)]">
              {Math.round(((activeIndex + 1) / stages.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Progress Bar - Smaller */}
        <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-[var(--border)]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] transition-all duration-1000"
            style={{ width: `${((activeIndex + 1) / stages.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}