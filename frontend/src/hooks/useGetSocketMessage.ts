"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useSocketContext } from "@/context/SocketContext";
import { messageService, normalizeMessage } from "@/services/message.service";
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

const getPartnerId = (message: Message, currentUserId?: string) => {
  const senderId = getSenderId(message);
  const receiverId = getReceiverId(message);

  if (!currentUserId) return senderId || receiverId;

  return senderId === currentUserId ? receiverId : senderId;
};

const getPartnerName = (incoming: any, currentUserId?: string) => {
  const senderId = getSenderId(incoming);
  const senderName = getSenderName(incoming);
  const receiverName = getReceiverName(incoming);

  if (currentUserId && senderId === currentUserId) {
    return receiverName || incoming?.chatPartnerName || "";
  }

  return senderName || incoming?.chatPartnerName || "";
};

const getMessageText = (message: any) => {
  return message?.message || message?.text || message?.content || "";
};

export const useGetSocketMessage = (activeChatPartnerId?: string | null) => {
  const { socket } = useSocketContext();
  const { user } = useAuth();
  const { messages, setMessages } = useChat();

  const activeChatPartnerIdRef = useRef<string | null | undefined>(
    activeChatPartnerId
  );

  const messageIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    activeChatPartnerIdRef.current = activeChatPartnerId;
  }, [activeChatPartnerId]);

  useEffect(() => {
    messageIdsRef.current = new Set(messages.map((message) => message._id));
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (incoming: any) => {
      const newMessage = normalizeMessage(incoming);
      const partnerId = getPartnerId(newMessage, user?._id);

      if (!partnerId) return;

      const activeId = activeChatPartnerIdRef.current;
      const belongsToOpenChat = Boolean(activeId && activeId === partnerId);

      const partnerName = getPartnerName(incoming, user?._id);

      window.dispatchEvent(
        new CustomEvent("chat:message-received", {
          detail: {
            chatPartnerId: partnerId,
            chatPartnerName: partnerName,
            message: getMessageText(newMessage),
            shouldIncrementUnread: !belongsToOpenChat,
          },
        })
      );

      if (!belongsToOpenChat) return;

      if (!messageIdsRef.current.has(newMessage._id)) {
        setMessages((prev) => {
          const exists = prev.some((msg) => msg._id === newMessage._id);
          return exists ? prev : [...prev, newMessage];
        });

        messageIdsRef.current.add(newMessage._id);
      }

      const senderId = getSenderId(newMessage);

      if (senderId && senderId !== user?._id) {
        messageService.markMessageAsReadLocally(newMessage._id);

        window.dispatchEvent(
          new CustomEvent("chat:clear-unread", {
            detail: { chatPartnerId: partnerId },
          })
        );

        socket.emit("messageRead", {
          chatPartnerId: partnerId,
          conversationId: partnerId,
          userId: user?._id,
        });
      }
    };

    const handleMessageRead = (data: any) => {
      const id = data?.chatPartnerId || data?.conversationId;

      if (!id) return;

      window.dispatchEvent(
        new CustomEvent("chat:clear-unread", {
          detail: { chatPartnerId: id },
        })
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageRead", handleMessageRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageRead", handleMessageRead);
    };
  }, [socket, setMessages, user?._id]);
};

export default useGetSocketMessage;