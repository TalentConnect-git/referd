import { AlumniDetailProfileProps } from "@/types/alumni";
import { Briefcase, UserCheck, UserX, TrendingUp } from "lucide-react";

export default function AlumniDetailMetrics({
  profile,
}: AlumniDetailProfileProps) {
  const openJobs = profile.referralJobs?.length || 0;
  const isHiring = profile.isHiring || false;

  return (
    <div className="card rounded-2xl border border-theme bg-gradient-to-r from-card to-card-soft p-4 shadow-xl shadow-black/20 backdrop-blur-sm">
      <h2 className="mb-3.5 flex items-center gap-2 text-sm font-bold text-primary">
        <TrendingUp size={16} className="text-info" />
        Metrics
      </h2>

      <div className="space-y-2.5">
        {/* Open Jobs Metric */}
        <div className="flex items-center justify-between rounded-xl border border-theme bg-background p-3 hover:border-info/30 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-info-soft border border-info/20">
              <Briefcase size={14} className="text-info" />
            </div>
            <span className="text-xs text-muted font-medium">Open Jobs</span>
          </div>
          <span className="text-sm font-bold text-primary">
            {openJobs}
          </span>
        </div>

        {/* Status Metric */}
        <div className="flex items-center justify-between rounded-xl border border-theme bg-background p-3 hover:border-success/30 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
              isHiring 
                ? "bg-success-soft border-success/20" 
                : "bg-background-soft border-theme"
            }`}>
              {isHiring ? (
                <UserCheck size={14} className="text-success" />
              ) : (
                <UserX size={14} className="text-muted" />
              )}
            </div>
            <span className="text-xs text-muted font-medium">Status</span>
          </div>
          <span className={`text-sm font-bold ${
            isHiring ? "text-success" : "text-muted"
          }`}>
            {isHiring ? "Hiring" : "Not Hiring"}
          </span>
        </div>

        
      </div>
    </div>
  );
}