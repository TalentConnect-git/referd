import { ApplicationStatsProps } from "@/types/applications";
import { 
  FileText, 
  Send, 
  Clock, 
  Mic, 
  CheckCircle, 
  Gift, 
  UserCheck,
  Bookmark,
  XCircle,
  UserX,
  Briefcase
} from "lucide-react";

export default function ApplicationStats({
  applicationType,
  applications,
}: ApplicationStatsProps) {

  console.log("stats", applications);

  // Initialize stats with all enum values
  const stats = {
    "Saved": 0,
    "Applied": 0,
    "Application Sent": 0,
    "Awaiting Recruiter Action": 0,
    "Shortlisted": 0,
    "Interview Scheduled": 0,
    "Offer Extended": 0,
    "Accepted": 0,
    "Rejected": 0,
    "Referred To Company": 0,
    "Offer Accepted": 0,
    "Offer Rejected": 0,
    "Joined the Company": 0,
  };

  // Process each application's status history
  applications.forEach((app) => {
    // Get statusHistory array
    const statusHistory = app.statusHistory || [];
    
    // If no status history, use currentStatus
    if (statusHistory.length === 0) {
      const currentStatus = app.currentStatus;
      if (currentStatus && typeof currentStatus === 'string' && currentStatus in stats) {
        stats[currentStatus as keyof typeof stats]++;
      }
    } else {
      // Process each status in history
      statusHistory.forEach((historyItem: any) => {
        const status = historyItem.status;
        if (status && typeof status === 'string' && status in stats) {
          stats[status as keyof typeof stats]++;
        }
      });
    }
  });

  // Define which statuses to display based on application type
  const getDisplayStatuses = () => {
    // For "Internship" and "Off-campus" - show all statuses except Saved
    if (applicationType === "Internship" || applicationType === "Off-campus") {
      return [
        "Application Sent",
        "Applied",
        "Awaiting Recruiter Action",
        "Shortlisted",
        "Interview Scheduled",
        "Offer Extended",
        "Accepted",
        "Rejected",
        "Offer Accepted",
        "Offer Rejected",
        "Joined the Company"
      ];
    }
   
    if (applicationType === "Referral") {
      return [
        "Application Sent",
        "Referred To Company",
        "Applied",
        "Shortlisted",
        "Interview Scheduled",
        "Offer Extended",
        "Accepted",
        "Rejected"
      ];
    }
    
    // Default - show all except Saved
    return Object.keys(stats).filter(key => key !== "Saved");
  };

  // Get display stats based on type - include all statuses even with 0 value
  const displayStats = getDisplayStatuses().reduce((acc, key) => {
    acc[key] = stats[key as keyof typeof stats] || 0;
    return acc;
  }, {} as Record<string, number>);

  // Get icon for each stat
  const getIcon = (label: string) => {
    const icons: Record<string, any> = {
      "Saved": Bookmark,
      "Application Sent": Send,
      "Applied": FileText,
      "Awaiting Recruiter Action": Clock,
      "Shortlisted": UserCheck,
      "Interview Scheduled": Mic,
      "Offer Extended": Gift,
      "Accepted": CheckCircle,
      "Rejected": XCircle,
      "Referred To Company": Send,
      "Offer Accepted": CheckCircle,
      "Offer Rejected": UserX,
      "Joined the Company": Briefcase,
    };
    return icons[label] || FileText;
  };

  // Get color for each stat
  const getColor = (label: string): string => {
    const colors: Record<string, string> = {
      "Saved": "text-gray-400 border-gray-500/20 bg-gray-500/5",
      "Application Sent": "text-indigo-400 border-indigo-500/20 bg-indigo-500/5",
      "Applied": "text-blue-400 border-blue-500/20 bg-blue-500/5",
      "Awaiting Recruiter Action": "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
      "Shortlisted": "text-purple-400 border-purple-500/20 bg-purple-500/5",
      "Interview Scheduled": "text-cyan-400 border-cyan-500/20 bg-cyan-500/5",
      "Offer Extended": "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      "Accepted": "text-green-400 border-green-500/20 bg-green-500/5",
      "Rejected": "text-red-400 border-red-500/20 bg-red-500/5",
      "Referred To Company": "text-orange-400 border-orange-500/20 bg-orange-500/5",
      "Offer Accepted": "text-green-600 border-green-600/20 bg-green-600/5",
      "Offer Rejected": "text-red-600 border-red-600/20 bg-red-600/5",
      "Joined the Company": "text-teal-400 border-teal-500/20 bg-teal-500/5",
    };
    return colors[label] || "text-gray-400 border-slate-700 bg-slate-800/5";
  };

  // Get short label for display
  const getShortLabel = (label: string): string => {
    const shortLabels: Record<string, string> = {
      "Saved": "Saved",
      "Application Sent": "Sent",
      "Awaiting Recruiter Action": "Awaiting",
      "Interview Scheduled": "Interview",
      "Offer Extended": "Offer Ext",
      "Referred To Company": "Referred",
      "Offer Accepted": "Offer Acc",
      "Offer Rejected": "Offer Rej",
      "Joined the Company": "Joined",
    };
    return shortLabels[label] || label;
  };

  // Get opacity class based on value
  const getOpacityClass = (value: number): string => {
    return value === 0 ? "opacity-40" : "opacity-100";
  };

  // Convert displayStats object to array for rendering - include all statuses
  const allStats = Object.entries(displayStats).sort((a, b) => {
    // Sort by status order priority
    const order = getDisplayStatuses();
    return order.indexOf(a[0]) - order.indexOf(b[0]);
  });

  // If no applications, show a message
  if (applications.length === 0) {
    return (
      <div className="mt-6 ml-5 mr-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-white">
            Application Pipeline
          </h2>
          <span className="text-sm text-gray-400">
            Total: <span className="text-white font-semibold">{applications.length}</span>
          </span>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-800/20 p-8 text-center">
          <p className="text-gray-400">No applications in pipeline yet.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 ml-5 mr-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">
          Application Pipeline
        </h2>
        <span className="text-sm text-gray-400">
          Total: <span className="text-white font-semibold">{applications.length}</span>
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-7 gap-3">
        {allStats.map(([label, value]) => {
          const Icon = getIcon(label);
          const color = getColor(label);
          const shortLabel = getShortLabel(label);
          const opacityClass = getOpacityClass(value);

          return (
            <div
              key={label}
              className={`
                rounded-xl border p-3 transition-all duration-200
                ${color}
                ${opacityClass}
                ${value > 0 ? 'hover:scale-105 hover:shadow-lg' : ''}
              `}
            >
              <div className="flex items-center gap-1.5">
                <Icon className={`w-3.5 h-3.5 ${color.split(' ')[0]}`} />
                <p className="text-[9px] text-gray-400 uppercase tracking-wider truncate">
                  {shortLabel}
                </p>
              </div>

              <p className={`text-xl font-bold mt-1.5 ${color.split(' ')[0]}`}>
                {value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}