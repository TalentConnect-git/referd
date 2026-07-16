"use client";

import { useEffect, useState } from "react";
import { getInterviews } from "@/services/navbar.service";
import { Interview } from "@/types/navbar";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
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
  AlertCircle,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Users,
  MapPin,
  Sparkles,
  Bell,
} from "lucide-react";

export default function InterviewCall() {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const router = useRouter();
  const { profile, user } = useAuth();
  const userType = profile?.profileType || user?.userType || "student";

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const res = await getInterviews();
        setInterviews(res.data);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  // Group interviews by status
  const upcomingInterviews = interviews.filter(
    (interview) => interview.status === "Scheduled"
  );
  const completedInterviews = interviews.filter(
    (interview) => interview.status === "Completed" || interview.status === "Missed"
  );

  // Sort upcoming interviews by date (nearest first)
  const sortedUpcoming = [...upcomingInterviews].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Sort completed interviews by date (most recent first)
  const sortedCompleted = [...completedInterviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Format date for display
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

  // Get status color
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

  // Get status icon
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

  // Get time remaining
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Loader2 className="w-8 h-8 animate-spin text-green-400" />
            <div className="absolute inset-0 w-8 h-8 rounded-full border-2 border-green-400/20 animate-ping" />
          </div>
          <p className="text-gray-400 text-sm">Loading your interviews...</p>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 bg-gradient-to-b from-slate-800/30 to-transparent rounded-xl border border-slate-800">
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-slate-800/50 flex items-center justify-center">
            <CalendarDays className="w-10 h-10 text-gray-600" />
          </div>
          <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-green-400" />
          </div>
        </div>
        <h3 className="text-lg font-semibold text-white mt-4">No Interviews Scheduled</h3>
        <p className="text-gray-400 text-sm text-center max-w-sm mt-1">
          You don't have any upcoming interviews at the moment. Check back later for updates.
        </p>
        <div className="mt-4 px-3 py-1.5 bg-slate-800/50 rounded-full border border-slate-700">
          <span className="text-xs text-gray-500">💡 Stay tuned for interview invites</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with Tabs */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar className="w-5 h-5 text-green-400" />
            Interviews
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {upcomingInterviews.length} upcoming • {completedInterviews.length} completed
          </p>
        </div>
        <div className="flex items-center gap-1 bg-slate-800/50 p-0.5 rounded-lg border border-slate-700/50">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "upcoming"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Upcoming
            {upcomingInterviews.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-green-500/30 text-green-400 rounded-full text-[10px]">
                {upcomingInterviews.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${
              activeTab === "past"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Past
            {completedInterviews.length > 0 && (
              <span className="ml-1.5 px-1.5 py-0.5 bg-blue-500/30 text-blue-400 rounded-full text-[10px]">
                {completedInterviews.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Current Date Display */}
      <div className="flex items-center gap-2 bg-slate-800/30 px-3 py-1.5 rounded-full border border-slate-700/50 self-start">
        <Bell className="w-3.5 h-3.5 text-yellow-400" />
        <span className="text-xs text-gray-300">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </span>
      </div>

      {/* Upcoming Interviews */}
      {activeTab === "upcoming" && (
        <div>
          {sortedUpcoming.length > 0 ? (
            <div className="space-y-3">
              {sortedUpcoming.map((interview) => (
                <InterviewCard
                  key={interview._id}
                  interview={interview}
                  userType={userType}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  getTimeRemaining={getTimeRemaining}
                  router={router}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 bg-slate-800/20 rounded-xl border border-slate-800">
              <CheckCircle2 className="w-8 h-8 text-green-400/50 mb-2" />
              <p className="text-sm text-gray-400">No upcoming interviews</p>
              <p className="text-xs text-gray-500 mt-1">All caught up! 🎉</p>
            </div>
          )}
        </div>
      )}

      {/* Past Interviews */}
      {activeTab === "past" && (
        <div>
          {sortedCompleted.length > 0 ? (
            <div className="space-y-3">
              {sortedCompleted.map((interview) => (
                <InterviewCard
                  key={interview._id}
                  interview={interview}
                  userType={userType}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  getTimeRemaining={getTimeRemaining}
                  router={router}
                  isPast={true}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 bg-slate-800/20 rounded-xl border border-slate-800">
              <CalendarDays className="w-8 h-8 text-gray-600 mb-2" />
              <p className="text-sm text-gray-400">No past interviews</p>
              <p className="text-xs text-gray-500 mt-1">Your interview history will appear here</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// Interview Card Component
const InterviewCard = ({
  interview,
  userType,
  formatDate,
  getStatusColor,
  getStatusIcon,
  getTimeRemaining,
  router,
  isPast = false,
}: {
  interview: Interview;
  userType: string;
  formatDate: (date: string) => string;
  getStatusColor: (status: string) => string;
  getStatusIcon: (status: string) => React.ReactNode;
  getTimeRemaining: (date: string, time: string) => string;
  router: any;
  isPast?: boolean;
}) => {
  const isUpcoming = interview.status === "Scheduled";
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group bg-slate-800/30 hover:bg-slate-800/50 rounded-xl border transition-all duration-300 cursor-pointer overflow-hidden ${
        isUpcoming
          ? "border-slate-700/50 hover:border-green-500/30 hover:shadow-lg hover:shadow-green-500/5"
          : "border-slate-700/30 hover:border-slate-600 opacity-80 hover:opacity-100"
      }`}
      onClick={() => router.push(`/${userType}/applications/${interview._id}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex items-start gap-4">
          {/* Left - Icon */}
          <div className="flex-shrink-0">
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
          </div>

          {/* Middle - Content */}
          <div className="flex-1 min-w-0">
            {/* Job Title & Company */}
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-white truncate group-hover:text-green-400 transition-colors">
                  {interview.jobId.jobTitle}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3 h-3 text-gray-400" />
                  <p className="text-xs text-gray-400 truncate">
                    {interview.companySnapshot.companyName}
                  </p>
                </div>
              </div>
              {isUpcoming && (
                <div className="flex-shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10 border border-green-500/20 text-[10px] text-green-400 font-medium">
                    <Sparkles className="w-2.5 h-2.5" />
                    Upcoming
                  </span>
                </div>
              )}
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-1.5 mt-2.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-300">
                  {formatDate(interview.date)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-300">{interview.time}</span>
              </div>
            </div>

            {/* Meeting Link & Message */}
            <div className="flex flex-wrap items-center gap-3 mt-2">
              {interview.meetLink && (
                <a
                  href={interview.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Video className="w-3 h-3" />
                  Join Meeting
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
              {interview.message && (
                <div className="flex items-start gap-1.5">
                  <MessageSquare className="w-3 h-3 text-gray-500 mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-gray-400 line-clamp-1">
                    {interview.message}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right - Status & Time */}
          <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium border ${getStatusColor(
                interview.status
              )}`}
            >
              {getStatusIcon(interview.status)}
              {interview.status}
            </span>
            {isUpcoming && !isPast && (
              <span className="text-[10px] text-yellow-400/70 bg-yellow-500/10 px-2 py-0.5 rounded-full border border-yellow-500/20">
                {getTimeRemaining(interview.date, interview.time)}
              </span>
            )}
            <ChevronRight
              className={`w-4 h-4 text-gray-500 transition-all duration-300 ${
                isHovered ? "translate-x-1 text-gray-300" : ""
              }`}
            />
          </div>
        </div>

        {/* Progress bar for upcoming interviews */}
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