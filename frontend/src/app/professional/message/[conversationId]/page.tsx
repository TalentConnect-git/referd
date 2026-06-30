// app/professional/message/[conversationId]/page.tsx
"use client";

import React, { useState, useCallback, useMemo, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { use } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useSocketContext } from "@/context/SocketContext";
import {useGetMessages} from "@/hooks/useGetMessages";
import useSendMessage from "@/hooks/useSendMessage";
import useGetSocketMessage from "@/hooks/useGetSocketMessage";
import { useCreateConversation } from "@/hooks/useCreateConversation";
import { useGetAllUsers } from "@/hooks/useGetAllUsers";
import { ChatArea } from "@/components/chat/ChatArea";
import { AlertCircle, RefreshCw } from 'lucide-react';
import { messageService } from "@/services/message.service";

interface PageProps {
  params: Promise<{ conversationId: string }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function ConversationPage({ params, searchParams }: PageProps) {
  const unwrappedParams = use(params);
  const unwrappedSearchParams = searchParams ? use(searchParams) : {};
  const conversationId = unwrappedParams.conversationId;

  const router = useRouter();
  const { user } = useAuth();
  const { socket, onlineUsers } = useSocketContext();
  const { selectedConversation, messages, setMessages } = useChat();
  const { sendMessages } = useSendMessage();
  const { createConversation, loading: creatingConversation } = useCreateConversation();
  const { clearUnreadCount, refreshConversations } = useGetAllUsers();

  const [newMessage, setNewMessage] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const hasClearedUnreadRef = useRef(false);

  useGetSocketMessage();
  const { loading: messagesLoading, error: messagesError, refreshMessages } = useGetMessages();

  // Clear unread count immediately when conversation loads
  useEffect(() => {
    if (selectedConversation?._id && !hasClearedUnreadRef.current) {
      // Immediately clear unread count for this conversation
      clearUnreadCount(selectedConversation._id);
      hasClearedUnreadRef.current = true;
      
      // Emit socket event to notify other devices
      if (socket) {
        socket.emit('messageRead', {
          conversationId: selectedConversation._id,
          userId: user?._id
        });
      }
      
      // Refresh in background to sync
      setTimeout(() => {
        refreshConversations();
      }, 500);
    }
  }, [selectedConversation, clearUnreadCount, socket, user, refreshConversations]);

  // Reset when conversation changes
  useEffect(() => {
    hasClearedUnreadRef.current = false;
  }, [conversationId]);

  const getSearchParamValue = useCallback((param: string | string[] | undefined): string | undefined => {
    return Array.isArray(param) ? param[0] : param;
  }, []);

  const userNameFromParams = useMemo(
    () => getSearchParamValue(unwrappedSearchParams?.userName),
    [unwrappedSearchParams?.userName, getSearchParamValue]
  );

  useEffect(() => {
    if (userNameFromParams && !selectedConversation && !isCreating) {
      setIsCreating(true);
      createConversation(conversationId, userNameFromParams).finally(() => setIsCreating(false));
    }
  }, [userNameFromParams, selectedConversation, isCreating, createConversation, conversationId]);

  const getDisplayName = useCallback(() => {
    if (selectedConversation?.name) return selectedConversation.name;
    if (userNameFromParams) return userNameFromParams;
    return "User";
  }, [selectedConversation, userNameFromParams]);

  const getAvatarInitial = useCallback(() => {
    const name = getDisplayName();
    return name ? name.charAt(0).toUpperCase() : "U";
  }, [getDisplayName]);

  const isPartnerOnline = useMemo(() => {
    const partnerId = selectedConversation?._id || conversationId;
    return onlineUsers?.includes(partnerId) || false;
  }, [onlineUsers, selectedConversation, conversationId]);

  const formatMessageDate = useCallback((date: string) => {
    if (!date) return "";
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, []);

  const formatMessageTime = useCallback((date: string) => {
    if (!date) return "";
    return new Date(date).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  }, []);

  const isMyMessage = useCallback((message: any) => {
    if (!user) return false;
    if (typeof message.sender === "string") return message.sender === user._id;
    return message.sender?._id === user._id;
  }, [user]);

  const handleSendMessage = useCallback(async () => {
    const text = newMessage.trim();
    if (!text || !selectedConversation?._id) return;

    setNewMessage("");
    const sentMessage = await sendMessages(text);
    if (sentMessage) {
      setMessages(prev => {
        const exists = prev.some(m => m._id === sentMessage._id);
        return exists ? prev : [...prev, sentMessage];
      });
    }
  }, [newMessage, selectedConversation, sendMessages, setMessages]);

  if (messagesError) {
    return (
      <div className="flex-1 flex items-center justify-center h-full" style={{ background: 'var(--background)' }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[var(--card)] flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h3 className="text-white font-semibold text-lg mb-2">Failed to load messages</h3>
          <p className="text-[var(--text-muted)] text-sm max-w-sm">{messagesError}</p>
          <button
            onClick={refreshMessages}
            className="mt-6 px-6 py-3 bg-[var(--primary)] text-white rounded-xl hover:bg-[#259a3a] transition-all"
          >
            <RefreshCw className="w-4 h-4 inline mr-2" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatArea
      conversation={selectedConversation}
      messages={messages}
      messagesLoading={messagesLoading}
      newMessage={newMessage}
      onNewMessageChange={setNewMessage}
      onSendMessage={handleSendMessage}
      isPartnerOnline={isPartnerOnline}
      getDisplayName={getDisplayName}
      getAvatarInitial={getAvatarInitial}
      formatMessageDate={formatMessageDate}
      formatMessageTime={formatMessageTime}
      
      onBack={() => router.push("/professional/message")}
      isCreatingConversation={creatingConversation || isCreating}
    />
  );
}

