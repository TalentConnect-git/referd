"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useSocketContext } from "@/context/SocketContext";
import {
  messageService,
  normalizeMessage,
} from "@/services/message.service";
import { Message } from "@/types/chat";

const getSenderId = (message: any) => {
  return (
    message?.senderId ||
    message?.sender?._id ||
    (typeof message?.sender === "string" ? message.sender : "") ||
    ""
  );
};

const getReceiverId = (message: any) => {
  return (
    message?.receiverId ||
    message?.receiver?._id ||
    (typeof message?.receiver === "string" ? message.receiver : "") ||
    ""
  );
};

const getSenderName = (message: any) => {
  return (
    message?.sender?.name ||
    message?.senderName ||
    message?.fromName ||
    message?.user?.name ||
    ""
  );
};

const getReceiverName = (message: any) => {
  return (
    message?.receiver?.name ||
    message?.receiverName ||
    message?.toName ||
    ""
  );
};

const getPartnerId = (
  message: Message,
  currentUserId?: string
) => {
  const senderId = getSenderId(message);
  const receiverId = getReceiverId(message);

  if (!currentUserId) {
    return senderId || receiverId;
  }

  if (senderId === currentUserId) {
    return receiverId;
  }

  return senderId;
};

const getPartnerName = (
  incoming: any,
  currentUserId?: string
) => {
  const senderId = getSenderId(incoming);
  const senderName = getSenderName(incoming);
  const receiverName = getReceiverName(incoming);

  if (currentUserId && senderId === currentUserId) {
    return (
      receiverName ||
      incoming?.chatPartnerName ||
      ""
    );
  }

  return (
    senderName ||
    incoming?.chatPartnerName ||
    ""
  );
};

const getMessageText = (message: any) => {
  return (
    message?.message ||
    message?.text ||
    message?.content ||
    ""
  );
};

