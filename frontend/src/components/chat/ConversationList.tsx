// components/chat/ConversationList.tsx
'use client';

import { memo, useState, useMemo, useCallback } from 'react';
import { Search, MessageCircle, Users, Inbox, Bell, Filter, X, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Conversation } from '@/types/chat';
import { ConversationItem } from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  unreadCounts: Record<string, number>;
  onlineUsers: string[];
  selectedConversationId: string | null;
  onSelectConversation: (conversation: Conversation) => void;
  totalUnread: number;
  isLoading: boolean;
}

export const ConversationList = memo(({
  conversations,
  unreadCounts,
  onlineUsers,
  selectedConversationId,
  onSelectConversation,
  totalUnread,
  isLoading
}: ConversationListProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showUnreadOnly, setShowUnreadOnly] = useState(false);

  const filteredConversations = useMemo(() => {
    let filtered = conversations;
    
    if (searchTerm.trim()) {
      filtered = filtered.filter((conv) =>
        conv.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (showUnreadOnly) {
      filtered = filtered.filter((conv) => (unreadCounts[conv._id] || 0) > 0);
    }
    
    return filtered.sort((a, b) => {
      const aUnread = unreadCounts[a._id] || 0;
      const bUnread = unreadCounts[b._id] || 0;
      
      if (aUnread > 0 && bUnread === 0) return -1;
      if (aUnread === 0 && bUnread > 0) return 1;
      
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }, [conversations, searchTerm, showUnreadOnly, unreadCounts]);

  const formatTime = useCallback((date: string) => {
    if (!date) return '';
    const msgDate = new Date(date);
    const now = new Date();
    const diff = now.getTime() - msgDate.getTime();
    
    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
    if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
    return msgDate.toLocaleDateString();
  }, []);

  // Handle conversation selection
  const handleSelect = useCallback((conversation: Conversation) => {
    onSelectConversation(conversation);
  }, [onSelectConversation]);

  if (isLoading && conversations.length === 0) {
    return (
      <div className="w-[420px] border-r border-[var(--border)] bg-[var(--card)] flex flex-col h-screen">
        <div className="p-6 border-b border-[var(--border)]">
          <h1 className="text-2xl font-bold text-white">Messages</h1>
        </div>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
            <div className="space-y-2">
              <div className="h-3 bg-[var(--card-hover)] rounded w-32 mx-auto animate-pulse"></div>
              <div className="h-2 bg-[var(--card-hover)] rounded w-24 mx-auto animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[420px] border-r border-[var(--border)] bg-[var(--card)] flex flex-col h-screen">
      {/* Header */}
      <div className="p-6 border-b border-[var(--border)] bg-[var(--card)] flex-shrink-0">
        <h1 className="text-2xl font-bold text-white mb-5">Messages</h1>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-[var(--text-muted)]" />
          </div>
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[var(--background)] text-white text-sm rounded-xl pl-10 pr-4 py-3 border border-[var(--border)] focus:border-[var(--primary)] focus:outline-none transition-all placeholder:text-[var(--text-muted)]"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="px-6 py-3 border-b border-[var(--border)] bg-[var(--background-soft)] flex-shrink-0">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUnreadOnly(false)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              !showUnreadOnly
                ? 'bg-[var(--primary)] text-black'
                : 'bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-white'
            }`}
          >
            All Chats
          </button>
          
          <button
            onClick={() => setShowUnreadOnly(true)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all flex items-center gap-2 ${
              showUnreadOnly
                ? 'bg-[var(--primary)] text-black'
                : 'bg-[var(--card-hover)] text-[var(--text-muted)] hover:text-white'
            }`}
          >
            <Bell className="w-3 h-3" />
            Unread
            {totalUnread > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                showUnreadOnly ? 'bg-black/20 text-black' : 'bg-red-500 text-white'
              }`}>
                {totalUnread}
              </span>
            )}
          </button>

          {showUnreadOnly && (
            <button
              onClick={() => setShowUnreadOnly(false)}
              className="ml-2 p-1.5 hover:bg-[var(--card-hover)] rounded-lg transition-colors text-[var(--text-muted)] hover:text-white"
              title="Clear unread filter"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {conversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-24 h-24 rounded-full bg-[var(--card-hover)] flex items-center justify-center mb-5">
              <Inbox className="w-12 h-12 text-[var(--text-muted)]" />
            </div>
            <h3 className="text-white font-semibold text-xl mb-2">No conversations yet</h3>
            <p className="text-[var(--text-muted)] text-sm max-w-xs leading-relaxed">
              Start a new conversation by messaging someone from the alumni network
            </p>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="text-center py-16">
            {showUnreadOnly ? (
              <>
                <Bell className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-white font-medium text-lg mb-2">No unread messages</p>
                <p className="text-[var(--text-muted)] text-sm">You're all caught up! 🎉</p>
                <button
                  onClick={() => setShowUnreadOnly(false)}
                  className="mt-4 text-[var(--primary)] hover:text-[#259a3a] text-sm font-medium transition-colors"
                >
                  Show all conversations
                </button>
              </>
            ) : (
              <>
                <Search className="w-16 h-16 text-[var(--text-muted)] mx-auto mb-4" />
                <p className="text-[var(--text-muted)] font-medium">No conversations found</p>
                <p className="text-[var(--text-muted)] text-sm mt-1">Try adjusting your search</p>
              </>
            )}
          </div>
        ) : (
          <div className="py-2">
            {filteredConversations.map((conversation) => {
              const unreadCount = unreadCounts[conversation._id] || 0;
              const isSelected = selectedConversationId === conversation._id;
              const isOnline = onlineUsers?.includes(conversation._id) || false;
              const lastMsgTime = conversation.updatedAt ? formatTime(conversation.updatedAt) : '';
              
              return (
                <ConversationItem
                  key={conversation._id}
                  conversation={conversation}
                  isSelected={isSelected}
                  unreadCount={unreadCount}
                  isOnline={isOnline}
                  onSelect={handleSelect}
                  lastMessageTime={lastMsgTime}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
});

ConversationList.displayName = 'ConversationList';