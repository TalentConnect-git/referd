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
        return "text-[var(--success)] border-[var(--success-border)] bg-[var(--success-soft)]";
      case "Completed":
        return "text-[var(--info)] border-[var(--info-border)] bg-[var(--info-soft)]";
      case "Missed":
        return "text-[var(--danger)] border-[var(--danger-border)] bg-[var(--danger-soft)]";
      default:
        return "text-[var(--text-muted)] border-[var(--border)] bg-[var(--background-soft)]";
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
      <div className="flex h-96 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--primary)]" />
            <div className="absolute inset-0 h-10 w-10 animate-ping rounded-full border-2 border-[var(--primary)]/20" />
          </div>
          <p className="text-sm text-[var(--text-muted)]">Loading your interviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="rounded-lg border border-[var(--border)] bg-[var(--background-soft)] p-2 transition-colors hover:bg-[var(--card-hover)]"
          >
            <ArrowLeft className="h-5 w-5 text-[var(--text-muted)]" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">All Interviews</h1>
            <p className="mt-0.5 text-sm text-[var(--text-muted)]">
              {interviews.length} total • {interviews.filter(i => i.status === "Scheduled").length} upcoming
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6 flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter("all")}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === "all"
                ? "border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]"
                : "border border-[var(--border)] bg-[var(--background-soft)] text-[var(--text-muted)] hover:bg-[var(--card-hover)]"
            }`}
          >
            All ({interviews.length})
          </button>
          <button
            onClick={() => setFilter("upcoming")}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === "upcoming"
                ? "border border-[var(--primary-border)] bg-[var(--primary-soft)] text-[var(--primary)]"
                : "border border-[var(--border)] bg-[var(--background-soft)] text-[var(--text-muted)] hover:bg-[var(--card-hover)]"
            }`}
          >
            Upcoming ({interviews.filter(i => i.status === "Scheduled").length})
          </button>
          <button
            onClick={() => setFilter("completed")}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === "completed"
                ? "border border-[var(--info-border)] bg-[var(--info-soft)] text-[var(--info)]"
                : "border border-[var(--border)] bg-[var(--background-soft)] text-[var(--text-muted)] hover:bg-[var(--card-hover)]"
            }`}
          >
            Completed ({interviews.filter(i => i.status === "Completed").length})
          </button>
          <button
            onClick={() => setFilter("missed")}
            className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
              filter === "missed"
                ? "border border-[var(--danger-border)] bg-[var(--danger-soft)] text-[var(--danger)]"
                : "border border-[var(--border)] bg-[var(--background-soft)] text-[var(--text-muted)] hover:bg-[var(--card-hover)]"
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
          <div className="flex flex-col items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--background-soft)] py-16">
            <Filter className="mb-3 h-12 w-12 text-[var(--text-muted)]" />
            <p className="text-sm text-[var(--text-muted)]">No interviews match this filter</p>
            <button
              onClick={() => setFilter("all")}
              className="mt-3 text-xs text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
            >
              View all interviews
            </button>
          </div>
        )}
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
      className={`group cursor-pointer overflow-hidden rounded-xl border transition-all duration-300 ${
        isUpcoming
          ? `border-[var(--border)] bg-[var(--background-soft)] hover:border-[var(--primary-border)] hover:bg-[var(--card-hover)] hover:shadow-md hover:shadow-[var(--primary)]/5 ${
              isUnread ? "border-l-4 border-l-[var(--warning)]" : ""
            }`
          : "border-[var(--border)] bg-[var(--background-soft)] opacity-80 hover:opacity-100 hover:border-[var(--border-strong)]"
      }`}
      onClick={() => onInterviewClick(interview._id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
          {/* Left - Icon */}
          <div className="relative flex-shrink-0 self-start sm:self-auto">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 ${
                isUpcoming
                  ? "border border-[var(--primary-border)] bg-[var(--primary-soft)] group-hover:scale-105"
                  : "border border-[var(--border)] bg-[var(--background-soft)]"
              }`}
            >
              {isUpcoming ? (
                <Briefcase className="h-5 w-5 text-[var(--primary)]" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-[var(--text-muted)]" />
              )}
            </div>
            {isUnread && isUpcoming && (
              <div className="absolute -right-0.5 -top-0.5 h-3 w-3 animate-pulse rounded-full bg-[var(--warning)]" />
            )}
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
              <div>
                <h4 className="text-sm font-semibold text-[var(--text-primary)] transition-colors group-hover:text-[var(--primary)]">
                  {interview.jobId?.jobTitle || "Interview"}
                </h4>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <Building2 className="h-3 w-3 text-[var(--text-muted)]" />
                  <p className="text-xs text-[var(--text-muted)]">
                    {interview.companySnapshot?.companyName || "Company"}
                  </p>
                </div>
              </div>
              {isUpcoming && (
                <div className="flex flex-shrink-0 items-center gap-2">
                  {isUnread && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-[var(--warning-border)] bg-[var(--warning-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--warning)]">
                      <Eye className="h-2.5 w-2.5" />
                      New
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 rounded-full border border-[var(--success-border)] bg-[var(--success-soft)] px-2 py-0.5 text-[10px] font-medium text-[var(--success)]">
                    Upcoming
                  </span>
                </div>
              )}
            </div>

            <div className="mt-2.5 grid grid-cols-1 gap-1.5 xs:grid-cols-2">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3 w-3 text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-secondary)]">{formatDate(interview.date)}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-3 w-3 text-[var(--text-muted)]" />
                <span className="text-xs text-[var(--text-secondary)]">{interview.time}</span>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-2 sm:gap-3">
              {interview.meetLink && (
                <a
                  href={interview.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs text-[var(--info)] transition-colors hover:text-[var(--info)] hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Video className="h-3 w-3" />
                  <span className="hidden xs:inline">Join Meeting</span>
                  <span className="xs:hidden">Join</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              )}
              {interview.message && (
                <div className="flex min-w-0 flex-1 items-start gap-1.5">
                  <MessageSquare className="mt-0.5 h-3 w-3 text-[var(--text-muted)]" />
                  <p className="truncate text-xs text-[var(--text-muted)]">{interview.message}</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex w-full flex-row items-center justify-between gap-2 sm:w-auto sm:flex-col sm:items-end sm:justify-start">
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
              className={`hidden h-4 w-4 text-[var(--text-muted)] transition-all duration-300 sm:block ${
                isHovered ? "translate-x-1 text-[var(--text-secondary)]" : ""
              }`}
            />
          </div>
        </div>

        {isUpcoming && (
          <div className="mt-3 h-0.5 w-full overflow-hidden rounded-full bg-[var(--border)]">
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