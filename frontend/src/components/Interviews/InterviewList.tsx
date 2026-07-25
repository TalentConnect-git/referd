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
        return "text-[var(--success)] bg-[var(--success-soft)] border-[var(--success-border)]";
      case "Completed":
        return "text-[var(--info)] bg-[var(--info-soft)] border-[var(--info-border)]";
      case "Missed":
        return "text-[var(--danger)] bg-[var(--danger-soft)] border-[var(--danger-border)]";
      default:
        return "text-[var(--text-muted)] bg-[var(--background-soft)] border-[var(--border)]";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Scheduled":
        return <Circle className="h-1.5 w-1.5 fill-[var(--success)] text-[var(--success)]" />;
      case "Completed":
        return <CheckCircle2 className="h-2.5 w-2.5 text-[var(--info)]" />;
      case "Missed":
        return <XCircle className="h-2.5 w-2.5 text-[var(--danger)]" />;
      default:
        return <Circle className="h-1.5 w-1.5 fill-[var(--text-muted)] text-[var(--text-muted)]" />;
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
      <div className="flex min-h-48 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-soft)] px-4 py-12">
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <Loader2 className="h-6 w-6 animate-spin text-[var(--primary)]" />
            <div className="absolute inset-0 h-6 w-6 animate-ping rounded-full border-2 border-[var(--primary)]/20" />
          </div>
          <p className="text-xs text-[var(--text-muted)]">Loading interviews...</p>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="flex min-h-56 flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-soft)] px-5 py-12">
        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--background-soft)]">
          <CalendarDays className="h-6 w-6 text-[var(--text-muted)]" />
        </div>
        <h3 className="text-sm font-semibold text-[var(--text-primary)]">No Interviews Scheduled</h3>
        <p className="mt-1 max-w-xs text-center text-xs text-[var(--text-muted)]">
          You don't have any upcoming interviews at the moment.
        </p>
        <div className="mt-3 rounded-full border border-[var(--border)] bg-[var(--background-soft)] px-3 py-1">
          <span className="text-[10px] text-[var(--text-muted)]">💡 Stay tuned for invites</span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4 overflow-hidden">
      {/* Header with Tabs */}
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--border)] bg-[var(--background-soft)] p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-[var(--primary)]" />
          <div>
            <h2 className="text-sm font-semibold text-[var(--text-primary)]">Interviews</h2>
            <p className="text-[10px] text-[var(--text-muted)]">
              {upcomingInterviews.length} upcoming • {completedInterviews.length} completed
            </p>
          </div>
        </div>
        <div className="grid w-full grid-cols-2 gap-1 rounded-lg border border-[var(--border)] bg-[var(--background)] p-1 sm:w-auto">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex min-h-9 items-center justify-center rounded-md px-3 py-2 text-[11px] font-medium transition-all sm:min-h-0 sm:py-1.5 ${
              activeTab === "upcoming"
                ? "bg-[var(--primary-soft)] text-[var(--primary)] border border-[var(--primary-border)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Upcoming
            {upcomingInterviews.length > 0 && (
              <span className="ml-1 rounded-full bg-[var(--primary-soft)] px-1.5 py-0.5 text-[9px] text-[var(--primary)]">
                {upcomingInterviews.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("past")}
            className={`flex min-h-9 items-center justify-center rounded-md px-3 py-2 text-[11px] font-medium transition-all sm:min-h-0 sm:py-1.5 ${
              activeTab === "past"
                ? "bg-[var(--info-soft)] text-[var(--info)] border border-[var(--info-border)]"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
            }`}
          >
            Past
            {completedInterviews.length > 0 && (
              <span className="ml-1 rounded-full bg-[var(--info-soft)] px-1.5 py-0.5 text-[9px] text-[var(--info)]">
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
              <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-soft)] py-8">
                <CheckCircle2 className="mb-1.5 h-6 w-6 text-[var(--success)]/50" />
                <p className="text-xs text-[var(--text-muted)]">No upcoming interviews</p>
                <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">All caught up! 🎉</p>
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
              <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-soft)] py-8">
                <CalendarDays className="mb-1.5 h-6 w-6 text-[var(--text-muted)]" />
                <p className="text-xs text-[var(--text-muted)]">No past interviews</p>
                <p className="mt-0.5 text-[10px] text-[var(--text-muted)]">Your history will appear here</p>
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
      className={`group w-full cursor-pointer overflow-hidden rounded-xl border bg-[var(--background)] transition-all duration-200 hover:bg-[var(--card-hover)] ${
        isUpcoming
          ? `border-[var(--border)] hover:border-[var(--primary-border)] hover:shadow-md hover:shadow-[var(--primary)]/5 ${
              isUnread ? "border-l-3 border-l-[var(--warning)]" : ""
            }`
          : "border-[var(--border)] opacity-75 hover:opacity-100 hover:border-[var(--border-strong)]"
      }`}
      onClick={() => onInterviewClick(interview._id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-2.5 sm:p-3">
        <div className="flex min-w-0 items-start gap-2.5 sm:gap-3">
          {/* Icon */}
          <div className="relative flex-shrink-0">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 sm:h-10 sm:w-10 ${
                isUpcoming
                  ? "border border-[var(--primary-border)] bg-[var(--primary-soft)]"
                  : "border border-[var(--border)] bg-[var(--background-soft)]"
              }`}
            >
              {isUpcoming ? (
                <Briefcase className="h-4 w-4 text-[var(--primary)]" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-[var(--text-muted)]" />
              )}
            </div>
            {isUnread && isUpcoming && (
              <div className="absolute -right-0.5 -top-0.5 h-2 w-2 animate-pulse rounded-full bg-[var(--warning)]" />
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <h4 className="break-words text-sm font-semibold leading-5 text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)] sm:text-base">
                  {interview.jobId?.jobTitle || "Interview"}
                </h4>
                <div className="mt-1 flex min-w-0 items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 flex-shrink-0 text-[var(--text-muted)]" />
                  <p className="truncate text-xs text-[var(--text-muted)]">
                    {interview.companySnapshot?.companyName || "Company"}
                  </p>
                </div>
              </div>
              {isUpcoming && (
                <div className="flex flex-wrap items-center gap-1.5 sm:flex-shrink-0 sm:justify-end">
                  {isUnread && (
                    <span className="inline-flex items-center gap-0.5 rounded-full border border-[var(--warning-border)] bg-[var(--warning-soft)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--warning)]">
                      <Eye className="h-2 w-2" />
                      New
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-secondary)]">{formatDate(interview.date)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-secondary)]">{interview.time}</span>
              </div>
            </div>

            {/* Interview Message */}
            {interview.message ? (
              <div className="mt-2.5 flex min-w-0 items-start gap-2 rounded-lg border-t border-[var(--border)] bg-[var(--background-soft)] px-2.5 py-2">
                <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-[var(--text-muted)]" />
                <p className="line-clamp-2 break-words text-[11px] leading-4 text-[var(--text-muted)] sm:text-xs">
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
                className="btn-primary inline-flex h-8 items-center justify-center gap-1.5 rounded-md px-2.5 text-[11px] font-semibold shadow-sm shadow-[var(--primary)]/10 transition active:scale-[0.98] sm:px-3"
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
              <span className="whitespace-nowrap rounded-full border border-[var(--warning-border)] bg-[var(--warning-soft)] px-1.5 py-0.5 text-[9px] text-[var(--warning)]/70">
                {getTimeRemaining(interview.date, interview.time)}
              </span>
            ) : null}

            <ChevronRight
              className={`h-3 w-3 text-[var(--text-muted)] transition-all duration-200 ${
                isHovered ? "translate-x-0.5 text-[var(--text-secondary)]" : ""
              }`}
            />
          </div>
        </div>

        {/* Progress bar */}
        {isUpcoming && (
          <div className="mt-1.5 h-0.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] transition-all duration-1000"
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