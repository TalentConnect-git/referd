// hooks/useGetSocketMessage.ts
"use client";

import { useEffect, useRef } from "react";
import { useSocketContext } from "@/context/SocketContext";
import { useChat } from "@/context/ChatContext";
import { Message } from "@/types/chat";
import { useAuth } from "@/context/AuthContext";
import { messageService } from "@/services/message.service";

export const useGetSocketMessage = () => {
  const { socket } = useSocketContext();
  const { messages, setMessages, selectedConversation } = useChat();
  const { user } = useAuth();
  const messageIdsRef = useRef<Set<string>>(new Set());

  // Keep message IDs up to date for duplicate prevention
  useEffect(() => {
    messageIdsRef.current = new Set(messages.map((msg) => msg._id));
  }, [messages]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: Message) => {
      // Prevent duplicates
      if (messageIdsRef.current.has(newMessage._id)) return;

      // Only add if it belongs to the currently open conversation
      if (selectedConversation && newMessage.conversationId === selectedConversation._id) {
        setMessages((prev) => [...prev, newMessage]);
        messageIdsRef.current.add(newMessage._id);

        // If the message is from someone else, mark it as read and emit read event
        const senderId =
          typeof newMessage.sender === "string" ? newMessage.sender : newMessage.sender?._id;
        if (senderId !== user?._id) {
          messageService.markMessageAsReadLocally(newMessage._id);
          socket.emit("messageRead", {
            conversationId: selectedConversation._id,
            userId: user?._id,
          });
        }
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConversation, setMessages, user]);
};

export default useGetSocketMessage;