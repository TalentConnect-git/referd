import { ApplicationStatsProps } from "@/types/applications";
import { 
  FileText, 
  Send, 
  Clock, 
  Mic, 
  CheckCircle, 
  Gift, 
  UserCheck 
} from "lucide-react";

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
    if (status && typeof status === 'string' && status in stats) {
      stats[status as keyof typeof stats]++;
    }
  });

  // Get icon for each stat
  const getIcon = (label: string) => {
    const icons: Record<string, any> = {
      "Applied": FileText,
      "Referral Sent": Send,
      "Under Review": Clock,
      "Interview": Mic,
      "Selected": CheckCircle,
      "Offer": Gift,
      "Joined": UserCheck,
    };
    return icons[label] || FileText;
  };

  // Get color for each stat
  const getColor = (label: string): string => {
    const colors: Record<string, string> = {
      "Applied": "text-blue-400 border-blue-500/20 bg-blue-500/5",
      "Referral Sent": "text-purple-400 border-purple-500/20 bg-purple-500/5",
      "Under Review": "text-yellow-400 border-yellow-500/20 bg-yellow-500/5",
      "Interview": "text-orange-400 border-orange-500/20 bg-orange-500/5",
      "Selected": "text-green-400 border-green-500/20 bg-green-500/5",
      "Offer": "text-emerald-400 border-emerald-500/20 bg-emerald-500/5",
      "Joined": "text-teal-400 border-teal-500/20 bg-teal-500/5",
    };
    return colors[label] || "text-gray-400 border-slate-700 bg-slate-800/5";
  };

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
        {Object.entries(stats).map(([label, value]) => {
          const Icon = getIcon(label);
          const color = getColor(label);
          const isActive = value > 0;

          return (
            <div
              key={label}
              className={`
                rounded-xl border p-4 transition-all duration-200
                ${color}
                ${isActive ? 'hover:scale-105 hover:shadow-lg' : 'opacity-60'}
              `}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-4 h-4 ${color.split(' ')[0]}`} />
                <p className="text-[10px] text-gray-400 uppercase tracking-wider">
                  {label}
                </p>
              </div>

              <p className={`text-2xl font-bold mt-2 ${color.split(' ')[0]}`}>
                {value}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}