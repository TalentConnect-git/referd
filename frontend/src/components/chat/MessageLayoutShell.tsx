"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useChat } from "@/context/ChatContext";
import { useSocketContext } from "@/context/SocketContext";
import { useGetAllUsers } from "@/hooks/useGetAllUsers";
import useGetSocketMessage from "@/hooks/useGetSocketMessage";
import { ConversationList } from "@/components/chat/ConversationList";
import { Conversation } from "@/types/chat";

const getRolePathFromPathname = (pathname: string) => {
  const first = pathname.split("/").filter(Boolean)[0];

  if (first === "professional") return "professional";
  if (first === "student") return "student";
  if (first === "fresher") return "fresher";

  return "student";
};

const getChatPartnerIdFromPathname = (pathname: string) => {
  const match = pathname.match(
    /\/(?:professional|student|fresher)\/message\/([^/?#]+)/
  );

  return match?.[1] || null;
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

export default function MessageLayoutShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const rolePath = getRolePathFromPathname(pathname);
  const chatPartnerId = getChatPartnerIdFromPathname(pathname);
  const userNameFromUrl = searchParams.get("userName") || "User";

  const { onlineUsers } = useSocketContext();
  const { selectedConversation, setSelectedConversation } = useChat();

  const {
    conversations,
    unreadCounts,
    totalUnread,
    loading,
    hasLoaded,
    clearUnreadCount,
    upsertConversation,
  } = useGetAllUsers();

  useGetSocketMessage(chatPartnerId);

  const fallbackConversation = useMemo(() => {
    if (!chatPartnerId) return null;

    return createTempConversation(chatPartnerId, userNameFromUrl);
  }, [chatPartnerId, userNameFromUrl]);

  const currentConversation = useMemo(() => {
    if (!chatPartnerId) return null;

    const fromList =
      conversations.find((item) => item._id === chatPartnerId) || null;

    if (fromList) return fromList;

    if (selectedConversation?._id === chatPartnerId) {
      return selectedConversation;
    }

    return fallbackConversation;
  }, [chatPartnerId, conversations, selectedConversation, fallbackConversation]);

  const sidebarConversations = useMemo(() => {
    const list = [...conversations];

    if (
      currentConversation &&
      !list.some((item) => item._id === currentConversation._id)
    ) {
      list.unshift(currentConversation);
    }

    return list.sort(
      (a, b) =>
        new Date(b.updatedAt || 0).getTime() -
        new Date(a.updatedAt || 0).getTime()
    );
  }, [conversations, currentConversation]);

  useEffect(() => {
    if (!currentConversation) return;

    const shouldUpdateSelected =
      selectedConversation?._id !== currentConversation._id ||
      selectedConversation?.name !== currentConversation.name;

    if (shouldUpdateSelected) {
      setSelectedConversation(currentConversation);
    }

    clearUnreadCount(currentConversation._id);

    window.dispatchEvent(
      new CustomEvent("chat:clear-unread", {
        detail: { chatPartnerId: currentConversation._id },
      })
    );
  }, [
    currentConversation?._id,
    currentConversation?.name,
    selectedConversation?._id,
    selectedConversation?.name,
    setSelectedConversation,
    clearUnreadCount,
  ]);

  const handleSelectConversation = useCallback(
    (conversation: Conversation) => {
      if (!conversation?._id) return;

      setSelectedConversation(conversation);
      clearUnreadCount(conversation._id);

      window.dispatchEvent(
        new CustomEvent("chat:clear-unread", {
          detail: { chatPartnerId: conversation._id },
        })
      );

      router.push(
        `/${rolePath}/message/${conversation._id}?userName=${encodeURIComponent(
          conversation.name || "User"
        )}`,
        { scroll: false }
      );
    },
    [router, rolePath, setSelectedConversation, clearUnreadCount]
  );

  const handleCreateTempConversation = useCallback(
    (conversation: Conversation) => {
      upsertConversation(conversation);
    },
    [upsertConversation]
  );

  useEffect(() => {
    if (!fallbackConversation) return;

    handleCreateTempConversation(fallbackConversation);
  }, [fallbackConversation?._id]);

  if (loading && !hasLoaded && conversations.length === 0 && !fallbackConversation) {
    return (
      <div
        className="flex h-screen items-center justify-center"
        style={{ background: "var(--background)" }}
      >
        <div className="text-center text-white">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
          <p className="text-[var(--text-muted)]">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ background: "var(--background)" }}
    >
      <div className="h-screen flex-shrink-0">
        <ConversationList
          conversations={sidebarConversations}
          unreadCounts={unreadCounts}
          onlineUsers={onlineUsers || []}
          selectedConversationId={chatPartnerId}
          onSelectConversation={handleSelectConversation}
          totalUnread={totalUnread}
          isLoading={loading && !hasLoaded}
        />
      </div>

      <div className="h-screen min-w-0 flex-1">{children}</div>
    </div>
  );
}