"use client";

import { Notification } from "@/types/notification";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import axiosInstance from "@/lib/axiosInstance";
import {
  Bell,
  Clock,
  ChevronRight,
  Briefcase,
  Users,
  MessageCircle,
  Calendar,
  UserPlus,
  FileText,
  Inbox,
  Loader2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface NotificationsDropdownProps {
  onClick?: () => void;
}

export default function NotificationsDropdown({
  onClick,
}: NotificationsDropdownProps) {
  const { notifications, markAsRead, markAllAsRead} = useNotification();
  const router = useRouter();
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState<"all" | "unread">("unread");
  const [unreadNotifications, setUnreadNotifications] = useState<Notification[]>([]);
  const [loadingUnread, setLoadingUnread] = useState(false);

  const userType = profile?.profileType || user?.userType || "student";

  // Fetch unread notifications when tab is unread
  useEffect(() => {
    if (activeTab === "unread") {
      fetchUnreadNotifications();
    }
  }, [activeTab, notifications]);

  const fetchUnreadNotifications = async () => {
    try {
      setLoadingUnread(true);
      const response = await axiosInstance.get("/api/notifications/unread");
      
      if (response.data?.success) {
        setUnreadNotifications(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching unread notifications:", error);
      // Fallback: filter from existing notifications
      const unread = notifications.filter((n) => !n.read);
      setUnreadNotifications(unread);
    } finally {
      setLoadingUnread(false);
    }
  };

  const getNotificationIcon = (topic?: string) => {
    switch (topic) {
      case "Jobs":
      case "Job Detail":
        return <Briefcase className="h-4 w-4 text-[var(--info)]" />;
      case "Referrals":
      case "Referrer":
        return <Users className="h-4 w-4 text-[var(--success)]" />;
      case "Scheduled Interviews":
        return <Calendar className="h-4 w-4 text-[var(--primary)]" />;
      case "Alumni Network":
        return <UserPlus className="h-4 w-4 text-[var(--warning)]" />;
      case "Chat":
        return <MessageCircle className="h-4 w-4 text-[var(--info)]" />;
      default:
        return <Bell className="h-4 w-4 text-[var(--text-muted)]" />;
    }
  };

  const getNotificationColor = (topic?: string) => {
    switch (topic) {
      case "Jobs":
      case "Job Detail":
        return "border-[var(--info-border)] bg-[var(--info-soft)]";
      case "Referrals":
      case "Referrer":
        return "border-[var(--success-border)] bg-[var(--success-soft)]";
      case "Scheduled Interviews":
        return "border-[var(--primary-border)] bg-[var(--primary-soft)]";
      case "Alumni Network":
        return "border-[var(--warning-border)] bg-[var(--warning-soft)]";
      case "Chat":
        return "border-[var(--info-border)] bg-[var(--info-soft)]";
      default:
        return "border-[var(--border)] bg-[var(--background-soft)]";
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    // Close dropdown when notification is clicked
    if (onClick) onClick();

    // Mark as read
    await markAsRead(notification._id);

    // Refresh unread list
    if (activeTab === "unread") {
      fetchUnreadNotifications();
    }

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

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    // Refresh unread list
    if (activeTab === "unread") {
      fetchUnreadNotifications();
    }
    if (onClick) onClick();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Get the notifications to display based on active tab
  const displayNotifications = activeTab === "unread" 
    ? unreadNotifications 
    : notifications;

  // Show loading state
  const isLoading = activeTab === "unread" && loadingUnread;

  return (
    <div className="w-full">
      {/* Header with count and tabs */}
      <div className="border-b border-[var(--border)]">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-[var(--text-secondary)]" />
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">
              Notifications
            </h3>
            {unreadCount > 0 && (
              <span className="rounded-full bg-[var(--danger)] px-2 py-0.5 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </div>
          <span className="text-[10px] text-[var(--text-muted)]">
            {notifications.length} total
          </span>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border)]">
          <button
            onClick={() => setActiveTab("unread")}
            className={`
              flex-1 px-4 py-2 text-xs font-medium transition-all duration-200
              ${
                activeTab === "unread"
                  ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }
            `}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Bell className="h-3.5 w-3.5" />
              Unread
              {unreadCount > 0 && (
                <span className="rounded-full bg-[var(--danger)] px-1.5 py-0.5 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </div>
          </button>

          <button
            onClick={() => setActiveTab("all")}
            className={`
              flex-1 px-4 py-2 text-xs font-medium transition-all duration-200
              ${
                activeTab === "all"
                  ? "border-b-2 border-[var(--primary)] text-[var(--primary)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
              }
            `}
          >
            <div className="flex items-center justify-center gap-1.5">
              <Inbox className="h-3.5 w-3.5" />
              All
              <span className="rounded-full bg-[var(--background-soft)] px-1.5 py-0.5 text-[9px] font-medium text-[var(--text-muted)]">
                {notifications.length}
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* Notification List */}
      <div
        className="notifications-scroll max-h-[380px]"
        onWheel={(e) => e.stopPropagation()}
      >
        {/* Loading State */}
        {isLoading ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--primary)]" />
            <p className="mt-3 text-sm text-[var(--text-muted)]">Loading notifications...</p>
          </div>
        ) : displayNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
            <div className="mb-3 rounded-full bg-[var(--card-hover)] p-4">
              {activeTab === "unread" ? (
                <Bell className="h-8 w-8 text-[var(--text-muted)]" />
              ) : (
                <Inbox className="h-8 w-8 text-[var(--text-muted)]" />
              )}
            </div>
            <p className="text-sm font-medium text-[var(--text-primary)]">
              {activeTab === "unread" ? "No unread notifications" : "No notifications"}
            </p>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {activeTab === "unread" 
                ? "You're all caught up!" 
                : "You don't have any notifications yet"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--border)]">
            {displayNotifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleNotificationClick(notification)}
                className={`
                  group relative cursor-pointer border-l-4 transition-all duration-200
                  hover:bg-[var(--card-hover)]
                  ${!notification.read ? "border-l-[var(--primary)] bg-[var(--primary-soft)]" : "border-l-transparent"}
                  ${getNotificationColor(notification.meta?.topic)}
                `}
              >
                <div className="flex items-start gap-3 px-4 py-3">
                  {/* Icon */}
                  <div className="mt-0.5 flex-shrink-0">
                    <div
                      className={`
                      flex h-8 w-8 items-center justify-center rounded-full
                      ${!notification.read ? "bg-[var(--primary)]/10" : "bg-[var(--card-hover)]"}
                    `}
                    >
                      {getNotificationIcon(notification.meta?.topic)}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`
                      text-sm leading-relaxed
                      ${!notification.read ? "font-semibold text-[var(--text-primary)]" : "text-[var(--text-secondary)]"}
                    `}
                    >
                      {notification.message}
                    </p>

                    <div className="mt-1.5 flex items-center gap-3">
                      <span className="flex items-center gap-1 text-xs text-[var(--text-muted)]">
                        <Clock className="h-3 w-3" />
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
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
                  <ChevronRight
                    className={`
                      h-4 w-4 flex-shrink-0 text-[var(--text-muted)] 
                      opacity-0 transition-opacity duration-200
                      group-hover:opacity-100
                    `}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {displayNotifications.length > 0 && unreadCount > 0 && activeTab === "unread" && (
        <div className="border-t border-[var(--border)] px-4 py-2 text-center">
          <button
            onClick={handleMarkAllAsRead}
            className="text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
          >
            Mark all as read
          </button>
        </div>
      )}

      {notifications.length > 0 && activeTab === "all" && unreadCount > 0 && (
        <div className="border-t border-[var(--border)] px-4 py-2 text-center">
          <button
            onClick={() => setActiveTab("unread")}
            className="text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
          >
            {unreadCount} unread {unreadCount === 1 ? "notification" : "notifications"}
          </button>
        </div>
      )}
    </div>
  );
}