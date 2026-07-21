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
        relative
        rounded-2xl
        bg-[var(--card)]
        p-4
        transition-all
        duration-300
        cursor-pointer
        border
        ${isHovered 
          ? 'border-[#31aa40] shadow-lg shadow-green-500/10 scale-[1.02]' 
          : 'border-[var(--border)] hover:border-[#31aa40]/50'
        }
        ${!notification.read ? 'bg-[var(--primary-soft)] border-l-4 border-l-[#31aa40]' : ''}
      `}
    >
      {/* Animated gradient overlay on hover */}
      {isHovered && (
        <div className="absolute inset-0 bg-gradient-to-r from-[#31aa40]/5 to-transparent rounded-2xl pointer-events-none" />
      )}

      <div className="relative flex items-start gap-4">
        {/* Unread Dot with animation */}
        {!notification.read && (
          <div className="mt-1.5 flex-shrink-0">
            <div className="h-3 w-3 rounded-full bg-green-500 shadow-lg shadow-green-500/30 animate-pulse-dot" />
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-3">
            <p className={`
              text-sm leading-relaxed
              ${!notification.read 
                ? 'font-semibold text-white' 
                : 'text-[var(--text-secondary)]'
              }
            `}>
              {notification.message}
            </p>

            {/* New Badge with animation */}
            {!notification.read && (
              <span className="flex-shrink-0 inline-flex items-center gap-1.5 rounded-full bg-green-500/15 px-2.5 py-1 text-[10px] font-medium text-green-400 border border-green-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
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
            <div className="mt-2 text-[10px] text-[var(--text-muted)] flex items-center gap-1 animate-fade-in">
              <span>Click to view</span>
              <ChevronRight className="h-3 w-3" />
            </div>
          )}
        </div>
      </div>

      {/* Bottom progress bar for unread notifications */}
      {!notification.read && (
        <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-b-2xl overflow-hidden bg-[var(--card-hover)]">
          <div className="h-full bg-gradient-to-r from-[#31aa40] to-emerald-400 animate-progress" />
        </div>
      )}
    </div>
  );
}