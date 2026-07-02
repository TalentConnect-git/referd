import { ReferralStatsProps } from "@/types/referral";
export default function ReferralStats({
  metrics,
}: ReferralStatsProps) {
  const stats = [
    {
      label: "Candidates",
      value: metrics.totalApplicationsReceived,
    },
    {
      label: "Response %",
      value: `${metrics.responseRate}%`,
    },
    {
      label: "Referred",
      value: metrics.totalReferredToCompany,
    },
    {
      label: "Interviews",
      value: metrics.totalInterviewScheduled,
    },
    {
      label: "Accepted",
      value: metrics.totalAcceptedByCompany,
    },
  ];

  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-4 my-5">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="rounded-xl border border-[var(--border)] p-3"
        >
          <p className="text-sm text-muted-foreground uppercase">
            {stat.label}
          </p>

          <p className="mt-3 text-lg font-semibold">
            {stat.value}
          </p>
        </div>
      ))}
    </div>
  );
}