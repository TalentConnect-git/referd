import { 
  FileText, 
  Save, 
  TrendingUp, 
  BarChart, 
  UserCheck,
  Briefcase,
  ChevronRight
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
      title: "Applications",
      value: applicationsSent,
      icon: FileText,
      color: "text-[var(--info)]",
      bgColor: "bg-[var(--info-soft)]",
      borderColor: "hover:border-[var(--info-border)]",
      redirect: `/${userType}/applications`,
      clickable: true,
    },
    {
      id: 2,
      title: "Saved Jobs",
      value: savedCount,
      icon: Save,
      color: "text-[var(--success)]",
      bgColor: "bg-[var(--success-soft)]",
      borderColor: "hover:border-[var(--success-border)]",
      redirect: `/${userType}/saved-jobs`,
      clickable: true,
    },
    {
      id: 3,
      title: "Resume Score",
      value: `${resumeScore}%`,
      icon: TrendingUp,
      color: "text-[var(--primary)]",
      bgColor: "bg-[var(--primary-soft)]",
      borderColor: "hover:border-[var(--primary-border)]",
      redirect: null,
      clickable: false,
    },
    {
      id: 4,
      title: "Hiring Score",
      value: `${hiringScore}%`,
      icon: BarChart,
      color: "text-[var(--warning)]",
      bgColor: "bg-[var(--warning-soft)]",
      borderColor: "hover:border-[var(--warning-border)]",
      redirect: null,
      clickable: false,
    },
    {
      id: 5,
      title: "Alumni Network",
      value: alumniCount,
      icon: UserCheck,
      color: "text-[var(--info)]",
      bgColor: "bg-[var(--info-soft)]",
      borderColor: "hover:border-[var(--info-border)]",
      subtitle: `${alumniCount} hiring currently`,
      redirect: `/${userType}/alumani-network`,
      clickable: true,
    },
    {
      id: 6,
      title: "Applications",
      value: applicationsSent,
      icon: Briefcase,
      color: "text-[var(--warning)]",
      bgColor: "bg-[var(--warning-soft)]",
      borderColor: "hover:border-[var(--warning-border)]",
      subtitle: `${applicationsSent} jobs applied`,
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
    <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
      {stats.map((stat) => (
        <div
          key={stat.id}
          onClick={() => handleCardClick(stat.redirect)}
          className={`
            surface-card group relative rounded-xl p-3.5 
            transition-all duration-200
            ${stat.clickable 
              ? `cursor-pointer ${stat.borderColor} hover:bg-[var(--card-hover)] hover:shadow-md hover:-translate-y-0.5` 
              : 'hover:border-[var(--border-strong)]'
            }
          `}
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="truncate text-[10px] font-medium uppercase tracking-wider text-[var(--text-muted)]">
                {stat.title}
              </p>
              <p className="mt-1 text-lg font-bold text-[var(--text-primary)]">
                {stat.value}
              </p>
              {stat.subtitle && (
                <p className="mt-0.5 truncate text-[9px] text-[var(--text-muted)]">
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
            <div className="absolute bottom-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}