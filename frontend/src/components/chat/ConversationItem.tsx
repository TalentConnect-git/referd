"use client";

import { memo, useCallback } from "react";
import { ChevronRight } from "lucide-react";
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
    const handleClick = useCallback(() => {
      if (!conversation?._id) return;
      onSelect(conversation);
    }, [conversation, onSelect]);

    const displayName = conversation.name || "User";
    const initial = displayName.charAt(0).toUpperCase();
    const lastMessage = conversation.lastMessage || "Start a conversation...";

    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all hover:bg-[var(--card-hover)] ${
          isSelected ? "bg-[var(--card-hover)]" : ""
        }`}
      >
        <div className="relative flex-shrink-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] text-lg font-semibold text-white shadow-lg">
            {initial}
          </div>

          {isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5">
              <div className="h-3.5 w-3.5 animate-pulse rounded-full border-2 border-[var(--card)] bg-green-500" />
            </div>
          )}

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