"use client";

import { useCallback, useRef } from "react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { useChat } from "@/context/ChatContext";
import { useSocketContext } from "@/context/SocketContext";
import { messageService, normalizeMessage } from "@/services/message.service";
import { Message } from "@/types/chat";

interface UseSendMessageReturn {
  sendMessages: (
    message: string,
    receiverId?: string,
    receiverName?: string
  ) => Promise<Message | null>;
}

const useSendMessage = (): UseSendMessageReturn => {
  const { user } = useAuth();
  const { selectedConversation, setMessages } = useChat();
  const { socket } = useSocketContext();

  const isSendingRef = useRef(false);

  const sendMessages = useCallback(
    async (
      message: string,
      receiverId?: string,
      receiverName?: string
    ): Promise<Message | null> => {
      const activeReceiverId = receiverId || selectedConversation?._id;
      const activeReceiverName =
        receiverName || selectedConversation?.name || "User";

      const text = message.trim();

      if (!activeReceiverId) {
        toast.error("No user selected");
        return null;
      }

      if (!text) {
        toast.error("Message cannot be empty");
        return null;
      }

      if (isSendingRef.current) return null;

      isSendingRef.current = true;

      try {
        const response = await messageService.sendMessage(activeReceiverId, text);

        const newMessage = normalizeMessage(response, {
          senderId: user?._id,
          receiverId: activeReceiverId,
          text,
        });

        setMessages((prev) => {
          const exists = prev.some((msg) => msg._id === newMessage._id);
          return exists ? prev : [...prev, newMessage];
        });

        window.dispatchEvent(
          new CustomEvent("chat:message-sent", {
            detail: {
              chatPartnerId: activeReceiverId,
              chatPartnerName: activeReceiverName,
              message: text,
            },
          })
        );

        socket?.emit("newMessage", newMessage);

        return newMessage;
      } catch (error: any) {
        console.error("sendMessages error:", error);

        toast.error(
          error?.response?.data?.message ||
            error?.response?.data?.error ||
            "Failed to send message"
        );

        return null;
      } finally {
        isSendingRef.current = false;
      }
    },
    [selectedConversation?._id, selectedConversation?.name, setMessages, socket, user?._id]
  );

  return { sendMessages };
};

export default useSendMessage;