import { AppStatusRowProps } from "@/types/dashboard";
import { Building2, Briefcase, CheckCircle, Clock, Send, UserCheck } from "lucide-react";

export default function AppStatusRow({ company, role, stage }: AppStatusRowProps) {
  // Get stage color using theme variables
  const getStageColor = (stage: string): string => {
    const stageMap: Record<string, string> = {
      "Application Sent": "text-[var(--primary)] border-[var(--primary-border)] bg-[var(--primary-soft)]",
      "Applied": "text-[var(--info)] border-[var(--info-border)] bg-[var(--info-soft)]",
      "Awaiting Recruiter Action": "text-[var(--warning)] border-[var(--warning-border)] bg-[var(--warning-soft)]",
      "Shortlisted": "text-[var(--primary)] border-[var(--primary-border)] bg-[var(--primary-soft)]",
      "Interview Scheduled": "text-[var(--info)] border-[var(--info-border)] bg-[var(--info-soft)]",
      "Offer Extended": "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]",
      "Accepted": "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]",
      "Rejected": "text-[var(--danger)] border-[var(--danger-border)] bg-[var(--danger-soft)]",
      "Referred To Company": "text-[var(--primary)] border-[var(--primary-border)] bg-[var(--primary-soft)]",
      "Offer Accepted": "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]",
      "Offer Rejected": "text-[var(--danger)] border-[var(--danger-border)] bg-[var(--danger-soft)]",
      "Joined the Company": "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]",
      "Saved": "text-[var(--text-muted)] border-[var(--border)] bg-[var(--background-soft)]",
    };
    return stageMap[stage] || "text-[var(--text-muted)] border-[var(--border)] bg-[var(--background-soft)]";
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
    <div className="group flex items-center justify-between border-b border-[var(--border)] px-3 py-2.5 transition-all duration-200 hover:bg-[var(--card-hover)] last:border-b-0 sm:px-4">
      <div className="flex min-w-0 items-center gap-3">
        {/* Company Logo Placeholder */}
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[var(--border)] bg-[var(--background-soft)] text-[10px] font-bold text-[var(--text-secondary)] transition-colors duration-200 group-hover:border-[var(--border-strong)]">
          {company.charAt(0).toUpperCase()}
        </div>

        <div className="min-w-0">
          <h3 className="truncate text-sm font-semibold text-[var(--text-primary)] transition-colors duration-200 group-hover:text-[var(--primary)]">
            {company}
          </h3>
          <div className="mt-0.5 flex items-center gap-1.5">
            <Briefcase className="h-3 w-3 flex-shrink-0 text-[var(--text-muted)]" />
            <p className="truncate text-xs text-[var(--text-secondary)]">{role}</p>
          </div>
        </div>
      </div>

      {/* Stage Badge */}
      <div className="ml-3 flex items-center gap-2">
        <span className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-1 text-[10px] font-medium ${stageColor}`}>
          <StageIcon className="h-3 w-3" />
          <span className="hidden xs:inline">{stage}</span>
          <span className="inline xs:hidden">{stage.substring(0, 8)}...</span>
        </span>
      </div>
    </div>
  );
}