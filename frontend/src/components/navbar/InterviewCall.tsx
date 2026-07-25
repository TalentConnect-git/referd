"use client";

import { useEffect, useState } from "react";
import { getInterviews, getUnreadInterviews } from "@/services/navbar.service";
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
  CheckCircle2,
  XCircle,
  ExternalLink,
  Bell,
  Eye,
} from "lucide-react";

interface InterviewCallProps {
  onClose?: () => void;
}

export default function InterviewCall({ onClose }: InterviewCallProps) {
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [unreadInterviews, setUnreadInterviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const router = useRouter();
  const { profile, user } = useAuth();
  const userType = profile?.profileType || user?.userType || "student";

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
        return <Circle className="h-2 w-2 fill-[var(--success)] text-[var(--success)]" />;
      case "Completed":
        return <CheckCircle2 className="h-3 w-3 text-[var(--info)]" />;
      case "Missed":
        return <XCircle className="h-3 w-3 text-[var(--danger)]" />;
      default:
        return <Circle className="h-2 w-2 fill-[var(--text-muted)] text-[var(--text-muted)]" />;
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
    if (onClose) onClose();
    router.push(`/${userType}/applications/interview/${interviewId}`);
  };

  const handleViewAll = () => {
    if (onClose) onClose();
    router.push(`/${userType}/applications/interview`);
  };

  if (loading) {
    return (
      <div className="flex min-h-52 w-full items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--background)] px-4 py-10">
        <div className="flex flex-col items-center gap-3">
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
      <div className="w-full overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl">
        <div className="flex min-h-56 flex-col items-center justify-center px-5 py-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-[var(--primary-border)] bg-[var(--primary-soft)]">
            <CalendarDays className="h-5 w-5 text-[var(--primary)]" />
          </div>

          <h3 className="text-sm font-semibold text-[var(--text-primary)]">
            No interviews yet
          </h3>

          <p className="mt-1 max-w-xs text-xs leading-5 text-[var(--text-muted)]">
            Your scheduled and completed interviews will appear here.
          </p>
        </div>

        <div className="border-t border-[var(--border)] bg-[var(--background-soft)] p-3">
          <button
            type="button"
            onClick={handleViewAll}
            className="btn-primary flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold"
          >
            View All Interviews
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--background)] shadow-2xl">
      {/* Header */}
      <div className="border-b border-[var(--border)] bg-[var(--background-soft)] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-[var(--primary-border)] bg-[var(--primary-soft)]">
              <Calendar className="h-4 w-4 text-[var(--primary)]" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-[var(--text-primary)]">
                Interviews
              </h2>
              <p className="truncate text-[11px] text-[var(--text-muted)]">
                {upcomingInterviews.length} upcoming · {completedInterviews.length} completed
              </p>
            </div>
          </div>

          <div className="flex flex-shrink-0 rounded-lg border border-[var(--border)] bg-[var(--background)] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold transition ${
                activeTab === "upcoming"
                  ? "bg-[var(--primary-soft)] text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Upcoming
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold transition ${
                activeTab === "past"
                  ? "bg-[var(--info-soft)] text-[var(--info)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              Past
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div 
        className="max-h-[min(62vh,520px)] overflow-y-auto"
        style={{
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
        }}
      >
        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>

        {activeTab === "upcoming" ? (
          sortedUpcoming.length > 0 ? (
            <div>
              {sortedUpcoming.map((interview, index) => (
                <div key={interview._id}>
                  <InterviewCard
                    interview={interview}
                    userType={userType}
                    formatDate={formatDate}
                    getStatusColor={getStatusColor}
                    getStatusIcon={getStatusIcon}
                    getTimeRemaining={getTimeRemaining}
                    onInterviewClick={handleInterviewClick}
                    isUnread={unreadInterviews.includes(interview._id)}
                  />
                  {index < sortedUpcoming.length - 1 && (
                    <div className="mx-4 h-px bg-[var(--border)]" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
              <CheckCircle2 className="mb-2 h-6 w-6 text-[var(--success)]/60" />
              <p className="text-xs font-medium text-[var(--text-primary)]">
                No upcoming interviews
              </p>
              <p className="mt-1 text-[11px] text-[var(--text-muted)]">
                You are all caught up.
              </p>
            </div>
          )
        ) : sortedCompleted.length > 0 ? (
          <div>
            {sortedCompleted.map((interview, index) => (
              <div key={interview._id}>
                <InterviewCard
                  interview={interview}
                  userType={userType}
                  formatDate={formatDate}
                  getStatusColor={getStatusColor}
                  getStatusIcon={getStatusIcon}
                  getTimeRemaining={getTimeRemaining}
                  onInterviewClick={handleInterviewClick}
                  isPast
                />
                {index < sortedCompleted.length - 1 && (
                  <div className="mx-4 h-px bg-[var(--border)]" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
            <CalendarDays className="mb-2 h-6 w-6 text-[var(--text-muted)]" />
            <p className="text-xs font-medium text-[var(--text-primary)]">
              No past interviews
            </p>
            <p className="mt-1 text-[11px] text-[var(--text-muted)]">
              Interview history will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--border)] bg-[var(--background-soft)] p-3">
        <button
          type="button"
          onClick={handleViewAll}
          className="btn-primary flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold active:scale-[0.99]"
        >
          View All Interviews
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
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
      className={`group cursor-pointer transition-all duration-200 hover:bg-[var(--card-hover)] ${
        isUpcoming && isUnread ? "border-l-4 border-l-[var(--warning)]" : ""
      }`}
      onClick={() => onInterviewClick(interview._id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="px-4 py-3">
        <div className="flex min-w-0 items-start gap-3">
          {/* Left - Icon */}
          <div className="relative flex-shrink-0 self-start sm:self-auto">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
                isUpcoming
                  ? "border border-[var(--primary-border)] bg-[var(--primary-soft)] group-hover:scale-105"
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
              <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 animate-pulse rounded-full bg-[var(--warning)]" />
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="truncate text-xs font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
                  {interview.jobId?.jobTitle || "Interview"}
                </h4>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <Building2 className="h-3 w-3 flex-shrink-0 text-[var(--text-muted)]" />
                  <p className="truncate text-xs text-[var(--text-muted)]">
                    {interview.companySnapshot?.companyName || "Company"}
                  </p>
                </div>
              </div>
              {isUpcoming && (
                <div className="flex flex-shrink-0 items-center gap-2 self-start sm:self-auto">
                  {isUnread && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--warning-border)] bg-[var(--warning-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--warning)]">
                      <Eye className="h-2.5 w-2.5" />
                      New
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 flex-shrink-0 text-[var(--text-muted)]" />
                <span className="truncate text-xs text-[var(--text-secondary)]">
                  {formatDate(interview.date)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 flex-shrink-0 text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-secondary)]">{interview.time}</span>
              </div>
            </div>

            <div className="mt-2.5 flex flex-col gap-2 border-t border-[var(--border)] pt-2.5">
              {interview.message ? (
                <div className="flex min-w-0 items-start gap-1.5">
                  <MessageSquare className="mt-0.5 h-3 w-3 flex-shrink-0 text-[var(--text-muted)]" />
                  <p className="line-clamp-1 text-[11px] text-[var(--text-muted)]">
                    {interview.message}
                  </p>
                </div>
              ) : null}

              {interview.meetLink && isUpcoming && !isPast ? (
                <a
                  href={interview.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md text-[11px] font-semibold"
                  onClick={(event) => event.stopPropagation()}
                >
                  <Video className="h-3.5 w-3.5" />
                  Join Interview
                  <ExternalLink className="h-3 w-3" />
                </a>
              ) : null}
            </div>
          </div>

          {/* Right - Status & Time */}
          <div className="flex flex-shrink-0 flex-col items-end gap-1">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-[10px] font-medium ${getStatusColor(
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
              <span className="whitespace-nowrap rounded-full border border-[var(--warning-border)] bg-[var(--warning-soft)] px-2 py-0.5 text-[10px] text-[var(--warning)]/70">
                {getTimeRemaining(interview.date, interview.time)}
              </span>
            )}
            <ChevronRight
              className={`h-3.5 w-3.5 text-[var(--text-muted)] transition-all duration-200 ${
                isHovered ? "translate-x-1 text-[var(--text-secondary)]" : ""
              }`}
            />
          </div>
        </div>

        {/* Progress bar */}
        {isUpcoming && (
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
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