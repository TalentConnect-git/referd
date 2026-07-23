"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { getInterviews, getUnreadInterviews } from "@/services/navbar.service";
import { Interview } from "@/types/navbar";
import {
  Calendar,
  Clock,
  Building2,
  Briefcase,
  Video,
  ChevronRight,
  Circle,
  Loader2,
  CalendarDays,
  MessageSquare,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Bell,
  Eye,
  ArrowLeft,
  Filter,
} from "lucide-react";
import Link from "next/link";

export default function InterviewsPage() {
  const router = useRouter();
  const { profile, user } = useAuth();
  const userType = profile?.profileType || user?.userType || "student";
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [unreadInterviews, setUnreadInterviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "upcoming" | "completed" | "missed">("all");

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const [allRes, unreadRes] = await Promise.all([
          getInterviews(),
          getUnreadInterviews(),
        ]);
        setInterviews(allRes.data);
        setUnreadInterviews(unreadRes.data.map((item: any) => item._id));
      } catch (err) {
        console.log("Error fetching interviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Tomorrow";
    } else {
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Scheduled":
        return "text-green-400 bg-green-500/10 border-green-500/20";
      case "Completed":
        return "text-blue-400 bg-blue-500/10 border-blue-500/20";
      case "Missed":
        return "text-red-400 bg-red-500/10 border-red-500/20";
      default:
        return "text-gray-400 bg-gray-500/10 border-gray-500/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Circle className="w-2 h-2 fill-green-400 text-green-400" />;
      case "Completed":
        return <CheckCircle2 className="w-3 h-3 text-blue-400" />;
      case "Missed":
        return <XCircle className="w-3 h-3 text-red-400" />;
      default:
        return <Circle className="w-2 h-2 fill-gray-400 text-gray-400" />;
    }
  };

  const getTimeRemaining = (dateString: string, timeString: string) => {
    const interviewDateTime = new Date(`${dateString}T${timeString}`);
    const now = new Date();
    const diff = interviewDateTime.getTime() - now.getTime();

    if (diff < 0) return "Past";
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h left`;
    }
    if (hours > 0) return `${hours}h ${minutes}m left`;
    if (minutes > 0) return `${minutes}m left`;
    return "Starting soon!";
  };

  const handleInterviewClick = (interviewId: string) => {
    router.push(`/${userType}/applications/interview/${interviewId}`);
  };

  const filteredInterviews = interviews.filter((interview) => {
    if (filter === "all") return true;
    if (filter === "upcoming") return interview.status === "Scheduled";
    if (filter === "completed") return interview.status === "Completed";
    if (filter === "missed") return interview.status === "Missed";
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Loader2 className="w-10 h-10 animate-spin text-green-400" />
            <div className="absolute inset-0 w-10 h-10 rounded-full border-2 border-green-400/20 animate-ping" />
          </div>
          <p className="text-gray-400 text-sm">Loading your interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F172A] px-4 py-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors border border-slate-700/50"
          >
            <ArrowLeft className="w-5 h-5 text-gray-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">All Interviews</h1>
            <p className="text-sm text-gray-400 mt-0.5">
              {interviews.length} total • {interviews.filter(i => i.status === "Scheduled").length} upcoming
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === "all"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-slate-800/50 text-gray-400 border border-slate-700/50 hover:bg-slate-700/50"
            }`}
          >
            All ({interviews.length})
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === "upcoming"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "bg-slate-800/50 text-gray-400 border border-slate-700/50 hover:bg-slate-700/50"
            }`}
          >
            Upcoming ({interviews.filter(i => i.status === "Scheduled").length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === "completed"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "bg-slate-800/50 text-gray-400 border border-slate-700/50 hover:bg-slate-700/50"
            }`}
          >
            Completed ({interviews.filter(i => i.status === "Completed").length})
          </button>
          <button
            onClick={() => setFilter("missed")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              filter === "missed"
                ? "bg-red-500/20 text-red-400 border border-red-500/30"
                : "bg-slate-800/50 text-gray-400 border border-slate-700/50 hover:bg-slate-700/50"
            }`}
          >
            Missed ({interviews.filter(i => i.status === "Missed").length})
          </button>
        </div>

        {/* Interview List */}
        {filteredInterviews.length > 0 ? (
          <div className="space-y-3">
            {filteredInterviews.map((interview) => (
              <InterviewCard
                key={interview._id}
                interview={interview}
                userType={userType}
                formatDate={formatDate}
                getStatusColor={getStatusColor}
                getStatusIcon={getStatusIcon}
                getTimeRemaining={getTimeRemaining}
                onInterviewClick={handleInterviewClick}
                isUnread={unreadInterviews.includes(interview._id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 bg-slate-800/20 rounded-xl border border-slate-800">
            <Filter className="w-12 h-12 text-gray-600 mb-3" />
            <p className="text-gray-400 text-sm">No interviews match this filter</p>
            <button
              onClick={() => setFilter("all")}
              className="mt-3 text-xs text-green-400 hover:text-green-300 transition-colors"
            >
              View all interviews
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Interview Card Component (same as in InterviewCall)
const InterviewCard = ({
  interview,
  userType,
  formatDate,
  getStatusColor,
  getStatusIcon,
  getTimeRemaining,
  onInterviewClick,
  isPast = false,
  isUnread = false,
}: {
  interview: Interview;
  userType: string;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getTimeRemaining: (date: string, time: string) => string;
  onInterviewClick: (id: string) => void;
  isPast?: boolean;
  isUnread?: boolean;
}) => {
  const isUpcoming = interview.status === "Scheduled";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group bg-slate-800/30 hover:bg-slate-800/50 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        isUpcoming
          ? `border-slate-700/50 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5 ${
              isUnread ? "border-l-4 border-l-yellow-400" : ""
            }`
          : "border-slate-700/30 hover:border-slate-600 opacity-80 hover:opacity-100"
      }`}
      onClick={() => onInterviewClick(interview._id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex flex-col sm:flex-row sm:items-start gap-3 sm:gap-4">
          {/* Left - Icon */}
          <div className="flex-shrink-0 self-start sm:self-auto relative">
            <div
              className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
                isUpcoming
                  ? "bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20 group-hover:scale-105"
                  : "bg-slate-700/30 border border-slate-600/20"
              }`}
            >
              {isUpcoming ? (
                <Briefcase className="w-5 h-5 text-green-400" />
              ) : (
                <CheckCircle2 className="w-5 h-5 text-gray-500" />
              )}
            </div>
            {isUnread && isUpcoming && (
              <div className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-yellow-400 rounded-full animate-pulse" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <h4 className="text-sm font-semibold text-white group-hover:text-green-400 transition-colors">
                  {interview.jobId?.jobTitle || "Interview"}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-400">
                    {interview.companySnapshot?.companyName || "Company"}
                  </p>
                </div>
              </div>
              {isUpcoming && (
                <div className="flex-shrink-0 flex items-center gap-2">
                  {isUnread && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] text-yellow-400 font-medium">
                      <Eye className="w-2.5 h-2.5" />
                      New
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] text-green-400 font-medium">
                    Upcoming
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 mt-2.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-300">{formatDate(interview.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-300">{interview.time}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
              {interview.meetLink && (
                <a
                  href={interview.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Video className="w-3 h-3" />
                  <span className="hidden xs:inline">Join Meeting</span>
                  <span className="xs:hidden">Join</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
              {interview.message && (
                <div className="flex items-start gap-1.5 min-w-0 flex-1">
                  <MessageSquare className="w-3 h-3 text-gray-500 mt-0.5" />
                  <p className="text-xs text-gray-400 truncate">{interview.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 sm:gap-1.5 flex-shrink-0 w-full sm:w-auto">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(
                interview.status
              )}`}
            >
              {getStatusIcon(interview.status)}
              <span className="hidden xs:inline">{interview.status}</span>
              <span className="xs:hidden">
                {interview.status === "Scheduled" ? "Upcoming" : interview.status}
              </span>
            </span>
            {isUpcoming && !isPast && (
              <span className="text-[10px] text-yellow-400/70 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20 whitespace-nowrap">
                {getTimeRemaining(interview.date, interview.time)}
              </span>
            )}
            <ChevronRight
              className={`w-4 h-4 text-gray-500 transition-all duration-300 hidden sm:block ${
                isHovered ? "translate-x-1 text-gray-300" : ""
              }`}
            />
          </div>
        </div>

        {isUpcoming && (
          <div className="mt-3 h-0.5 w-full bg-slate-700/30 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-400 to-emerald-300 rounded-full transition-all duration-1000"
              style={{
                width: `${Math.min(
                  100,
                  ((Date.now() - new Date(interview.date).getTime()) /
                    (7 * 24 * 60 * 60 * 1000)) *
                    100
                )}%`,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};