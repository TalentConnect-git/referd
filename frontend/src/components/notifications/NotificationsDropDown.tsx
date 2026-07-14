"use client";

import { Notification } from "@/types/notification";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Bell, Clock, ChevronRight, Briefcase, Users, MessageCircle, Calendar, UserPlus, FileText } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function NotificationsDropdown() {
  const { notifications, markAsRead } = useNotification();
  const router = useRouter();
  const { profile, user } = useAuth();

  const userType = profile?.profileType || user?.userType || "student";

  const getNotificationIcon = (topic?: string) => {
    switch (topic) {
      case "Jobs":
      case "Job Detail":
        return <Briefcase className="h-4 w-4 text-blue-400" />;
      case "Referrals":
      case "Referrer":
        return <Users className="h-4 w-4 text-green-400" />;
      case "Scheduled Interviews":
        return <Calendar className="h-4 w-4 text-purple-400" />;
      case "Alumni Network":
        return <UserPlus className="h-4 w-4 text-orange-400" />;
      case "Chat":
        return <MessageCircle className="h-4 w-4 text-pink-400" />;
      default:
        return <Bell className="h-4 w-4 text-gray-400" />;
    }
  };

  const getNotificationColor = (topic?: string) => {
    switch (topic) {
      case "Jobs":
      case "Job Detail":
        return "border-blue-500/20 bg-blue-500/5";
      case "Referrals":
      case "Referrer":
        return "border-green-500/20 bg-green-500/5";
      case "Scheduled Interviews":
        return "border-purple-500/20 bg-purple-500/5";
      case "Alumni Network":
        return "border-orange-500/20 bg-orange-500/5";
      case "Chat":
        return "border-pink-500/20 bg-pink-500/5";
      default:
        return "border-gray-500/20 bg-gray-500/5";
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Mark as read
    await markAsRead(notification._id);

    const topic = notification.meta?.topic;
    const subtopic = notification.meta?.subtopic;
    const body = notification.meta?.body;

    switch (topic) {
      case "Jobs": {
        const jobId = body?.jobId;
        if (!jobId) {
          router.push(`/${userType}/jobs`);
          return;
        }
        if (subtopic === "My Posted") {
          router.push(`/${userType}/applications`);
          return;
        }
        if (subtopic === "JobDetail") {
          const jobType = notification.jobType?.toLowerCase();
          if (jobType === "referral") {
            router.push(`/${userType}/jobs/referral-jobs/${jobId}`);
            return;
          }
          router.push(`/${userType}/jobs/offcampus/${jobId}`);
          return;
        }
        router.push(`/${userType}/jobs`);
        return;
      }

      case "Job Detail": {
        const applicationId = body?.applicationId;
        if (!applicationId) {
          router.push(`/${userType}/applications`);
          return;
        }
        router.push(`/${userType}/applications/to-me/${applicationId}`);
        return;
      }

      case "Referrals": {
        const applicationId = body?.applicationId;
        if (!applicationId) {
          router.push(`/${userType}/applications`);
          return;
        }
        router.push(`/${userType}/applications/to-me/${applicationId}`);
        return;
      }

      case "Referrer":
        router.push(`/${userType}/applications`);
        return;

      case "Scheduled Interviews":
        router.push(`/${userType}/applications`);
        return;

      case "Alumni Network": {
        const userId = body?.userId;
        if (!userId) {
          router.push(`/${userType}/alumani-network`);
          return;
        }
        router.push(`/${userType}/alumani-network/${userId}`);
        return;
      }

      case "Chat":
        return;

      default:
        router.push(`/${userType}/dashboard`);
    }
  };

  return (
    <div className="w-full">
      {/* Header with count */}
      <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
        <div className="flex items-center gap-2">
          <Bell className="h-4 w-4 text-[var(--text-secondary)]" />
          <h3 className="text-sm font-semibold text-white">Notifications</h3>
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white">
              {notifications.filter(n => !n.read).length}
            </span>
          )}
        </div>
        <span className="text-[10px] text-[var(--text-muted)]">
          {notifications.length} total
        </span>
      </div>

      {/* Notification List */}
      <div className="max-h-[400px] overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="mb-3 rounded-full bg-[var(--card-hover)] p-4">
              <Bell className="h-8 w-8 text-[var(--text-muted)]" />
            </div>
            <p className="text-sm font-medium text-white">No notifications</p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              You're all caught up!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`
                  group relative cursor-pointer transition-all duration-200
                  hover:bg-[var(--card-hover)]
                  ${!notification.read ? 'bg-[var(--primary-soft)]' : ''}
                  ${getNotificationColor(notification.meta?.topic)}
                  border-l-4 
                  ${!notification.read ? 'border-l-[var(--primary)]' : 'border-l-transparent'}
                `}
              >
                <div className="flex items-start gap-3 px-4 py-3">
                  {/* Icon */}
                  <div className="mt-0.5 flex-shrink-0">
                    <div className={`
                      flex h-8 w-8 items-center justify-center rounded-full
                      ${!notification.read ? 'bg-[var(--primary)]/10' : 'bg-[var(--card-hover)]'}
                    `}>
                      {getNotificationIcon(notification.meta?.topic)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className={`
                      text-sm leading-relaxed
                      ${!notification.read ? 'font-semibold text-white' : 'text-[var(--text-secondary)]'}
                    `}>
                      {notification.message}
                    </p>
                    
                    <div className="mt-1.5 flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                      </span>
                      
                      {notification.meta?.topic && (
                        <span className="rounded-full bg-[var(--card-hover)] px-2 py-0.5 text-[10px] text-[var(--text-muted)]">
                          {notification.meta.topic}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Unread indicator */}
                  {!notification.read && (
                    <div className="mt-1.5 flex-shrink-0">
                      <span className="inline-block h-2 w-2 rounded-full bg-[var(--primary)]" />
                    </div>
                  )}

                  {/* Chevron on hover */}
                  <ChevronRight className="
                    h-4 w-4 flex-shrink-0 text-[var(--text-muted)] 
                    opacity-0 transition-opacity duration-200
                    group-hover:opacity-100
                  " />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="border-t border-[var(--border)] px-4 py-2 text-center">
          <button
            onClick={() => {
              notifications.forEach(n => markAsRead(n._id));
            }}
            className="text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
          >
            Mark all as read
          </button>
        </div>
      )}
    </div>
  );
}