"use client";

import { useState } from "react";
import { NotificationsCardProps } from "@/types/notification";
import { Notification } from "@/types/notification";
import { Bell, Clock, ChevronRight } from "lucide-react";

export default function NotificationsCard({
  notification,
}: NotificationsCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        surface-card group relative cursor-pointer
        rounded-2xl border p-4
        transition-all duration-300
        ${isHovered 
          ? 'border-[var(--primary-border)] shadow-md shadow-[var(--primary)]/10 scale-[1.02]' 
          : 'border-[var(--border)] hover:border-[var(--primary-border)]/50'
        }
        ${!notification.read ? 'bg-[var(--primary-soft)] border-l-4 border-l-[var(--primary)]' : ''}
      `}
    >
      {/* Animated gradient overlay on hover */}
      {isHovered && (
        <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-r from-[var(--primary)]/5 to-transparent" />
      )}

      <div className="relative flex items-start gap-4">
        {/* Unread Dot with animation */}
        {!notification.read && (
          <div className="mt-1.5 flex-shrink-0">
            <div className="h-3 w-3 animate-pulse-dot rounded-full bg-[var(--success)] shadow-lg shadow-[var(--success)]/30" />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <p className={`
              text-sm leading-relaxed
              ${!notification.read 
                ? 'font-semibold text-[var(--text-primary)]' 
                : 'text-[var(--text-secondary)]'
              }
            `}>
              {notification.message}
            </p>

            {/* New Badge with animation */}
            {!notification.read && (
              <span className="badge badge-success flex-shrink-0 inline-flex items-center gap-1.5 rounded-full border border-[var(--success-border)] bg-[var(--success-soft)] px-2.5 py-1 text-[10px] font-medium text-[var(--success)]">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[var(--success)]" />
                New
              </span>
            )}
          </div>

          {/* Time with icon */}
          <div className="mt-2.5 flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[var(--text-muted)]" />
            <p className="text-xs text-[var(--text-muted)]">
              {new Date(notification.createdAt).toLocaleString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>

          {/* Click hint - appears on hover */}
          {isHovered && (
            <div className="mt-2 flex animate-fade-in items-center gap-1 text-[10px] text-[var(--text-muted)]">
              <span>Click to view</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom progress bar for unread notifications */}
      {!notification.read && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 overflow-hidden rounded-b-2xl bg-[var(--card-hover)]">
          <div className="h-full animate-progress bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)]" />
        </div>
      )}
    </div>
  );
}