export const useGetSocketMessage = (
  activeChatPartnerId?: string | null
) => {
  const { socket } = useSocketContext();
  const { user } = useAuth();
  const { messages, setMessages } = useChat();

  const activeChatPartnerIdRef = useRef<
    string | null | undefined
  >(activeChatPartnerId);

  const messageIdsRef = useRef<Set<string>>(new Set());

  const markingReadRef = useRef<Set<string>>(
    new Set()
  );

  useEffect(() => {
    activeChatPartnerIdRef.current =
      activeChatPartnerId;
  }, [activeChatPartnerId]);

  /**
   * Keep current message IDs synchronized
   * to prevent duplicate socket messages.
   */
  useEffect(() => {
    messageIdsRef.current = new Set(
      messages.map((message) => message._id)
    );
  }, [messages]);

  /**
   * Mark all unread messages of active conversation
   * as read using backend API.
   */
  const markConversationAsRead = async (
    conversationId: string
  ) => {
    if (!conversationId || !user?._id) {
      return;
    }

    /**
     * Prevent duplicate simultaneous API calls
     * for same conversation.
     */
    if (
      markingReadRef.current.has(conversationId)
    ) {
      return;
    }

    markingReadRef.current.add(conversationId);

    try {
      await messageService.markMessagesAsRead(
        conversationId
      );

      /**
       * Receiver-side local state:
       * any received messages in this open chat
       * are considered read immediately.
       */
      setMessages((prev) =>
        prev.map((message) => {
          const senderId =
            getSenderId(message);

          const receiverId =
            getReceiverId(message);

          /**
           * Only mark messages received by
           * current user as read.
           */
          if (
            receiverId === user._id &&
            senderId !== user._id &&
            !message.read
          ) {
            return {
              ...message,
              read: true,
              
            };
          }

          return message;
        })
      );

      window.dispatchEvent(
        new CustomEvent("chat:clear-unread", {
          detail: {
            chatPartnerId: conversationId,
          },
        })
      );
    } catch (error) {
      console.error(
        "❌ Failed to mark messages as read:",
        error
      );
    } finally {
      markingReadRef.current.delete(
        conversationId
      );
    }
  };

  /**
   * Socket listeners.
   *
   * IMPORTANT:
   * This hook should be mounted only once
   * in your chat layout.
   */
  useEffect(() => {
    if (!socket || !user?._id) {
      return;
    }

    /**
     * NEW MESSAGE
     */
    const handleNewMessage = async (
      incoming: any
    ) => {
      const newMessage =
        normalizeMessage(incoming);

      if (!newMessage?._id) {
        return;
      }

      const partnerId = getPartnerId(
        newMessage,
        user._id
      );

      if (!partnerId) {
        return;
      }

      const activeId =
        activeChatPartnerIdRef.current;

      const belongsToOpenChat =
        Boolean(
          activeId &&
            activeId === partnerId
        );

      const partnerName =
        getPartnerName(
          incoming,
          user._id
        );

      /**
       * Notify sidebar / conversation list.
       */
      window.dispatchEvent(
        new CustomEvent(
          "chat:message-received",
          {
            detail: {
              chatPartnerId:
                partnerId,

              chatPartnerName:
                partnerName,

              message:
                getMessageText(
                  newMessage
                ),

              shouldIncrementUnread:
                !belongsToOpenChat,
            },
          }
        )
      );

      /**
       * Avoid adding same message twice.
       */
      if (
        !messageIdsRef.current.has(
          newMessage._id
        )
      ) {
        setMessages((prev) => {
          const exists = prev.some(
            (msg) =>
              msg._id ===
              newMessage._id
          );

          if (exists) {
            return prev;
          }

          return [
            ...prev,
            newMessage,
          ];
        });

        messageIdsRef.current.add(
          newMessage._id
        );
      }

      /**
       * If message belongs to current
       * open conversation, immediately
       * mark it read on backend.
       */
      if (belongsToOpenChat) {
        const senderId =
          getSenderId(newMessage);

        if (
          senderId &&
          senderId !== user._id
        ) {
          await markConversationAsRead(
            partnerId
          );
        }
      }
    };

    /**
     * READ RECEIPT
     *
     * Backend emits:
     *
     * messages:read
     * {
     *   conversationId,
     *   messageIds,
     *   readBy,
     *   readAt
     * }
     */
    const handleMessagesRead = (
      data: any
    ) => {
      const messageIds =
        Array.isArray(
          data?.messageIds
        )
          ? data.messageIds.map(
              (id: any) =>
                String(id)
            )
          : [];

      if (
        messageIds.length === 0
      ) {
        return;
      }

      const readAt =
        data?.readAt ||
        new Date().toISOString();

      /**
       * Update sender-side messages.
       *
       * These are the messages that
       * were originally sent by
       * current user.
       */
      setMessages((prev) =>
        prev.map((message) => {
          const messageId =
            String(message._id);

          if (
            !messageIds.includes(
              messageId
            )
          ) {
            return message;
          }

          const senderId =
            getSenderId(message);

          /**
           * Don't modify incoming
           * messages accidentally.
           */
          if (
            senderId !== user._id
          ) {
            return message;
          }

          return {
            ...message,
            read: true,
            readAt,
          };
        })
      );

      window.dispatchEvent(
        new CustomEvent(
          "chat:messages-read",
          {
            detail: {
              conversationId:
                data?.conversationId ||
                null,

              messageIds,
              readBy:
                data?.readBy ||
                null,

              readAt,
            },
          }
        )
      );
    };

    socket.on(
      "newMessage",
      handleNewMessage
    );

    socket.on(
      "messages:read",
      handleMessagesRead
    );

    /**
     * Cleanup.
     */
    return () => {
      socket.off(
        "newMessage",
        handleNewMessage
      );

      socket.off(
        "messages:read",
        handleMessagesRead
      );
    };
  }, [
    socket,
    user?._id,
    setMessages,
  ]);

  /**
   * When user opens a conversation,
   * call backend mark-read API.
   */
  useEffect(() => {
    if (
      !activeChatPartnerId ||
      !user?._id
    ) {
      return;
    }

    markConversationAsRead(
      activeChatPartnerId
    );
  }, [
    activeChatPartnerId,
    user?._id,
  ]);
};

export default useGetSocketMessage;