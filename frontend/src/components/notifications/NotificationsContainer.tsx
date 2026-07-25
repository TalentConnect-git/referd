"use client";

import { useNotification } from "@/context/NotificationContext";
import NotificationsCard from "./NotificationsCard";
import { Notification } from "@/types/notification";
import { useState, useEffect } from "react";
import { Bell, Filter, CheckCheck, Inbox, Sparkles } from "lucide-react";

export default function NotificationsContainer() {
  const { notifications, markAllAsRead, unreadCount } = useNotification();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
  };

  const filteredNotifications = notifications.filter((notification) => {
    if (filter === 'unread') return !notification.read;
    if (filter === 'read') return notification.read;
    return true;
  });

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <div className="mx-auto h-full max-w-4xl overflow-y-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-[var(--primary-border)] bg-[var(--primary-soft)] p-2">
                <Bell className="h-6 w-6 text-[var(--primary)]" />
              </div>
              <h1 className="text-3xl font-bold tracking-tight text-[var(--text-primary)]">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="inline-flex h-6 min-w-[24px] items-center justify-center rounded-full bg-[var(--danger)] px-2 text-xs font-bold text-white shadow-lg shadow-[var(--danger)]/30">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <p className="mt-2 ml-1 text-sm text-[var(--text-secondary)]">
              Stay updated with referral activity, applications, interviews, and messages.
            </p>
          </div>

          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-hover)] px-4 py-2 text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-[var(--primary-border)] hover:bg-[var(--primary-soft)] hover:text-[var(--primary)]"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--card)] p-1">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-[var(--primary)] text-black'
                : 'text-[var(--text-muted)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              filter === 'unread'
                ? 'bg-[var(--primary)] text-black'
                : 'text-[var(--text-muted)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[9px] ${
                filter === 'unread' ? 'bg-black/20 text-black' : 'bg-[var(--danger)] text-white'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
              filter === 'read'
                ? 'bg-[var(--primary)] text-black'
                : 'text-[var(--text-muted)] hover:bg-[var(--card-hover)] hover:text-[var(--text-primary)]'
            }`}
          >
            Read
          </button>
        </div>

        {/* Notification Count */}
        <span className="ml-auto text-xs text-[var(--text-muted)]">
          {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Notifications List */}
      <div>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="relative mb-6">
              <div className="flex h-24 w-24 items-center justify-center rounded-full bg-[var(--card-hover)]">
                <Bell className="h-12 w-12 text-[var(--text-muted)]" />
              </div>
              <div className="absolute -right-1 -top-1 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--primary-border)] bg-[var(--primary-soft)]">
                <Sparkles className="h-4 w-4 text-[var(--primary)]" />
              </div>
            </div>
            <h3 className="mb-2 text-xl font-semibold text-[var(--text-primary)]">
              No notifications yet
            </h3>
            <p className="max-w-sm text-sm text-[var(--text-secondary)]">
              You're all caught up! We'll notify you when there's new activity.
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-4 py-16 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--card-hover)]">
              <Inbox className="h-10 w-10 text-[var(--text-muted)]" />
            </div>
            <h3 className="mb-1 text-lg font-semibold text-[var(--text-primary)]">
              No {filter === 'unread' ? 'unread' : 'read'} notifications
            </h3>
            <p className="text-sm text-[var(--text-secondary)]">
              {filter === 'unread' 
                ? 'You have no unread notifications. Great job! 🎉' 
                : 'You have no read notifications yet.'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-sm text-[var(--primary)] transition-colors hover:text-[var(--primary-hover)]"
              >
                View all notifications →
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => (
              <NotificationsCard
                key={notification._id}
                notification={notification}
                onClick={() => handleNotificationClick(notification)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 0 && (
        <div className="mt-6 flex items-center justify-between border-t border-[var(--border)] pt-4">
          <span className="text-xs text-[var(--text-muted)]">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-[var(--text-muted)] transition-colors hover:text-[var(--primary)]"
            >
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
}