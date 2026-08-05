"use client";

import { lazy, Suspense } from "react";
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

// Lazy load the stats cards
const StatsCard = lazy(() => Promise.resolve({
  default: ({ stat, handleCardClick }: any) => (
    <div
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
        
        <div className={`
          flex-shrink-0 rounded-lg ${stat.bgColor} p-1.5 
          transition-all duration-200
          ${stat.clickable ? 'group-hover:scale-110 group-hover:rotate-3' : ''}
        `}>
          <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
        </div>
      </div>

      {stat.clickable && (
        <div className="absolute bottom-2 right-2 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          <ChevronRight className="h-3.5 w-3.5 text-[var(--text-muted)]" />
        </div>
      )}
    </div>
  )
}));

// Skeleton component
const StatsSkeleton = () => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <div
        key={i}
        className="surface-card rounded-xl p-3.5 border border-[var(--border)]"
      >
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1 space-y-2">
            <div className="skeleton shimmer h-2.5 w-16 rounded" />
            <div className="skeleton shimmer h-5 w-12 rounded" />
            <div className="skeleton shimmer h-2 w-14 rounded" />
          </div>
          <div className="skeleton shimmer h-7 w-7 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

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
      color: "text-[var(--info)]",
      bgColor: "bg-[var(--info-soft)]",
      borderColor: "hover:border-[var(--info-border)]",
      redirect: `/${userType}/referrals`,
      clickable: true,
    },
    {
      id: 2,
      title: "Applications",
      value: totalApplicationsReceived,
      icon: Users,
      color: "text-[var(--success)]",
      bgColor: "bg-[var(--success-soft)]",
      borderColor: "hover:border-[var(--success-border)]",
      redirect: `/${userType}/applications`,
      clickable: true,
    },
    {
      id: 3,
      title: "Response Rate",
      value: `${responseRate.toFixed(1)}%`,
      icon: TrendingUp,
      color: "text-[var(--primary)]",
      bgColor: "bg-[var(--primary-soft)]",
      borderColor: "hover:border-[var(--primary-border)]",
      redirect: null,
      clickable: false,
    },
    {
      id: 4,
      title: "Success Rate",
      value: `${referralSuccessRate.toFixed(1)}%`,
      icon: Award,
      color: "text-[var(--warning)]",
      bgColor: "bg-[var(--warning-soft)]",
      borderColor: "hover:border-[var(--warning-border)]",
      redirect: null,
      clickable: false,
    },
    {
      id: 5,
      title: "Candidates Waiting",
      value: candidatesWaiting,
      icon: Clock,
      color: "text-[var(--warning)]",
      bgColor: "bg-[var(--warning-soft)]",
      borderColor: "hover:border-[var(--warning-border)]",
      subtitle: "Awaiting response",
      redirect: `/${userType}/applications`,
      clickable: true,
    },
    {
      id: 6,
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
  ];

  const handleCardClick = (redirect: string | null) => {
    if (redirect) {
      router.push(redirect);
    }
  };

  return (
    <Suspense fallback={<StatsSkeleton />}>
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <StatsCard key={stat.id} stat={stat} handleCardClick={handleCardClick} />
        ))}
      </div>
    </Suspense>
  );
}