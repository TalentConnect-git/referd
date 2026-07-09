import { ReferralStatsProps } from "@/types/referral";
import { 
  Users, 
  TrendingUp, 
  UserCheck, 
  Calendar, 
  Award,
} from "lucide-react";

export default function ReferralStats({
  metrics,
}: ReferralStatsProps) {
  const stats = [
    {
      label: "Candidates",
      value: metrics.totalApplicationsReceived,
      icon: Users,
      color: "blue",
      bgColor: "bg-blue-500/10",
      iconColor: "text-blue-400",
      borderColor: "border-blue-500/20",
    },
    {
      label: "Response Rate",
      value: `${metrics.responseRate}%`,
      icon: TrendingUp,
      color: "purple",
      bgColor: "bg-purple-500/10",
      iconColor: "text-purple-400",
      borderColor: "border-purple-500/20",
    },
    {
      label: "Referred",
      value: metrics.totalReferredToCompany,
      icon: UserCheck,
      color: "green",
      bgColor: "bg-green-500/10",
      iconColor: "text-green-400",
      borderColor: "border-green-500/20",
    },
    {
      label: "Interviews",
      value: metrics.totalInterviewScheduled,
      icon: Calendar,
      color: "orange",
      bgColor: "bg-orange-500/10",
      iconColor: "text-orange-400",
      borderColor: "border-orange-500/20",
    },
    {
      label: "Accepted",
      value: metrics.totalAcceptedByCompany,
      icon: Award,
      color: "emerald",
      bgColor: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      borderColor: "border-emerald-500/20",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 my-3">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <div
            key={stat.label}
            className={`
              group
              relative
              overflow-hidden
              rounded-lg
              border
              ${stat.borderColor}
              bg-gradient-to-br from-[var(--card)] to-[#0d0d14]
              px-3 py-2.5
              transition-all
              duration-200
              hover:scale-[1.02]
              hover:shadow-md
              hover:shadow-green-500/5
              hover:border-green-500/30
            `}
          >
            {/* Glow Effect - Subtle */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className={`absolute -top-10 -right-10 w-20 h-20 ${stat.bgColor} rounded-full blur-xl`} />
            </div>

            {/* Content */}
            <div className="relative z-10">
              {/* Icon */}
              <div className={`
                w-7 h-7 
                rounded-lg 
                ${stat.bgColor} 
                flex items-center justify-center
                group-hover:scale-110
                transition-transform
                duration-200
                mb-1.5
              `}>
                <Icon className={`w-3.5 h-3.5 ${stat.iconColor}`} />
              </div>

              {/* Value */}
              <p className="text-lg font-bold text-white tracking-tight leading-none">
                {stat.value}
              </p>

              {/* Label */}
              <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider mt-0.5">
                {stat.label}
              </p>

              {/* Progress Bar - More Compact */}
              {stat.label === "Candidates" && typeof stat.value === 'number' && stat.value > 0 && (
                <div className="mt-1.5 w-full h-0.5 bg-[#1a1a24] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-blue-400 rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min((stat.value / 100) * 100, 100)}%` }}
                  />
                </div>
              )}
            </div>

            {/* Hover Border Animation */}
            <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-green-500 to-emerald-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
          </div>
        );
      })}
    </div>
  );
}