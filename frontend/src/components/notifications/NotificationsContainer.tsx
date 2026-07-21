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
    <div className="max-w-4xl mx-auto px-4 py-6 h-full overflow-y-auto">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 border border-green-500/20">
                <Bell className="h-6 w-6 text-green-400" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">
                Notifications
              </h1>
              {unreadCount > 0 && (
                <span className="inline-flex items-center justify-center min-w-[24px] h-6 rounded-full bg-red-500 px-2 text-xs font-bold text-white shadow-lg shadow-red-500/30">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            <p className="mt-2 ml-1 text-sm text-[var(--text-primary)]">
              Stay updated with referral activity, applications, interviews, and messages.
            </p>
          </div>

          {/* Mark All as Read Button */}
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--card-hover)] border border-[var(--border)] text-xs font-medium text-[var(--text-secondary)] transition-all hover:border-green-500/30 hover:text-green-400 hover:bg-green-500/5"
            >
              <CheckCheck className="h-4 w-4" />
              Mark all as read
            </button>
          )}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex items-center gap-1.5 p-1 rounded-xl bg-[var(--card)] border border-[var(--border)]">
          <button
            onClick={() => setFilter('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'all'
                ? 'bg-[var(--primary)] text-black'
                : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--card-hover)]'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'unread'
                ? 'bg-[var(--primary)] text-black'
                : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--card-hover)]'
            }`}
          >
            Unread
            {unreadCount > 0 && (
              <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-[9px] ${
                filter === 'unread' ? 'bg-black/20 text-black' : 'bg-red-500 text-white'
              }`}>
                {unreadCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setFilter('read')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
              filter === 'read'
                ? 'bg-[var(--primary)] text-black'
                : 'text-[var(--text-muted)] hover:text-white hover:bg-[var(--card-hover)]'
            }`}
          >
            Read
          </button>
        </div>

        {/* Notification Count */}
        <span className="text-xs text-[var(--text-muted)] ml-auto">
          {filteredNotifications.length} notification{filteredNotifications.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Notifications List - REMOVED duplicate margin/padding that could cause scroll issues */}
      <div>
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="relative mb-6">
              <div className="w-24 h-24 rounded-full bg-[var(--card-hover)] flex items-center justify-center">
                <Bell className="h-12 w-12 text-[var(--text-muted)]" />
              </div>
              <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Sparkles className="h-4 w-4 text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              No notifications yet
            </h3>
            <p className="text-sm text-[var(--text-primary)] max-w-sm">
              You're all caught up! We'll notify you when there's new activity.
            </p>
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-20 h-20 rounded-full bg-[var(--card-hover)] flex items-center justify-center mb-4">
              <Inbox className="h-10 w-10 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">
              No {filter === 'unread' ? 'unread' : 'read'} notifications
            </h3>
            <p className="text-sm text-[var(--text-primary)]">
              {filter === 'unread' 
                ? 'You have no unread notifications. Great job! 🎉' 
                : 'You have no read notifications yet.'}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                className="mt-4 text-sm text-green-400 hover:text-green-300 transition-colors"
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
        <div className="mt-6 pt-4 border-t border-[var(--border)] flex justify-between items-center">
          <span className="text-xs text-[var(--text-muted)]">
            Showing {filteredNotifications.length} of {notifications.length} notifications
          </span>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="text-xs text-[var(--text-muted)] hover:text-green-400 transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>
      )}
    </div>
  );
}