"use client";

import { CheckCircle, Circle, Clock, Check, X, Users, CalendarCheck, Briefcase, UserCheck, UserX } from "lucide-react";

interface TimelineProps {
  currentStatus: string;
}

// Stage configuration with icons and colors
const stageConfig = {
  "Applied": {
    icon: Clock,
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
  },
  "Application Sent": {
    icon: Check,
    color: "text-indigo-400",
    bgColor: "bg-indigo-500/10",
    borderColor: "border-indigo-500/30",
  },
  "Referred To Company": {
    icon: Users,
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
  },
  "Shortlisted": {
    icon: CheckCircle,
    color: "text-purple-400",
    bgColor: "bg-purple-500/10",
    borderColor: "border-purple-500/30",
  },
  "Interview Scheduled": {
    icon: CalendarCheck,
    color: "text-cyan-400",
    bgColor: "bg-cyan-500/10",
    borderColor: "border-cyan-500/30",
  },
  "Offer Extended": {
    icon: Briefcase,
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
  },
  "Offer Accepted / Offer Rejected": {
    icon: UserCheck,
    color: "text-teal-400",
    bgColor: "bg-teal-500/10",
    borderColor: "border-teal-500/30",
  },
  "Joined the Company": {
    icon: UserCheck,
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
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
    if (!isCompleted) return "text-gray-500";
    return stageConfig[stage as keyof typeof stageConfig]?.color || "text-gray-400";
  };

  const getStageBgColor = (stage: string, isCompleted: boolean) => {
    if (!isCompleted) return "bg-gray-700/20";
    return stageConfig[stage as keyof typeof stageConfig]?.bgColor || "bg-gray-700/20";
  };

  const getStageBorderColor = (stage: string, isCompleted: boolean) => {
    if (!isCompleted) return "border-gray-600/20";
    return stageConfig[stage as keyof typeof stageConfig]?.borderColor || "border-gray-600/20";
  };

  const getIcon = (stage: string, isCompleted: boolean) => {
    if (!isCompleted) return Circle;
    return stageConfig[stage as keyof typeof stageConfig]?.icon || CheckCircle;
  };

  return (
    <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-4">
      {/* Compact Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-white">Timeline</h3>
          <span className="text-[10px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/20">
            {activeIndex + 1}/{stages.length}
          </span>
        </div>
        <div className="text-[11px] text-gray-400">
          <span className="text-white font-medium">{currentStatus}</span>
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
              <div className="flex flex-col items-center mr-3">
                <div
                  className={`
                    w-6 h-6 rounded-full flex items-center justify-center
                    border transition-all duration-300
                    ${isCompleted ? `${borderColor} ${bgColor}` : 'border-gray-600/30 bg-gray-800/20'}
                    ${isCurrent ? 'ring-2 ring-green-500/20 scale-105' : ''}
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
                      w-0.5 h-6 transition-all duration-500
                      ${isCompleted ? 'bg-gradient-to-b from-green-500 to-green-500/20' : 'bg-gray-700/30'}
                    `}
                  />
                )}
              </div>

              {/* Stage Content - Compact */}
              <div className="flex-1 pt-0.5 pb-1.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <p
                    className={`
                      text-xs font-medium transition-all duration-300
                      ${isCompleted ? 'text-white' : 'text-gray-500'}
                      ${isCurrent ? 'text-green-400' : ''}
                    `}
                  >
                    {stage}
                  </p>

                  {/* Status Badges - Smaller */}
                  {isCurrent && (
                    <span className="text-[8px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/30">
                      Current
                    </span>
                  )}
                  {isCompleted && !isCurrent && (
                    <span className="text-[8px] bg-green-500/10 text-green-400 px-1.5 py-0.5 rounded-full border border-green-500/20">
                      Done
                    </span>
                  )}
                  {!isCompleted && (
                    <span className="text-[8px] bg-gray-500/10 text-gray-500 px-1.5 py-0.5 rounded-full border border-gray-500/20">
                      Pending
                    </span>
                  )}
                </div>

                {/* Progress Bar - Smaller */}
                {isCurrent && (
                  <div className="mt-1 w-full max-w-[120px]">
                    <div className="h-0.5 w-full bg-gray-700/30 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-400 rounded-full animate-pulse"
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
      <div className="mt-3 pt-3 border-t border-slate-800/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-[10px] text-gray-400">Done</span>
              <span className="text-[10px] text-white font-medium">{activeIndex + 1}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-gray-600" />
              <span className="text-[10px] text-gray-400">Pending</span>
              <span className="text-[10px] text-white font-medium">{stages.length - activeIndex - 1}</span>
            </div>
          </div>
          <div className="text-[10px] text-gray-400">
            <span className="text-white font-medium">
              {Math.round(((activeIndex + 1) / stages.length) * 100)}%
            </span>
          </div>
        </div>

        {/* Progress Bar - Smaller */}
        <div className="mt-1.5 h-1 w-full bg-gray-700/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-green-500 to-emerald-400 rounded-full transition-all duration-1000"
            style={{ width: `${((activeIndex + 1) / stages.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}