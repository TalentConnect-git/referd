
'use client';

import React, { useEffect, useCallback, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import { useSocketContext } from '@/context/SocketContext';
import { useGetAllUsers } from '@/hooks/useGetAllUsers';
import {useGetSocketMessage} from '@/hooks/useGetSocketMessage';
import { ConversationList } from '@/components/chat/ConversationList';

export default function MessageLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { onlineUsers } = useSocketContext();
  const { selectedConversation, setSelectedConversation } = useChat();
  const { 
    conversations, 
    loading, 
    unreadCounts, 
    totalUnread, 
    hasLoaded,
    clearUnreadCount,
    refreshConversations
  } = useGetAllUsers();
  
  useGetSocketMessage();

  // Extract conversation ID from pathname
  const getConversationId = useCallback(() => {
    const match = pathname.match(/\/student\/message\/([^/]+)/);
    return match ? match[1] : null;
  }, [pathname]);

  const conversationId = getConversationId();

  // Find current conversation
  const currentConversation = useMemo(
    () => conversations.find((conv) => conv._id === conversationId) || null,
    [conversations, conversationId]
  );

  // Set selected conversation when found and clear unread count
  useEffect(() => {
    if (currentConversation) {
      setSelectedConversation(currentConversation);
      // Clear unread count immediately when conversation is selected
      clearUnreadCount(currentConversation._id);
      console.log(`✅ Cleared unread count for: ${currentConversation.name}`);
    }
  }, [currentConversation, setSelectedConversation, clearUnreadCount]);

  // Handle conversation selection - prevent page refresh
  const handleSelectConversation = useCallback((conversation: any) => {
    console.log(`📱 Selecting conversation: ${conversation.name}`);
    setSelectedConversation(conversation);
    // Clear unread count immediately
    clearUnreadCount(conversation._id);
    // Navigate without causing page refresh
    router.push(`/student/message/${conversation._id}`, { scroll: false });
  }, [setSelectedConversation, clearUnreadCount, router]);

  // Only show full page loading on initial load with no conversations
  if (loading && !hasLoaded && conversations.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: 'var(--background)' }}>
        <div className="text-white text-center">
          <div className="w-12 h-12 border-4 border-[var(--primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--text-muted)]">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Left Sidebar - STATIC, never re-renders on navigation */}
      <div className="flex-shrink-0 h-screen">
        <ConversationList
          conversations={conversations}
          unreadCounts={unreadCounts}
          onlineUsers={onlineUsers || []}
          selectedConversationId={conversationId}
          onSelectConversation={handleSelectConversation}
          totalUnread={totalUnread}
          isLoading={loading && !hasLoaded}
        />
      </div>

      {/* Right Side - Dynamic content (only this re-renders) */}
      <div className="flex-1 min-w-0 h-screen">
        {children}
      </div>
    </div>
  );
}