"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useSocketContext } from "@/context/SocketContext";
import { useGetMessages } from "@/hooks/useGetMessages";
import useSendMessage from "@/hooks/useSendMessage";
import useGetSocketMessage from "@/hooks/useGetSocketMessage";
import { ChatArea } from "@/components/chat/ChatArea";
import { Conversation } from "@/types/chat";

interface ConversationPageClientProps {
  conversationId: string;
}

const getRolePathFromPathname = (pathname: string) => {
  const first = pathname.split("/").filter(Boolean)[0];

  if (first === "professional") return "professional";
  if (first === "student") return "student";
  if (first === "fresher") return "fresher";

  return "student";
};

const createTempConversation = (
  id: string,
  name: string
): Conversation => {
  return {
    _id: id,
    name: name || "User",
    lastMessage: "Start a conversation...",
    updatedAt: new Date().toISOString(),
    participants: [id],
    isTemporary: true,
  };
};

export default function ConversationPageClient({
  conversationId,
}: ConversationPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rolePath = getRolePathFromPathname(pathname);
  const userNameFromUrl = searchParams.get("userName") || "User";

  const { user } = useAuth();
  const { socket, onlineUsers } = useSocketContext();
  const { selectedConversation, messages, setSelectedConversation } = useChat();

  const [newMessage, setNewMessage] = useState("");
  const hasMarkedReadRef = useRef<string | null>(null);

  const { sendMessages } = useSendMessage();

  const fallbackConversation = useMemo(() => {
    return createTempConversation(conversationId, userNameFromUrl);
  }, [conversationId, userNameFromUrl]);

  const activeConversation = useMemo(() => {
    if (selectedConversation?._id === conversationId) {
      return selectedConversation;
    }

    return fallbackConversation;
  }, [selectedConversation, conversationId, fallbackConversation]);

  useEffect(() => {
    if (!activeConversation) return;

    if (selectedConversation?._id !== activeConversation._id) {
      setSelectedConversation(activeConversation);
    }

    window.dispatchEvent(
      new CustomEvent("chat:open-conversation", {
        detail: {
          chatPartnerId: activeConversation._id,
          chatPartnerName: activeConversation.name,
        },
      })
    );

    window.dispatchEvent(
      new CustomEvent("chat:clear-unread", {
        detail: {
          chatPartnerId: activeConversation._id,
        },
      })
    );
  }, [activeConversation, selectedConversation?._id, setSelectedConversation]);

  useGetSocketMessage(conversationId);

  const {
    loading: messagesLoading,
    error: messagesError,
    refreshMessages,
  } = useGetMessages(conversationId);

  useEffect(() => {
    if (!socket || !conversationId) return;
    if (hasMarkedReadRef.current === conversationId) return;

    hasMarkedReadRef.current = conversationId;

    socket.emit("messageRead", {
      chatPartnerId: conversationId,
      conversationId,
      userId: user?._id,
    });
  }, [socket, conversationId, user?._id]);

  const getDisplayName = useCallback(() => {
    return activeConversation?.name || userNameFromUrl || "User";
  }, [activeConversation?.name, userNameFromUrl]);

  const getAvatarInitial = useCallback(() => {
    const name = getDisplayName();
    return name.charAt(0).toUpperCase() || "U";
  }, [getDisplayName]);

  const isPartnerOnline = useMemo(() => {
    return Boolean(onlineUsers?.includes(conversationId));
  }, [onlineUsers, conversationId]);

  const formatMessageDate = useCallback((date: string) => {
    if (!date) return "";

    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) return "Today";
    if (d.toDateString() === yesterday.toDateString()) return "Yesterday";

    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  }, []);

  const formatMessageTime = useCallback((date: string) => {
    if (!date) return "";

    return new Date(date).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  const handleSendMessage = useCallback(async () => {
    const text = newMessage.trim();

    if (!text || !conversationId) return;

    setNewMessage("");

    await sendMessages(text, conversationId, getDisplayName());
  }, [newMessage, conversationId, sendMessages, getDisplayName]);

  if (messagesError) {
    return (
      <div
        className="flex h-full flex-1 items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-[var(--card)]">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>

          <h3 className="mb-2 text-lg font-semibold text-white">
            Failed to load messages
          </h3>

          <p className="mx-auto max-w-sm text-sm text-[var(--text-muted)]">
            {messagesError}
          </p>

          <button
            onClick={refreshMessages}
            className="mt-6 rounded-xl bg-[var(--primary)] px-6 py-3 text-white transition-all hover:bg-[#259a3a]"
          >
            <RefreshCw className="mr-2 inline h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatArea
      conversation={activeConversation}
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
      onBack={() => router.push(`/${rolePath}/message`)}
      isCreatingConversation={false}
    />
  );
}