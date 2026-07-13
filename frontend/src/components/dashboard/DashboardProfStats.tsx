import {
  Users,
  Briefcase,
  TrendingUp,
  Award,
  Clock,
  UserCheck,
  ChevronRight,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardProfStatsProps {
  totalReferralsPosted: number;
  totalApplicationsReceived: number;
  responseRate: number;
  referralSuccessRate: number;
  candidatesWaiting: number;
  alumniCount: number;
  userType: string;
}

export default function DashboardProfStats({
  totalReferralsPosted,
  totalApplicationsReceived,
  responseRate,
  referralSuccessRate,
  candidatesWaiting,
  alumniCount,
  userType,
}: DashboardProfStatsProps) {
  const router = useRouter();

  const stats = [
    {
      id: 1,
      title: "Referrals Posted",
      value: totalReferralsPosted,
      icon: Briefcase,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "hover:border-blue-500/30",
      redirect: `/${userType}/referrals`,
      clickable: true,
    },
    {
      id: 2,
      title: "Applications",
      value: totalApplicationsReceived,
      icon: Users,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "hover:border-green-500/30",
      redirect: `/${userType}/applications`,
      clickable: true,
    },
    {
      id: 3,
      title: "Response Rate",
      value: `${responseRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      borderColor: "hover:border-purple-500/30",
      redirect: null,
      clickable: false,
    },
    {
      id: 4,
      title: "Success Rate",
      value: `${referralSuccessRate.toFixed(1)}%`,
      icon: Award,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      borderColor: "hover:border-yellow-500/30",
      redirect: null,
      clickable: false,
    },
    {
      id: 5,
      title: "Candidates Waiting",
      value: candidatesWaiting,
      icon: Clock,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      borderColor: "hover:border-orange-500/30",
      subtitle: "Awaiting response",
      redirect: `/${userType}/applications`,
      clickable: true,
    },
    {
      id: 6,
      title: "Alumni Network",
      value: alumniCount,
      icon: UserCheck,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      borderColor: "hover:border-pink-500/30",
      subtitle: `${alumniCount} hiring currently`,
      redirect: `/${userType}/alumani-network`,
      clickable: true,
    },
  ];

  const handleCardClick = (redirect: string | null) => {
    if (redirect) {
      router.push(redirect);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
      {stats.map((stat) => (
        <div
          key={stat.id}
          onClick={() => handleCardClick(stat.redirect)}
          className={`
            group relative rounded-xl border border-slate-800 bg-[#0f172a] p-3.5 
            transition-all duration-200
            ${stat.clickable 
              ? `cursor-pointer ${stat.borderColor} hover:bg-slate-800/30 hover:shadow-lg hover:shadow-slate-900/30 hover:-translate-y-0.5` 
              : 'hover:border-slate-700'
            }
          `}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] font-medium text-gray-400 uppercase tracking-wider truncate">
                {stat.title}
              </p>
              <p className="mt-1 text-lg font-bold text-white">
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className="mt-0.5 text-[9px] text-gray-500 truncate">
                  {stat.subtitle}
                </p>
              )}
            </div>
            
            {/* Icon */}
            <div className={`
              flex-shrink-0 rounded-lg ${stat.bgColor} p-1.5 
              transition-all duration-200
              ${stat.clickable ? 'group-hover:scale-110 group-hover:rotate-3' : ''}
            `}>
              <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
            </div>
          </div>

          {/* Click indicator - shown on hover for clickable cards */}
          {stat.clickable && (
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ChevronRight className="h-3.5 w-3.5 text-gray-500" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}