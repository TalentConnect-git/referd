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

// Avatar color palette based on name
const getAvatarColor = (name: string) => {
  const colors = [
    { bg: "#FF6B6B", text: "#FFFFFF" },  // Red
    { bg: "#4ECDC4", text: "#FFFFFF" },  // Teal
    { bg: "#45B7D1", text: "#FFFFFF" },  // Blue
    { bg: "#96CEB4", text: "#FFFFFF" },  // Green
    { bg: "#FFEAA7", text: "#2D3436" },  // Yellow
    { bg: "#DDA0DD", text: "#FFFFFF" },  // Plum
    { bg: "#FF8A5C", text: "#FFFFFF" },  // Orange
    { bg: "#A29BFE", text: "#FFFFFF" },  // Purple
    { bg: "#FD79A8", text: "#FFFFFF" },  // Pink
    { bg: "#00B894", text: "#FFFFFF" },  // Mint
    { bg: "#FDCB6E", text: "#2D3436" },  // Gold
    { bg: "#6C5CE7", text: "#FFFFFF" },  // Violet
    { bg: "#00CEC9", text: "#FFFFFF" },  // Cyan
    { bg: "#E17055", text: "#FFFFFF" },  // Coral
    { bg: "#74B9FF", text: "#FFFFFF" },  // Light Blue
  ];

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

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

    // Get avatar color based on name
    const avatarColor = getAvatarColor(displayName);

    // Truncate last message
    const truncatedMessage = lastMessage.length > 40 
      ? lastMessage.substring(0, 40) + "..." 
      : lastMessage;

    return (
      <button
        type="button"
        onClick={handleClick}
        className={`group flex w-full items-start gap-3 px-3 sm:px-4 py-3 sm:py-3.5 text-left transition-all duration-200 hover:bg-[var(--bg-hover)] ${
          isSelected 
            ? "bg-[var(--bg-selected)] border-l-[3px] border-[var(--primary)]" 
            : "border-l-[3px] border-transparent hover:border-l-[3px] hover:border-[var(--border-hover)]"
        }`}
      >
        {/* Avatar Section */}
        <div className="relative flex-shrink-0 mt-0.5">
          {hasProfileImage ? (
            <div className="relative">
              <Image
                src={profileImageUrl}
                alt={displayName}
                width={44}
                height={44}
                className="h-11 w-11 sm:h-12 sm:w-12 rounded-full object-cover shadow-md ring-2 ring-[var(--border-light)] transition-all group-hover:ring-[var(--primary-light)]"
                onError={() => {
                  console.error("❌ Image failed to load:", profileImageUrl);
                  setImageError(true);
                }}
                onLoad={() => {
                  console.log("✅ Image loaded successfully:", profileImageUrl);
                }}
                priority
              />
            </div>
          ) : (
            <div 
              className="h-11 w-11 sm:h-12 sm:w-12 rounded-full flex items-center justify-center text-base sm:text-lg font-semibold shadow-md ring-2 ring-[var(--border-light)] transition-all group-hover:ring-[var(--primary-light)] group-hover:scale-105"
              style={{
                backgroundColor:"#27f595",
                color: avatarColor.text,
              }}
            >
              {initials || <User className="h-5 w-5 sm:h-6 sm:w-6" />}
            </div>
          )}

          {/* Online Status Indicator */}
          <div 
            className={`absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 sm:h-4 sm:w-4 rounded-full border-2 border-[var(--card-bg)] transition-all duration-200 ${
              isOnline 
                ? "bg-[var(--success)] shadow-lg shadow-[var(--success-shadow)]" 
                : "bg-[var(--text-muted-light)]"
            }`}
          />

          {/* Unread Count Badge */}
          {unreadCount > 0 && (
            <div 
              className="absolute -right-1 -top-1 flex h-5 min-w-[20px] sm:h-5.5 sm:min-w-[22px] items-center justify-center rounded-full px-1.5 sm:px-2 text-[9px] sm:text-[10px] font-bold text-white shadow-lg shadow-[var(--danger-shadow)] animate-pulse"
              style={{
                background: "var(--danger)",
                boxShadow: "0 2px 12px rgba(239,68,68,0.4)",
              }}
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <h3
              className={`truncate text-sm sm:text-base ${
                unreadCount > 0
                  ? "font-bold text-[var(--text-primary)]"
                  : "font-semibold text-[var(--text-primary)]"
              }`}
            >
              {displayName}
            </h3>

            {lastMessageTime && (
              <span className="flex-shrink-0 text-[10px] sm:text-xs text-[var(--text-muted)] font-medium">
                {lastMessageTime}
              </span>
            )}
          </div>

          <p
            className={`truncate text-xs sm:text-sm mt-0.5 ${
              unreadCount > 0
                ? "font-semibold text-[var(--text-secondary)]"
                : "text-[var(--text-muted)]"
            }`}
          >
            {truncatedMessage}
          </p>
        </div>

        {/* Chevron Icon */}
        <ChevronRight
          className={`h-4 w-4 sm:h-4.5 sm:w-4.5 flex-shrink-0 mt-1 transition-all duration-200 ${
            isSelected 
              ? "text-[var(--primary)] opacity-100" 
              : "text-[var(--text-muted-light)] opacity-0 group-hover:opacity-100"
          }`}
        />
      </button>
    );
  }
);

ConversationItem.displayName = "ConversationItem";