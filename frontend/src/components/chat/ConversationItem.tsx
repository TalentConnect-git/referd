// components/chat/ConversationItem.tsx
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

export const ConversationItem = memo(({
  conversation,
  isSelected,
  unreadCount,
  isOnline = false,
  onSelect,
  lastMessageTime,
}: ConversationItemProps) => {
  const handleClick = useCallback(() => {
    onSelect(conversation);
  }, [conversation, onSelect]);

  const getInitials = (name: string) => name.charAt(0).toUpperCase();

  return (
    <div
      onClick={handleClick}
      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-all hover:bg-[var(--card-hover)] ${
        isSelected ? "bg-[var(--card-hover)]" : ""
      }`}
    >
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#22c55e] to-[#16a34a] flex items-center justify-center text-white font-semibold text-lg shadow-lg">
          {getInitials(conversation.name)}
        </div>
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5">
            <div className="w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-[var(--card)] animate-pulse-dot" />
          </div>
        )}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 min-w-[20px] h-5 bg-red-500 rounded-full flex items-center justify-center text-white text-[10px] font-bold px-1.5 shadow-lg shadow-red-500/30">
            {unreadCount > 99 ? "99+" : unreadCount}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <h3 className={`text-sm font-medium truncate ${unreadCount > 0 ? "text-white font-semibold" : "text-white"}`}>
            {conversation.name}
          </h3>
          {lastMessageTime && (
            <span className="text-[10px] text-[var(--text-muted)] flex-shrink-0 ml-2">
              {lastMessageTime}
            </span>
          )}
        </div>
        <p className={`text-sm truncate ${unreadCount > 0 ? "text-white font-medium" : "text-[var(--text-muted)]"}`}>
          {conversation.lastMessage || "Start a conversation..."}
        </p>
      </div>
      <ChevronRight
        className={`w-4 h-4 flex-shrink-0 transition-all ${
          isSelected ? "text-[var(--primary)]" : "text-[var(--text-muted)]"
        }`}
      />
    </div>
  );
});

ConversationItem.displayName = "ConversationItem";