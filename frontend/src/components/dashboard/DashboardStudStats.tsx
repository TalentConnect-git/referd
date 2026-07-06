import { 
  FileText, 
  Save, 
  TrendingUp, 
  BarChart, 
  UserCheck,
  Briefcase
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardStudStatsProps {
  applicationsSent: number;
  savedCount: number;
  resumeScore: number;
  hiringScore: number;
  alumniCount: number;
  userType: string;
}

export default function DashboardStudStats({
  applicationsSent,
  savedCount,
  resumeScore,
  hiringScore,
  alumniCount,
  userType,
}: DashboardStudStatsProps) {
  const router = useRouter();

  const stats = [
    {
      id: 1,
      title: "Applications Sent",
      value: applicationsSent,
      icon: FileText,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      subtitle: `You have applied to ${applicationsSent} jobs`,
      redirect: `/${userType}/applications`,
      clickable: true,
    },
    {
      id: 2,
      title: "Saved Jobs",
      value: savedCount,
      icon: Save,
      color: "text-green-400",
      bgColor: "bg-green-500/10",
      redirect: `/${userType}/saved-jobs`,
      clickable: true,
    },
    {
      id: 3,
      title: "Resume Score",
      value: `${resumeScore}/100`,
      icon: TrendingUp,
      color: "text-purple-400",
      bgColor: "bg-purple-500/10",
      redirect: null,
      clickable: false,
    },
    {
      id: 4,
      title: "Hiring Score",
      value: `${hiringScore}/100`,
      icon: BarChart,
      color: "text-yellow-400",
      bgColor: "bg-yellow-500/10",
      redirect: null,
      clickable: false,
    },
    {
      id: 5,
      title: "Alumni Network",
      value: alumniCount,
      icon: UserCheck,
      color: "text-pink-400",
      bgColor: "bg-pink-500/10",
      subtitle: `${alumniCount} Connected alumni`,
      redirect: `/${userType}/alumani-network`,
      clickable: true,
    },
    {
      id: 6,
      title: "Applications Length",
      value: applicationsSent,
      icon: Briefcase,
      color: "text-orange-400",
      bgColor: "bg-orange-500/10",
      subtitle: `Total applications: ${applicationsSent}`,
      redirect: `/${userType}/applications`,
      clickable: true,
    },
  ];

  const handleCardClick = (redirect: string | null) => {
    if (redirect) {
      router.push(redirect);
    }
  };

  return (
    <div className="flex ml-4 mr-4 flex-wrap gap-4">
      {stats.map((stat) => (
        <div
          key={stat.id}
          onClick={() => handleCardClick(stat.redirect)}
          className={`flex-1 min-w-[140px] rounded-2xl border border-[#1e293b] bg-[#0f172a] p-4 transition-all duration-200 ${
            stat.clickable 
              ? 'cursor-pointer hover:border-[#ec4899] hover:bg-[#1a1035] hover:shadow-lg hover:shadow-pink-500/10' 
              : 'hover:border-[#2a3441]'
          }`}
        >
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs text-gray-400 break-words whitespace-normal leading-tight">
                {stat.title}
              </p>
              <p className="mt-1 text-xl font-bold text-white">{stat.value}</p>
              {stat.subtitle && (
                <p className="mt-0.5 text-[10px] text-gray-500 break-words whitespace-normal">
                  {stat.subtitle}
                </p>
              )}
            </div>
            <div className={`flex-shrink-0 rounded-xl ${stat.bgColor} p-2 ml-2 transition-colors ${
              stat.clickable ? 'group-hover:bg-pink-500/20' : ''
            }`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </div>
          {stat.clickable && (
            <div className="mt-2 flex items-center text-[10px] text-pink-400 opacity-0 transition-opacity group-hover:opacity-100">
              <span>Click to view</span>
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}