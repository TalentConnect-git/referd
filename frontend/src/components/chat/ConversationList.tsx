"use client";

import { memo, useCallback, useMemo, useState } from "react";
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
  }: ConversationListProps) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [showUnreadOnly, setShowUnreadOnly] = useState(false);

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
        <div className="flex h-screen w-[420px] flex-col border-r border-[var(--border)] bg-[var(--card)]">
          <div className="border-b border-[var(--border)] p-6">
            <h1 className="text-2xl font-bold text-white">Messages</h1>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="space-y-4 text-center">
              <div className="mx-auto h-16 w-16 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
              <p className="text-[var(--text-muted)]">Loading chats...</p>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="flex h-screen w-[420px] flex-col border-r border-[var(--border)] bg-[var(--card)]">
        <div className="flex-shrink-0 border-b border-[var(--border)] bg-[var(--card)] p-6">
          <h1 className="mb-5 text-2xl font-bold text-white">Messages</h1>

          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
              <Search className="h-4 w-4 text-[var(--text-muted)]" />
            </div>

            <input
              type="text"
              placeholder="Search conversations..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] py-3 pl-10 pr-4 text-sm text-white transition-all placeholder:text-[var(--text-muted)] focus:border-[var(--primary)] focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-shrink-0 border-b border-[var(--border)] bg-[var(--background-soft)] px-6 py-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowUnreadOnly(false)}
              className={`rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                !showUnreadOnly
                  ? "bg-[var(--primary)] text-black"
                  : "bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              All Chats
            </button>

            <button
              type="button"
              onClick={() => setShowUnreadOnly(true)}
              className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium transition-all ${
                showUnreadOnly
                  ? "bg-[var(--primary)] text-black"
                  : "bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-white"
              }`}
            >
              <Bell className="h-3 w-3" />
              Unread
              {totalUnread > 0 && (
                <span
                  className={`rounded-full px-1.5 py-0.5 text-xs ${
                    showUnreadOnly
                      ? "bg-black/20 text-black"
                      : "bg-red-500 text-white"
                  }`}
                >
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </button>

            {showUnreadOnly && (
              <button
                type="button"
                onClick={() => setShowUnreadOnly(false)}
                className="ml-2 rounded-lg p-1.5 text-[var(--text-muted)] transition-colors hover:bg-[var(--card-hover)] hover:text-white"
                title="Show all chats"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {conversations.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center p-8 text-center">
              <div className="mb-5 flex h-24 w-24 items-center justify-center rounded-full bg-[var(--card-hover)]">
                <Inbox className="h-12 w-12 text-[var(--text-muted)]" />
              </div>

              <h3 className="mb-2 text-xl font-semibold text-white">
                No conversations yet
              </h3>

              <p className="max-w-xs text-sm leading-relaxed text-[var(--text-muted)]">
                Start a new conversation by messaging someone.
              </p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="py-16 text-center">
              {showUnreadOnly ? (
                <>
                  <Bell className="mx-auto mb-4 h-16 w-16 text-[var(--text-muted)]" />
                  <p className="mb-2 text-lg font-medium text-white">
                    No unread messages
                  </p>
                  <p className="text-sm text-[var(--text-muted)]">
                    You're all caught up!
                  </p>

                  <button
                    type="button"
                    onClick={() => setShowUnreadOnly(false)}
                    className="mt-4 text-sm font-medium text-[var(--primary)] transition-colors hover:text-[#259a3a]"
                  >
                    Show all conversations
                  </button>
                </>
              ) : (
                <>
                  <Search className="mx-auto mb-4 h-16 w-16 text-[var(--text-muted)]" />
                  <p className="font-medium text-[var(--text-muted)]">
                    No conversations found
                  </p>
                </>
              )}
            </div>
          ) : (
            <div className="py-2">
              {filteredConversations.map((conversation) => (
                <ConversationItem
                  key={conversation._id}
                  conversation={conversation}
                  isSelected={selectedConversationId === conversation._id}
                  unreadCount={unreadCounts[conversation._id] || 0}
                  isOnline={onlineUsers?.includes(conversation._id) || false}
                  onSelect={onSelectConversation}
                  lastMessageTime={
                    conversation.updatedAt ? formatTime(conversation.updatedAt) : ""
                  }
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ConversationList.displayName = "ConversationList";