import { AppStatusRowProps } from "@/types/dashboard";
import { Building2, Briefcase, CheckCircle, Clock, Send, UserCheck } from "lucide-react";

export default function AppStatusRow({ company, role, stage }: AppStatusRowProps) {
  // Get stage color
  const getStageColor = (stage: string): string => {
    const stageMap: Record<string, string> = {
      "Application Sent": "text-indigo-400 border-indigo-500/20 bg-indigo-500/10",
      "Applied": "text-blue-400 border-blue-500/20 bg-blue-500/10",
      "Awaiting Recruiter Action": "text-yellow-400 border-yellow-500/20 bg-yellow-500/10",
      "Shortlisted": "text-purple-400 border-purple-500/20 bg-purple-500/10",
      "Interview Scheduled": "text-cyan-400 border-cyan-500/20 bg-cyan-500/10",
      "Offer Extended": "text-emerald-400 border-emerald-500/20 bg-emerald-500/10",
      "Accepted": "text-green-400 border-green-500/20 bg-green-500/10",
      "Rejected": "text-red-400 border-red-500/20 bg-red-500/10",
      "Referred To Company": "text-orange-400 border-orange-500/20 bg-orange-500/10",
      "Offer Accepted": "text-green-600 border-green-600/20 bg-green-600/10",
      "Offer Rejected": "text-red-600 border-red-600/20 bg-red-600/10",
      "Joined the Company": "text-teal-400 border-teal-500/20 bg-teal-500/10",
      "Saved": "text-gray-400 border-gray-500/20 bg-gray-500/10",
    };
    return stageMap[stage] || "text-gray-400 border-gray-500/20 bg-gray-500/10";
  };

  // Get stage icon
  const getStageIcon = (stage: string) => {
    const iconMap: Record<string, any> = {
      "Application Sent": Send,
      "Applied": Briefcase,
      "Awaiting Recruiter Action": Clock,
      "Shortlisted": UserCheck,
      "Interview Scheduled": Clock,
      "Offer Extended": Send,
      "Accepted": CheckCircle,
      "Rejected": CheckCircle,
      "Referred To Company": Send,
      "Offer Accepted": CheckCircle,
      "Offer Rejected": CheckCircle,
      "Joined the Company": UserCheck,
      "Saved": Briefcase,
    };
    return iconMap[stage] || Briefcase;
  };

  const StageIcon = getStageIcon(stage);
  const stageColor = getStageColor(stage);

  return (
    <div className="group flex items-center justify-between border-b border-slate-800/50 px-4 py-2.5 transition-all duration-200 hover:bg-slate-800/20 last:border-b-0">
      <div className="flex items-center gap-3 min-w-0">
        {/* Company Logo Placeholder */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-slate-700/50 bg-[#1e293b] text-[10px] font-bold text-white group-hover:border-slate-600 transition-colors duration-200">
          {company.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <h3 className="text-[13px] font-semibold text-white group-hover:text-green-400 transition-colors duration-200 truncate">
            {company}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Briefcase className="w-3 h-3 text-gray-500 flex-shrink-0" />
            <p className="text-xs text-gray-400 truncate">{role}</p>
          </div>
        </div>
      </div>

      {/* Stage Badge */}
      <div className="flex items-center gap-2 ml-3">
        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium border ${stageColor}`}>
          <StageIcon className="w-3 h-3" />
          {stage}
        </span>
      </div>
    </div>
  );
}