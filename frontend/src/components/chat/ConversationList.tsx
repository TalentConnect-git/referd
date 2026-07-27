// components/chat/ConversationList.tsx
"use client";

import { memo, useCallback, useMemo, useState, useEffect } from "react";
import { Bell, Inbox, Search, X } from "lucide-react";
import { Conversation } from "@/types/chat";
import { ConversationItem } from "./ConversationItem";

interface ConversationListProps {
  conversations: Conversation[];
  unreadCounts: Record<string, number>;
  onlineUsers: string[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  totalUnread: number;
  isLoading: boolean;
  // Add this to receive profile images from parent
  profileImages?: Record<string, string>;
}

export const ConversationList = memo(
  ({
    conversations,
    unreadCounts,
    onlineUsers,
    selectedConversationId,
    onSelectConversation,
    totalUnread,
    isLoading,
    profileImages = {}, // Default to empty object
  }: ConversationListProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

    useEffect(() => {
      console.log("📋 ConversationList - Total conversations:", conversations.length);
      conversations.forEach((conv, index) => {
        console.log(`  ${index + 1}. ${conv.name} - Profile Image:`, conv.profileImage || "No image");
      });
      console.log("📸 Profile Images Map:", profileImages);
    }, [conversations, profileImages]);

    const filteredConversations = useMemo(() => {
      let list = [...conversations];

      list.sort((a, b) => {
        const aUnread = unreadCounts[a._id] || 0;
        const bUnread = unreadCounts[b._id] || 0;

        if (aUnread > 0 && bUnread === 0) return -1;
        if (aUnread === 0 && bUnread > 0) return 1;

        return (
          new Date(b.updatedAt || 0).getTime() -
          new Date(a.updatedAt || 0).getTime()
        );
      });

      if (searchTerm.trim()) {
        const query = searchTerm.trim().toLowerCase();
        list = list.filter((conversation) =>
          String(conversation.name || "User").toLowerCase().includes(query)
        );
      }

      if (showUnreadOnly) {
        list = list.filter(
          (conversation) => (unreadCounts[conversation._id] || 0) > 0
        );
      }

      return list;
    }, [conversations, unreadCounts, searchTerm, showUnreadOnly]);

    const formatTime = useCallback((date: string) => {
      if (!date) return "";
      const msgDate = new Date(date);
      const now = new Date();
      const diff = now.getTime() - msgDate.getTime();

      if (diff < 60_000) return "Just now";
      if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m`;
      if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h`;
      if (diff < 604_800_000) return `${Math.floor(diff / 86_400_000)}d`;
      return msgDate.toLocaleDateString();
    }, []);

    if (isLoading && conversations.length === 0) {
      return (
        <div className="flex h-screen w-full max-w-[420px] flex-col border-r border-theme bg-card">
          <div className="border-b border-divider p-4 sm:p-6">
            <h1 className="text-xl sm:text-2xl font-bold text-primary">Messages</h1>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-12 w-12 sm:h-16 sm:w-16 animate-spin rounded-full border-4 border-primary border-t-transparent" />
              <p className="text-sm sm:text-base text-muted">Loading chats...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-screen w-full max-w-[420px] flex-col border-r border-theme bg-card">
        <div className="flex-shrink-0 border-b border-divider bg-card p-3 sm:p-4 md:p-6">
          <h1 className="mb-3 sm:mb-4 md:mb-5 text-xl sm:text-2xl font-bold text-primary">Messages</h1>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border px-3 py-2 sm:px-4 sm:py-2.5 pl-9 sm:pl-10 text-xs sm:text-sm"
              style={{
                background: "var(--background)",
                borderColor: "var(--border)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        <div className="flex-shrink-0 border-b border-divider px-3 sm:px-4 md:px-6 py-2 sm:py-3" style={{ background: "var(--background)" }}>
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => setShowUnreadOnly(false)}
              className={`rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium transition-all ${
                !showUnreadOnly
                  ? "text-inverse"
                  : "text-muted hover:text-primary"
              }`}
              style={{
                background: !showUnreadOnly ? "var(--primary)" : "var(--card-hover)",
              }}
            >
              All Chats
            </button>

            <button
              type="button"
              onClick={() => setShowUnreadOnly(true)}
              className={`flex items-center gap-1.5 sm:gap-2 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[10px] sm:text-xs font-medium transition-all ${
                showUnreadOnly
                  ? "text-inverse"
                  : "text-muted hover:text-primary"
              }`}
              style={{
                background: showUnreadOnly ? "var(--primary)" : "var(--card-hover)",
              }}
            >
              <Bell className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              Unread
              {totalUnread > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-[10px] ${
                    showUnreadOnly
                      ? "bg-black/20 text-inverse"
                      : "text-inverse"
                  }`}
                  style={{
                    background: showUnreadOnly ? "rgba(0,0,0,0.2)" : "var(--danger)",
                  }}
                >
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </button>

            {showUnreadOnly && (
              <button
                type="button"
                onClick={() => setShowUnreadOnly(false)}
                className="rounded-lg p-1.5 text-muted transition-colors hover:bg-card-hover hover:text-primary"
                title="Show all chats"
              >
                <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-6 sm:p-8 text-center">
              <div className="mb-4 sm:mb-5 flex h-16 w-16 sm:h-20 sm:w-20 md:h-24 md:w-24 items-center justify-center rounded-full" style={{ background: "var(--card-hover)" }}>
                <Inbox className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12" style={{ color: "var(--text-muted)" }} />
              </div>
              <h3 className="mb-1.5 sm:mb-2 text-lg sm:text-xl font-semibold text-primary">
                No conversations yet
              </h3>
              <p className="max-w-xs text-xs sm:text-sm leading-relaxed text-muted">
                Start a new conversation by messaging someone.
              </p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="py-12 sm:py-16 text-center">
              {showUnreadOnly ? (
                <>
                  <Bell className="mx-auto mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16" style={{ color: "var(--text-muted)" }} />
                  <p className="mb-1.5 sm:mb-2 text-base sm:text-lg font-medium text-primary">
                    No unread messages
                  </p>
                  <p className="text-xs sm:text-sm text-muted">
                    You're all caught up!
                  </p>
                  <button
                    type="button"
                    onClick={() => setShowUnreadOnly(false)}
                    className="mt-3 sm:mt-4 text-xs sm:text-sm font-medium transition-colors hover:text-primary-hover"
                    style={{ color: "var(--primary)" }}
                  >
                    Show all conversations
                  </button>
                </>
              ) : (
                <>
                  <Search className="mx-auto mb-3 sm:mb-4 h-12 w-12 sm:h-16 sm:w-16" style={{ color: "var(--text-muted)" }} />
                  <p className="text-sm sm:text-base font-medium text-muted">
                    No conversations found
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="py-1 sm:py-2">
              {filteredConversations.map((conversation) => {
                // ✅ FIX: Merge profile image from the map or use existing
                const profileImage = profileImages[conversation._id] || conversation.profileImage || "";
                
                // Create conversation with profile image
                const conversationWithImage = {
                  ...conversation,
                  profileImage: profileImage,
                };
                
                return (
                  <ConversationItem
                    key={conversation._id}
                    conversation={conversationWithImage}
                    isSelected={selectedConversationId === conversation._id}
                    unreadCount={unreadCounts[conversation._id] || 0}
                    isOnline={onlineUsers?.includes(conversation._id) || false}
                    onSelect={onSelectConversation}
                    lastMessageTime={
                      conversation.updatedAt ? formatTime(conversation.updatedAt) : ""
                    }
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ConversationList.displayName = "ConversationList";