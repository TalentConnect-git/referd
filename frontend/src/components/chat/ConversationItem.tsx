// components/chat/ConversationItem.tsx
"use client";

import { memo, useCallback, useState, useEffect } from "react";
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

    useEffect(() => {
      console.log("🔍 ConversationItem Debug:");
      console.log("  📝 Conversation ID:", conversation?._id);
      console.log("  👤 Display Name:", conversation?.name);
      console.log("  🖼️ Profile Image URL:", conversation?.profileImage);
      console.log("  ✅ Image Error State:", imageError);
      console.log("  📊 Unread Count:", unreadCount);
      console.log("  🟢 Is Online:", isOnline);
    }, [conversation, imageError, unreadCount, isOnline]);

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

    const profileImageUrl = conversation?.profileImage || "";
    const hasProfileImage = profileImageUrl.length > 0 && !imageError;

    return (
      <button
        type="button"
        onClick={handleClick}
        className={`flex w-full items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 text-left transition-all hover:bg-card-hover ${
          isSelected ? "bg-card-hover border-l-4 border-primary" : "border-l-4 border-transparent"
        }`}
      >
        <div className="relative flex-shrink-0">
          {hasProfileImage ? (
            <Image
              src={profileImageUrl}
              alt={displayName}
              width={44}
              height={44}
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-full object-cover border-2 shadow-lg"
              style={{ 
                borderColor: isOnline ? "var(--success)" : "var(--border)",
                borderWidth: "2px"
              }}
              onError={() => {
                console.error("❌ Image failed to load:", profileImageUrl);
                setImageError(true);
              }}
              onLoad={() => {
                console.log("✅ Image loaded successfully:", profileImageUrl);
              }}
              priority
            />
          ) : (
            <div 
              className={`h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold text-inverse shadow-lg ${
                isSelected 
                  ? "bg-gradient-to-br from-primary to-primary-dark" 
                  : "bg-gradient-to-br from-primary/80 to-primary-dark/80"
              }`}
            >
              {initials || <User className="h-4 w-4 sm:h-5 sm:w-5" />}
            </div>
          )}

          {/* Online Status Green Dot */}
          <div className="absolute -bottom-0.5 -right-0.5">
            <div 
              className={`h-3 w-3 sm:h-3.5 sm:w-3.5 rounded-full border-2 ${
                isOnline ? "bg-success" : "bg-muted"
              }`}
              style={{
                borderColor: "var(--card)",
                backgroundColor: isOnline ? "var(--success)" : "var(--text-muted)",
              }}
            />
          </div>

          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <div 
              className="absolute -right-1 -top-1 flex h-4 min-w-[18px] sm:h-5 sm:min-w-[20px] items-center justify-center rounded-full px-1 sm:px-1.5 text-[8px] sm:text-[10px] font-bold text-inverse shadow-lg"
              style={{
                background: "var(--danger)",
                boxShadow: "0 2px 8px rgba(239,68,68,0.3)",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3
              className={`truncate text-xs sm:text-sm ${
                unreadCount > 0
                  ? "font-bold text-primary"
                  : "font-medium text-primary"
              }`}
            >
              {displayName}
            </h3>

            {lastMessageTime && (
              <span className="ml-2 flex-shrink-0 text-[8px] sm:text-[10px] text-muted">
                {lastMessageTime}
              </span>
            )}
          </div>

          <p
            className={`truncate text-xs sm:text-sm ${
              unreadCount > 0
                ? "font-semibold text-primary"
                : "text-muted"
            }`}
          >
            {lastMessage}
          </p>
        </div>

        <ChevronRight
          className={`h-3.5 w-3.5 sm:h-4 sm:w-4 flex-shrink-0 transition-all ${
            isSelected ? "text-primary" : "text-muted"
          }`}
        />
      </button>
    );
  }
);

ConversationItem.displayName = "ConversationItem";