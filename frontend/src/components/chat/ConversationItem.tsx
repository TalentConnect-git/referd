"use client";

import { memo, useCallback, useState } from "react";
import { ChevronRight, User } from "lucide-react";
import Image from "next/image";
import { Conversation } from "@/types/chat";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  unreadCount: number;
  isOnline?: boolean;
  onSelect: (conversation: Conversation) => void;
  lastMessageTime?: string;
}

export const ConversationItem = memo(
  ({
    conversation,
    isSelected,
    unreadCount,
    isOnline = false,
    onSelect,
    lastMessageTime,
  }: ConversationItemProps) => {
    const [imageError, setImageError] = useState(false);

    const handleClick = useCallback(() => {
      if (!conversation?._id) return;
      onSelect(conversation);
    }, [conversation, onSelect]);

    const displayName = conversation.name || "User";
    const initials = displayName
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
    const lastMessage = conversation.lastMessage || "Start a conversation...";

    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all hover:bg-[var(--card-hover)] ${
          isSelected ? "bg-[var(--card-hover)] border-l-4 border-[var(--primary)]" : "border-l-4 border-transparent"
        }`}
      >
        <div className="relative flex-shrink-0">
          {/* Profile Image */}
          {conversation.profileImage && !imageError ? (
            <Image
              src={conversation.profileImage}
              alt={displayName}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover border-2 border-[var(--border)] shadow-lg"
              onError={() => setImageError(true)}
            />
          ) : (
            /* Fallback Avatar with Gradient */
            <div className={`h-12 w-12 rounded-full flex items-center justify-center text-lg font-semibold text-white shadow-lg ${
              isSelected 
                ? "bg-gradient-to-br from-[#22c55e] to-[#16a34a]" 
                : "bg-gradient-to-br from-[#22c55e]/80 to-[#16a34a]/80"
            }`}>
              {initials || <User className="h-5 w-5" />}
            </div>
          )}

          {/* Online Status Indicator */}
          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5">
              <div className="h-3.5 w-3.5 animate-pulse rounded-full border-2 border-[var(--card)] bg-green-500" />
            </div>
          )}

          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <div className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white shadow-lg shadow-red-500/30">
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3
              className={`truncate text-sm ${
                unreadCount > 0
                  ? "font-bold text-white"
                  : "font-medium text-white"
              }`}
            >
              {displayName}
            </h3>

            {lastMessageTime && (
              <span className="ml-2 flex-shrink-0 text-[10px] text-[var(--text-muted)]">
                {lastMessageTime}
              </span>
            )}
          </div>

          <p
            className={`truncate text-sm ${
              unreadCount > 0
                ? "font-semibold text-white"
                : "text-[var(--text-muted)]"
            }`}
          >
            {lastMessage}
          </p>
        </div>

        <ChevronRight
          className={`h-4 w-4 flex-shrink-0 transition-all ${
            isSelected ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
          }`}
        />
      </button>
    );
  }
);

ConversationItem.displayName = "ConversationItem";