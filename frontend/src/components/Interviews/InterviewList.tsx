"use client";

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
  Eye,
} from "lucide-react";
import { useState } from "react";

interface InterviewListProps {
  interviews: Interview[];
  unreadInterviews: string[];
  loading: boolean;
  userType: string;
  onInterviewClick: (id: string) => void;
}

export default function InterviewList({
  interviews,
  unreadInterviews,
  loading,
  userType,
  onInterviewClick,
}: InterviewListProps) {
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");

  const upcomingInterviews = interviews.filter(
    (interview) => interview.status === "Scheduled"
  );
  const completedInterviews = interviews.filter(
    (interview) => interview.status === "Completed" || interview.status === "Missed"
  );

  const sortedUpcoming = [...upcomingInterviews].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const sortedCompleted = [...completedInterviews].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
        return <Circle className="w-1.5 h-1.5 fill-green-400 text-green-400" />;
      case "Completed":
        return <CheckCircle2 className="w-2.5 h-2.5 text-blue-400" />;
      case "Missed":
        return <XCircle className="w-2.5 h-2.5 text-red-400" />;
      default:
        return <Circle className="w-1.5 h-1.5 fill-gray-400 text-gray-400" />;
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
      return `${days}d ${hours % 24}h`;
    }
    if (hours > 0) return `${hours}h ${minutes}m`;
    if (minutes > 0) return `${minutes}m`;
    return "Starting soon!";
  };

  if (loading) {
    return (
      <div className="flex min-h-48 items-center justify-center rounded-xl border border-slate-800 bg-slate-900/30 px-4 py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <Loader2 className="w-6 h-6 animate-spin text-green-400" />
            <div className="absolute inset-0 w-6 h-6 rounded-full border-2 border-green-400/20 animate-ping" />
          </div>
          <p className="text-gray-400 text-xs">Loading interviews...</p>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-slate-800 bg-slate-900/40 px-5 py-12">
        <div className="w-14 h-14 rounded-full bg-slate-800/50 flex items-center justify-center mb-3">
          <CalendarDays className="w-6 h-6 text-gray-600" />
        </div>
        <h3 className="text-sm font-semibold text-white">No Interviews Scheduled</h3>
        <p className="text-gray-400 text-xs text-center max-w-xs mt-1">
          You don't have any upcoming interviews at the moment.
        </p>
        <div className="mt-3 px-3 py-1 bg-slate-800/50 rounded-full border border-slate-700">
          <span className="text-[10px] text-gray-500">💡 Stay tuned for invites</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 overflow-hidden">
      {/* Header with Tabs */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-700/40 bg-slate-900/40 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-green-400" />
          <div>
            <h2 className="text-sm font-semibold text-white">Interviews</h2>
            <p className="text-[10px] text-gray-400">
              {upcomingInterviews.length} upcoming • {completedInterviews.length} completed
            </p>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-1 rounded-lg border border-slate-700/50 bg-slate-800/60 p-1 sm:w-auto">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex min-h-9 items-center justify-center rounded-md px-3 py-2 text-[11px] font-medium transition-all sm:min-h-0 sm:py-1.5 ${
              activeTab === "upcoming"
                ? "bg-green-500/20 text-green-400 border border-green-500/30"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Upcoming
            {upcomingInterviews.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-green-500/30 text-green-400 rounded-full text-[9px]">
                {upcomingInterviews.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex min-h-9 items-center justify-center rounded-md px-3 py-2 text-[11px] font-medium transition-all sm:min-h-0 sm:py-1.5 ${
              activeTab === "past"
                ? "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                : "text-gray-400 hover:text-gray-300"
            }`}
          >
            Past
            {completedInterviews.length > 0 && (
              <span className="ml-1 px-1.5 py-0.5 bg-blue-500/30 text-blue-400 rounded-full text-[9px]">
                {completedInterviews.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div>
        {activeTab === "upcoming" && (
          <div>
            {sortedUpcoming.length > 0 ? (
              <div className="space-y-2">
                {sortedUpcoming.map((interview) => (
                  <InterviewCard
                    key={interview._id}
                    interview={interview}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getTimeRemaining={getTimeRemaining}
                    onInterviewClick={onInterviewClick}
                    isUnread={unreadInterviews.includes(interview._id)}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 bg-slate-800/20 rounded-xl border border-slate-800">
                <CheckCircle2 className="w-6 h-6 text-green-400/50 mb-1.5" />
                <p className="text-xs text-gray-400">No upcoming interviews</p>
                <p className="text-[10px] text-gray-500 mt-0.5">All caught up! 🎉</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "past" && (
          <div>
            {sortedCompleted.length > 0 ? (
              <div className="space-y-2">
                {sortedCompleted.map((interview) => (
                  <InterviewCard
                    key={interview._id}
                    interview={interview}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getTimeRemaining={getTimeRemaining}
                    onInterviewClick={onInterviewClick}
                    isPast={true}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 bg-slate-800/20 rounded-xl border border-slate-800">
                <CalendarDays className="w-6 h-6 text-gray-600 mb-1.5" />
                <p className="text-xs text-gray-400">No past interviews</p>
                <p className="text-[10px] text-gray-500 mt-0.5">Your history will appear here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Interview Card Component
const InterviewCard = ({
  interview,
  formatDate,
  getStatusColor,
  getStatusIcon,
  getTimeRemaining,
  onInterviewClick,
  isPast = false,
  isUnread = false,
}: {
  interview: Interview;
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
      className={`group w-full cursor-pointer overflow-hidden rounded-xl border bg-slate-900/55 transition-all duration-200 hover:bg-slate-800/70 ${
        isUpcoming
          ? `border-slate-700/50 hover:border-green-500/30 hover:shadow-md hover:shadow-green-500/5 ${
              isUnread ? "border-l-3 border-l-yellow-400" : ""
            }`
          : "border-slate-700/30 hover:border-slate-600 opacity-75 hover:opacity-100"
      }`}
      onClick={() => onInterviewClick(interview._id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-2.5 sm:p-3">
        <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
          {/* Icon */}
          <div className="flex-shrink-0 relative">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 sm:h-10 sm:w-10 ${
                isUpcoming
                  ? "bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20"
                  : "bg-slate-700/30 border border-slate-600/20"
              }`}
            >
              {isUpcoming ? (
                <Briefcase className="h-4 w-4 text-green-400" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-gray-500" />
              )}
            </div>
            {isUnread && isUpcoming && (
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-400 rounded-full animate-pulse" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h4 className="break-words text-sm font-semibold leading-5 text-white sm:text-base group-hover:text-green-400 transition-colors">
                  {interview.jobId?.jobTitle || "Interview"}
                </h4>
                <div className="mt-1 flex min-w-0 items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                  <p className="truncate text-xs text-gray-400">
                    {interview.companySnapshot?.companyName || "Company"}
                  </p>
                </div>
              </div>
              {isUpcoming && (
                <div className="flex flex-wrap items-center gap-1.5 sm:flex-shrink-0 sm:justify-end">
                  {isUnread && (
                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[9px] text-yellow-400 font-medium">
                      <Eye className="w-2 h-2" />
                      New
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-300">{formatDate(interview.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-gray-400" />
                <span className="text-xs text-gray-300">{interview.time}</span>
              </div>
            </div>

            {/* Interview Message */}
            {interview.message ? (
              <div className="mt-2.5 flex min-w-0 items-start gap-2 rounded-lg border-t border-slate-700/40 bg-slate-800/30 px-2.5 py-2">
                <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-500" />
                <p className="line-clamp-2 break-words text-[11px] leading-4 text-gray-400 sm:text-xs">
                  {interview.message}
                </p>
              </div>
            ) : null}
          </div>

          {/* Primary action / status */}
          <div className="flex flex-shrink-0 flex-col items-end gap-1.5">
            {isUpcoming && !isPast && interview.meetLink ? (
              <a
                href={interview.meetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-md border border-green-400/30 bg-green-500 px-2.5 text-[11px] font-semibold text-black shadow-sm shadow-green-500/10 transition hover:bg-green-400 focus:outline-none focus:ring-2 focus:ring-green-400/30 active:scale-[0.98] sm:px-3"
                onClick={(event) => event.stopPropagation()}
              >
                <Video className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Join Interview</span>
                <span className="sm:hidden">Join</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            ) : (
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium ${getStatusColor(
                  interview.status,
                )}`}
              >
                {getStatusIcon(interview.status)}
                {interview.status}
              </span>
            )}

            {isUpcoming && !isPast ? (
              <span className="whitespace-nowrap rounded-full border border-yellow-500/20 bg-yellow-500/10 px-1.5 py-0.5 text-[9px] text-yellow-400/70">
                {getTimeRemaining(interview.date, interview.time)}
              </span>
            ) : null}

            <ChevronRight
              className={`h-3 w-3 text-gray-500 transition-all duration-200 ${
                isHovered ? "translate-x-0.5 text-gray-300" : ""
              }`}
            />
          </div>
        </div>

        {/* Progress bar */}
        {isUpcoming && (
          <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-slate-700/30">
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