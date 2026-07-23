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
    if (onClose) onClose();
    router.push(`/${userType}/applications/interview/${interviewId}`);
  };

  const handleViewAll = () => {
    if (onClose) onClose();
    router.push(`/${userType}/applications/interview`);
  };

  if (loading) {
    return (
      <div className="flex min-h-52 w-full items-center justify-center rounded-2xl border border-slate-800 bg-[#071018] px-4 py-10">
        <div className="flex flex-col items-center gap-3">
          <div className="relative">
            <Loader2 className="h-6 w-6 animate-spin text-green-400" />
            <div className="absolute inset-0 h-6 w-6 rounded-full border-2 border-green-400/20 animate-ping" />
          </div>
          <p className="text-xs text-gray-400">Loading interviews...</p>
        </div>
      </div>
    );
  }

  if (interviews.length === 0) {
    return (
      <div className="w-full overflow-hidden rounded-2xl border border-slate-800 bg-[#071018] shadow-2xl">
        <div className="flex min-h-56 flex-col items-center justify-center px-5 py-8 text-center">
          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl border border-green-500/20 bg-[#12381f]">
            <CalendarDays className="h-5 w-5 text-green-400" />
          </div>

          <h3 className="text-sm font-semibold text-white">
            No interviews yet
          </h3>

          <p className="mt-1 max-w-xs text-xs leading-5 text-[#94a3b8]">
            Your scheduled and completed interviews will appear here.
          </p>
        </div>

        <div className="border-t border-slate-800 bg-[#0b1621] p-3">
          <button
            type="button"
            onClick={handleViewAll}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 text-sm font-semibold text-green-400 transition hover:bg-green-500/20"
          >
            View All Interviews
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-[420px] flex-col overflow-hidden rounded-2xl border border-slate-800 bg-[#071018] shadow-2xl">
      {/* Header */}
      <div className="border-b border-slate-800 bg-[#0b1621] px-4 py-3">
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg border border-green-500/20 bg-[#12381f]">
              <Calendar className="h-4 w-4 text-green-400" />
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-sm font-semibold text-white">
                Interviews
              </h2>
              <p className="truncate text-[11px] text-[#94a3b8]">
                {upcomingInterviews.length} upcoming · {completedInterviews.length} completed
              </p>
            </div>
          </div>

          <div className="flex flex-shrink-0 rounded-lg border border-slate-700/60 bg-[#071018] p-1">
            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold transition ${
                activeTab === "upcoming"
                  ? "bg-green-500/15 text-green-400"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              Upcoming
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("past")}
              className={`rounded-md px-2.5 py-1.5 text-[10px] font-semibold transition ${
                activeTab === "past"
                  ? "bg-blue-500/15 text-blue-400"
                  : "text-[#94a3b8] hover:text-white"
              }`}
            >
              Past
            </button>
          </div>
        </div>
      </div>

      {/* Content with dividers instead of borders */}
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
                  {/* Divider between interviews */}
                  {index < sortedUpcoming.length - 1 && (
                    <div className="mx-4 h-px bg-slate-800/60" />
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
              <CheckCircle2 className="mb-2 h-6 w-6 text-green-400/60" />
              <p className="text-xs font-medium text-white">
                No upcoming interviews
              </p>
              <p className="mt-1 text-[11px] text-[#94a3b8]">
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
                {/* Divider between interviews */}
                {index < sortedCompleted.length - 1 && (
                  <div className="mx-4 h-px bg-slate-800/60" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex min-h-40 flex-col items-center justify-center px-4 text-center">
            <CalendarDays className="mb-2 h-6 w-6 text-slate-500" />
            <p className="text-xs font-medium text-white">
              No past interviews
            </p>
            <p className="mt-1 text-[11px] text-[#94a3b8]">
              Interview history will appear here.
            </p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-800 bg-[#0b1621] p-3">
        <button
          type="button"
          onClick={handleViewAll}
          className="flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 text-sm font-semibold text-green-400 transition hover:bg-green-500/20 active:scale-[0.99]"
        >
          View All Interviews
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

// Interview Card Component - No border, just content
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
      className={`group cursor-pointer transition-all duration-200 hover:bg-slate-800/50 ${
        isUpcoming && isUnread ? "border-l-4 border-l-yellow-400" : ""
      }`}
      onClick={() => onInterviewClick(interview._id)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="px-4 py-3">
        <div className="flex min-w-0 items-start gap-3">
          {/* Left - Icon */}
          <div className="flex-shrink-0 self-start sm:self-auto relative">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all duration-200 ${
                isUpcoming
                  ? "bg-gradient-to-br from-green-500/20 to-emerald-500/10 border border-green-500/20 group-hover:scale-105"
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
              <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-yellow-400 rounded-full animate-pulse" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex min-w-0 items-start justify-between gap-2">
              <div className="min-w-0">
                <h4 className="truncate text-xs font-semibold text-white transition-colors group-hover:text-green-400">
                  {interview.jobId?.jobTitle || "Interview"}
                </h4>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Building2 className="w-3 h-3 text-gray-400 flex-shrink-0" />
                  <p className="text-xs text-gray-400 truncate">
                    {interview.companySnapshot?.companyName || "Company"}
                  </p>
                </div>
              </div>
              {isUpcoming && (
                <div className="flex-shrink-0 self-start sm:self-auto flex items-center gap-2">
                  {isUnread && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-yellow-500/10 border border-yellow-500/20 text-[10px] text-yellow-400 font-medium">
                      <Eye className="w-2.5 h-2.5" />
                      New
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Details */}
            <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-300 truncate">
                  {formatDate(interview.date)}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-gray-400 flex-shrink-0" />
                <span className="text-xs text-gray-300">{interview.time}</span>
              </div>
            </div>

            <div className="mt-2.5 flex flex-col gap-2 border-t border-slate-700/40 pt-2.5">
              {interview.message ? (
                <div className="flex min-w-0 items-start gap-1.5">
                  <MessageSquare className="mt-0.5 h-3 w-3 flex-shrink-0 text-slate-500" />
                  <p className="line-clamp-1 text-[11px] text-[#94a3b8]">
                    {interview.message}
                  </p>
                </div>
              ) : null}

              {interview.meetLink && isUpcoming && !isPast ? (
                <a
                  href={interview.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-8 w-full items-center justify-center gap-1.5 rounded-md border border-green-500/30 bg-green-500 text-[11px] font-semibold text-black transition hover:bg-green-400"
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
              className={`h-3.5 w-3.5 text-gray-500 transition-all duration-200 ${
                isHovered ? "translate-x-1 text-gray-300" : ""
              }`}
            />
          </div>
        </div>

        {/* Progress bar */}
        {isUpcoming && (
          <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-slate-700/30">
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