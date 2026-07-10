"use client";

import { ReferralStatsProps } from "@/types/referral";
import {
  Users,
  TrendingUp,
  UserCheck,
  Calendar,
  Award,
} from "lucide-react";

type ReferralStatsExtraProps = ReferralStatsProps & {
  onCandidatesClick?: () => void;
};

export default function ReferralStats({
  onViewDetails,
  metrics,
  onCandidatesClick,
}: ReferralStatsExtraProps) {
  const stats = [
    {
      label: "Candidates",
      value: metrics.totalApplicationsReceived,
      icon: Users,
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/20",
      clickable: true,
      onClick: onCandidatesClick || onViewDetails,
    },
    {
      label: "Response Rate",
      value: `${metrics.responseRate}%`,
      icon: TrendingUp,
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/20",
      clickable: false,
    },
    {
      label: "Referred",
      value: metrics.totalReferredToCompany,
      icon: UserCheck,
      bgColor: "bg-green-500/10",
      iconColor: "text-green-400",
      borderColor: "border-green-500/20",
      clickable: false,
    },
    {
      label: "Interviews",
      value: metrics.totalInterviewScheduled,
      icon: Calendar,
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/20",
      clickable: false,
    },
    {
      label: "Accepted",
      value: metrics.totalAcceptedByCompany,
      icon: Award,
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/20",
      clickable: false,
    },
  ];

  return (
    <div className="my-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <button
            key={stat.label}
            type="button"
            disabled={!stat.clickable}
            onClick={stat.onClick}
            className={`
              group relative overflow-hidden rounded-lg border
              ${stat.borderColor}
              bg-gradient-to-br from-[var(--card)] to-[#0d0d14]
              px-3 py-2.5 text-left transition-all duration-200
              hover:scale-[1.02] hover:border-green-500/30 hover:shadow-md hover:shadow-green-500/5
              ${
                stat.clickable
                  ? "cursor-pointer"
                  : "cursor-default disabled:opacity-100"
              }
            `}
          >
            <div className="absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div
                className={`absolute -right-10 -top-10 h-20 w-20 rounded-full ${stat.bgColor} blur-xl`}
              />
            </div>

            <div className="relative z-10">
              <div
                className={`
                  mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg
                  ${stat.bgColor}
                  transition-transform duration-200 group-hover:scale-110
                `}
              >
                <Icon className={`h-3.5 w-3.5 ${stat.iconColor}`} />
              </div>

              <p className="text-lg font-bold leading-none tracking-tight text-white">
                {stat.value}
              </p>

              <p className="mt-0.5 text-[10px] font-medium uppercase tracking-wider text-gray-500">
                {stat.label}
              </p>

              {stat.label === "Candidates" &&
                typeof stat.value === "number" &&
                stat.value > 0 && (
                  <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-[#1a1a24]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-400 transition-all duration-1000"
                      style={{
                        width: `${Math.min(stat.value, 100)}%`,
                      }}
                    />
                  </div>
                )}
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] origin-left scale-x-0 bg-gradient-to-r from-green-500 to-emerald-500 transition-transform duration-300 group-hover:scale-x-100" />
          </button>
        );
      })}
    </div>
  );
}