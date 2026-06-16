import { ApplicationStatsProps } from "@/types/applications";

export default function ApplicationStats({
  applicationType,
  applications,
}: ApplicationStatsProps) {

const stats = {
    Applied: 0,
    "Referral Sent": 0,
    "Under Review": 0,
    Interview: 0,
    Selected: 0,
    Offer: 0,
    Joined: 0,
  };

applications.forEach((app) => {
    const status = app.currentStatus;
    if (status in stats) {
      stats[status as keyof typeof stats]++;
    }
  });

  return (
    <div className="mt-6 ml-5">
      <h2 className="text-xl font-semibold text-white mb-4">
        Application Pipeline
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-4">
        {Object.entries(stats).map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-800 bg-[#0F172A] p-4">
            <p className="text-xs text-gray-400 uppercase">
              {label}
            </p>

            <p className="text-3xl font-bold text-white mt-2">
              {value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );

}