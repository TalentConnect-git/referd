// components/chat/MessageLayoutShell.tsx
"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
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

const createTempConversation = (id: string, name: string, profileImage?: string): Conversation => {
  return {
    _id: id,
    name: name || "User",
    profileImage: profileImage || "",
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
  const profileImageFromUrl = searchParams.get("profileImage") || "";

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

  // Create profile images map
  const profileImagesMap = useMemo(() => {
    const map: Record<string, string> = {};
    
    conversations.forEach((conv) => {
      if (conv.profileImage) {
        map[conv._id] = conv.profileImage;
      }
    });
    
    if (chatPartnerId && profileImageFromUrl) {
      map[chatPartnerId] = profileImageFromUrl;
    }
    
    return map;
  }, [conversations, chatPartnerId, profileImageFromUrl]);

  const fallbackConversation = useMemo(() => {
    if (!chatPartnerId) return null;
    return createTempConversation(chatPartnerId, userNameFromUrl, profileImageFromUrl);
  }, [chatPartnerId, userNameFromUrl, profileImageFromUrl]);

  const currentConversation = useMemo(() => {
    if (!chatPartnerId) return null;
    
    const fromList = conversations.find((item) => item._id === chatPartnerId) || null;
    
    if (fromList) {
      if (profileImageFromUrl && !fromList.profileImage) {
        return { ...fromList, profileImage: profileImageFromUrl };
      }
      return fromList;
    }
    
    if (selectedConversation?._id === chatPartnerId) {
      if (profileImageFromUrl && !selectedConversation.profileImage) {
        return { ...selectedConversation, profileImage: profileImageFromUrl };
      }
      return selectedConversation;
    }
    
    return fallbackConversation;
  }, [chatPartnerId, conversations, selectedConversation, fallbackConversation, profileImageFromUrl]);

  const sidebarConversations = useMemo(() => {
    const list = [...conversations];
    
    if (currentConversation) {
      const existingIndex = list.findIndex((item) => item._id === currentConversation._id);
      if (existingIndex !== -1) {
        if (profileImageFromUrl && !list[existingIndex].profileImage) {
          list[existingIndex] = { ...list[existingIndex], profileImage: profileImageFromUrl };
        }
      } else {
        list.unshift(currentConversation);
      }
    }
    
    return list.sort(
      (a, b) =>
        new Date(b.updatedAt || 0).getTime() -
        new Date(a.updatedAt || 0).getTime()
    );
  }, [conversations, currentConversation, profileImageFromUrl]);

  useEffect(() => {
    if (!currentConversation) return;
    
    const shouldUpdateSelected =
      selectedConversation?._id !== currentConversation._id ||
      selectedConversation?.name !== currentConversation.name ||
      selectedConversation?.profileImage !== currentConversation.profileImage;
      
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
    currentConversation?.profileImage,
    selectedConversation?._id,
    selectedConversation?.name,
    selectedConversation?.profileImage,
    setSelectedConversation,
    clearUnreadCount,
  ]);

  const handleSelectConversation = useCallback(
    (conversation: Conversation) => {
      if (!conversation?._id) return;
      
      const profileImage = conversation.profileImage || profileImagesMap[conversation._id] || "";
      
      const conversationWithImage = {
        ...conversation,
        profileImage: profileImage,
      };
      
      setSelectedConversation(conversationWithImage);
      clearUnreadCount(conversation._id);
      
      window.dispatchEvent(
        new CustomEvent("chat:clear-unread", {
          detail: { chatPartnerId: conversation._id },
        })
      );
      
      router.push(
        `/${rolePath}/message/${conversation._id}?userName=${encodeURIComponent(
          conversation.name || "User"
        )}&profileImage=${encodeURIComponent(profileImage)}`,
        { scroll: false }
      );
    },
    [router, rolePath, setSelectedConversation, clearUnreadCount, profileImagesMap]
  );

  const handleCreateTempConversation = useCallback(
    (conversation: Conversation) => {
      const conversationWithImage = {
        ...conversation,
        profileImage: conversation.profileImage || profileImageFromUrl || "",
      };
      upsertConversation(conversationWithImage);
    },
    [upsertConversation, profileImageFromUrl]
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
        <div className="text-center text-primary">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted">Loading conversations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Sidebar - Responsive */}
      <div 
        className={`
          h-screen border-r border-theme bg-card
          ${chatPartnerId ? 'hidden sm:block w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px]' : 'block w-full'}
        `}
      >
        <ConversationList
          conversations={sidebarConversations}
          unreadCounts={unreadCounts}
          onlineUsers={onlineUsers || []}
          selectedConversationId={chatPartnerId}
          onSelectConversation={handleSelectConversation}
          totalUnread={totalUnread}
          isLoading={loading && !hasLoaded}
          profileImages={profileImagesMap}
        />
      </div>

      {/* Chat Area - Responsive */}
      <div 
        className={`
          h-screen min-w-0 flex-1
          ${chatPartnerId ? 'block' : 'hidden sm:block'}
        `}
      >
        {children}
      </div>
    </div>
  );
}