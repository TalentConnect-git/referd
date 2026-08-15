"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import {
  AlertCircle,
  RefreshCw,
} from "lucide-react";

import { useChat } from "@/context/ChatContext";
import { useSocketContext } from "@/context/SocketContext";
import { useGetMessages } from "@/hooks/useGetMessages";
import useSendMessage from "@/hooks/useSendMessage";
import { ChatArea } from "@/components/chat/ChatArea";
import { Conversation } from "@/types/chat";

interface ConversationPageClientProps {
  conversationId: string;
}

const getRolePathFromPathname = (
  pathname: string
): string => {
  const first = pathname
    .split("/")
    .filter(Boolean)[0];

  if (first === "professional") {
    return "professional";
  }

  if (first === "student") {
    return "student";
  }

  if (first === "fresher") {
    return "fresher";
  }

  return "student";
};

const createTempConversation = (
  id: string,
  name: string,
  profileImage?: string
): Conversation => {
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

export default function ConversationPageClient({
  conversationId,
}: ConversationPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const rolePath =
    getRolePathFromPathname(pathname);

  const userNameFromUrl =
    searchParams.get("userName") || "User";

  const profileImageFromUrl =
    searchParams.get("profileImage") || "";

  const { onlineUsers } =
    useSocketContext();

  const {
    selectedConversation,
    messages,
    setSelectedConversation,
  } = useChat();

  const [newMessage, setNewMessage] =
    useState("");

  const { sendMessages } =
    useSendMessage();

  /**
   * Fallback conversation.
   *
   * Used when the conversation is opened
   * directly from URL and the conversation
   * is not yet present in ChatContext.
   */
  const fallbackConversation = useMemo(() => {
    return createTempConversation(
      conversationId,
      userNameFromUrl,
      profileImageFromUrl
    );
  }, [
    conversationId,
    userNameFromUrl,
    profileImageFromUrl,
  ]);

  /**
   * Resolve the active conversation.
   */
  const activeConversation = useMemo(() => {
    if (
      selectedConversation?._id ===
      conversationId
    ) {
      /**
       * If selected conversation does not
       * contain profile image but URL does,
       * enrich it with URL image.
       */
      if (
        !selectedConversation.profileImage &&
        profileImageFromUrl
      ) {
        return {
          ...selectedConversation,
          profileImage:
            profileImageFromUrl,
        };
      }

      return selectedConversation;
    }

    return fallbackConversation;
  }, [
    selectedConversation,
    conversationId,
    fallbackConversation,
    profileImageFromUrl,
  ]);

  /**
   * Set active conversation and clear
   * local/sidebar unread count.
   *
   * IMPORTANT:
   * Backend mark-read API is NOT called here.
   *
   * Read receipt handling is centralized
   * inside useGetSocketMessage().
   */
  useEffect(() => {
    if (!activeConversation) {
      return;
    }

    if (
      selectedConversation?._id !==
      activeConversation._id
    ) {
      setSelectedConversation(
        activeConversation
      );
    }

    /**
     * Notify conversation/sidebar UI
     * that this conversation is currently open.
     */
    window.dispatchEvent(
      new CustomEvent(
        "chat:open-conversation",
        {
          detail: {
            chatPartnerId:
              activeConversation._id,

            chatPartnerName:
              activeConversation.name,

            chatPartnerImage:
              activeConversation.profileImage ||
              "",
          },
        }
      )
    );

    /**
     * Clear local unread badge immediately.
     */
    window.dispatchEvent(
      new CustomEvent(
        "chat:clear-unread",
        {
          detail: {
            chatPartnerId:
              activeConversation._id,
          },
        }
      )
    );
  }, [
    activeConversation,
    selectedConversation?._id,
    setSelectedConversation,
  ]);

  /**
   * DO NOT call useGetSocketMessage()
   * in this component.
   *
   * It must be mounted ONCE globally
   * in MessageLayoutShell.
   *
   * That hook is responsible for:
   *
   * 1. newMessage socket listener
   * 2. mark-read API
   * 3. messages:read socket listener
   * 4. updating read=true locally
   */

  /**
   * Load conversation messages.
   */
  const {
    loading: messagesLoading,
    error: messagesError,
    refreshMessages,
  } = useGetMessages(conversationId);

  /**
   * Get display name.
   */
  const getDisplayName = useCallback(() => {
    return (
      activeConversation?.name ||
      userNameFromUrl ||
      "User"
    );
  }, [
    activeConversation?.name,
    userNameFromUrl,
  ]);

  /**
   * Get profile image.
   */
  const getProfileImage = useCallback(() => {
    return (
      activeConversation?.profileImage ||
      profileImageFromUrl ||
      ""
    );
  }, [
    activeConversation?.profileImage,
    profileImageFromUrl,
  ]);

  /**
   * Get avatar initial.
   */
  const getAvatarInitial =
    useCallback(() => {
      const name =
        getDisplayName();

      return (
        name.charAt(0).toUpperCase() ||
        "U"
      );
    }, [getDisplayName]);

  /**
   * Partner online state.
   */
  const isPartnerOnline = useMemo(() => {
    return Boolean(
      onlineUsers?.includes(
        conversationId
      )
    );
  }, [
    onlineUsers,
    conversationId,
  ]);

  /**
   * Format date separator.
   */
  const formatMessageDate =
    useCallback((date: string) => {
      if (!date) {
        return "";
      }

      const d = new Date(date);

      if (
        Number.isNaN(d.getTime())
      ) {
        return "";
      }

      const today = new Date();

      const yesterday =
        new Date(today);

      yesterday.setDate(
        yesterday.getDate() - 1
      );

      if (
        d.toDateString() ===
        today.toDateString()
      ) {
        return "Today";
      }

      if (
        d.toDateString() ===
        yesterday.toDateString()
      ) {
        return "Yesterday";
      }

      return d.toLocaleDateString(
        "en-US",
        {
          month: "short",
          day: "numeric",
          year: "numeric",
        }
      );
    }, []);

  /**
   * Format message time.
   */
  const formatMessageTime =
    useCallback((date: string) => {
      if (!date) {
        return "";
      }

      const parsedDate =
        new Date(date);

      if (
        Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        return "";
      }

      return parsedDate.toLocaleTimeString(
        "en-US",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    }, []);

  /**
   * Send message.
   */
  const handleSendMessage =
    useCallback(async () => {
      const text =
        newMessage.trim();

      if (
        !text ||
        !conversationId
      ) {
        return;
      }

      /**
       * Clear input immediately.
       */
      setNewMessage("");

      try {
        await sendMessages(
          text,
          conversationId,
          getDisplayName()
        );
      } catch (error) {
        /**
         * Put message back into input
         * if sending fails.
         */
        setNewMessage(text);

        console.error(
          "❌ Failed to send message:",
          error
        );
      }
    }, [
      newMessage,
      conversationId,
      sendMessages,
      getDisplayName,
    ]);

  /**
   * Message loading/error state.
   */
  if (messagesError) {
    return (
      <div
        className="flex h-full flex-1 items-center justify-center"
        style={{
          background:
            "var(--background)",
        }}
      >
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-card">
            <AlertCircle className="h-10 w-10 text-danger" />
          </div>

          <h3 className="mb-2 text-lg font-semibold text-primary">
            Failed to load messages
          </h3>

          <p className="mx-auto max-w-sm text-sm text-muted">
            {messagesError}
          </p>

          <button
            type="button"
            onClick={refreshMessages}
            className="btn-primary mt-6 rounded-xl bg-primary px-6 py-3 text-inverse transition-all hover:bg-primary-hover"
          >
            <RefreshCw className="mr-2 inline h-4 w-4" />
            Retry
          </button>
        </div>
      </div>
    );
  }

  /**
   * Chat UI.
   */
  return (
    <ChatArea
      conversation={
        activeConversation
      }
      messages={messages}
      messagesLoading={
        messagesLoading
      }
      newMessage={newMessage}
      onNewMessageChange={
        setNewMessage
      }
      onSendMessage={
        handleSendMessage
      }
      isPartnerOnline={
        isPartnerOnline
      }
      getDisplayName={
        getDisplayName
      }
      getProfileImage={
        getProfileImage
      }
      getAvatarInitial={
        getAvatarInitial
      }
      formatMessageDate={
        formatMessageDate
      }
      formatMessageTime={
        formatMessageTime
      }
      onBack={() =>
        router.push(
          `/${rolePath}/message`
        )
      }
      isCreatingConversation={
        false
      }
    />
  );
}