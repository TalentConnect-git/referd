import { AlumniDetailProfileProps } from "@/types/alumni";
import { Briefcase, UserCheck, UserX, TrendingUp } from "lucide-react";

export default function AlumniDetailMetrics({
  profile,
}: AlumniDetailProfileProps) {
  const openJobs = profile.referralJobs?.length || 0;
  const isHiring = profile.isHiring || false;

  return (
    <div className="rounded-2xl border border-[#2a3a52] bg-gradient-to-r from-[#111827] to-[#1a2332] p-4 shadow-xl shadow-black/20 backdrop-blur-sm">
      <h2 className="mb-3.5 flex items-center gap-2 text-sm font-bold text-white">
        <TrendingUp size={16} className="text-blue-400" />
        Metrics
      </h2>

      <div className="space-y-2.5">
        {/* Open Jobs Metric */}
        <div className="flex items-center justify-between rounded-xl border border-[#2a3a52] bg-[#0f172a] p-3 hover:border-blue-500/30 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20">
              <Briefcase size={14} className="text-blue-400" />
            </div>
            <span className="text-xs text-gray-400 font-medium">Open Jobs</span>
          </div>
          <span className="text-sm font-bold text-white">
            {openJobs}
          </span>
        </div>

        {/* Status Metric */}
        <div className="flex items-center justify-between rounded-xl border border-[#2a3a52] bg-[#0f172a] p-3 hover:border-green-500/30 transition-colors">
          <div className="flex items-center gap-2.5">
            <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${
              isHiring 
                ? "bg-green-500/10 border-green-500/20" 
                : "bg-gray-500/10 border-gray-500/20"
            }`}>
              {isHiring ? (
                <UserCheck size={14} className="text-green-400" />
              ) : (
                <UserX size={14} className="text-gray-400" />
              )}
            </div>
            <span className="text-xs text-gray-400 font-medium">Status</span>
          </div>
          <span className={`text-sm font-bold ${
            isHiring ? "text-green-400" : "text-gray-400"
          }`}>
            {isHiring ? "Hiring" : "Not Hiring"}
          </span>
        </div>

        
      </div>
    </div>
  );
}